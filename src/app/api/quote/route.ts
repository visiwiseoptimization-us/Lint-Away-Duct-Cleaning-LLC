import { NextResponse } from 'next/server';
import { citySlugs } from '@/data/cities';
import { serviceSlugs } from '@/data/services';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Lead intake.
 *
 * Deliberately dependency-free: validation is hand-rolled and Supabase is
 * called over its REST endpoint with fetch. That keeps the serverless bundle
 * small and, more to the point, means the route degrades gracefully — if
 * Supabase is not configured yet the lead still gets emailed rather than lost.
 *
 * The service-role key is read from the environment and never leaves the
 * server. It must NOT be prefixed NEXT_PUBLIC_.
 */

type Lead = {
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  message: string;
};

const MAX = { name: 120, phone: 40, email: 200, message: 2000 };

// Very small in-memory limiter. Serverless instances are ephemeral, so this
// stops a single burst rather than a distributed campaign — the honeypot and
// the database-side unique constraint do the rest.
const hits = new Map<string, { n: number; reset: number }>();
function rateLimited(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    hits.set(ip, { n: 1, reset: now + 60_000 });
    return false;
  }
  rec.n += 1;
  return rec.n > 5;
}

function clean(v: unknown, max: number) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function validate(body: Record<string, unknown>): { lead: Lead } | { error: string } {
  const name = clean(body.name, MAX.name);
  const phone = clean(body.phone, MAX.phone);
  const email = clean(body.email, MAX.email);
  const city = clean(body.city, 60);
  const service = clean(body.service, 60);
  const message = clean(body.message, MAX.message);

  if (name.length < 2) return { error: 'Please tell us your name.' };
  if (!/^[\d\s()+.-]{7,}$/.test(phone)) return { error: 'That phone number does not look right.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: 'That email does not look right.' };
  if (city !== 'other' && !citySlugs.includes(city)) return { error: 'Please pick a city.' };
  if (service !== 'not-sure' && !serviceSlugs.includes(service)) {
    return { error: 'Please pick a service.' };
  }
  return { lead: { name, phone, email, city, service, message } };
}

async function saveToSupabase(lead: Lead, meta: Record<string, unknown>) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false, skipped: true as const };

  const res = await fetch(`${url}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify([{ ...lead, ...meta }]),
  });
  return { ok: res.ok, skipped: false as const, status: res.status };
}

async function notify(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL ?? 'leads@lintawayductcleaning.com';
  if (!key || !to) return { ok: false, skipped: true as const };

  const rows = Object.entries(lead)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${k}</b></td><td>${v || '—'}</td></tr>`)
    .join('');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: to.split(',').map((s) => s.trim()),
      reply_to: lead.email,
      subject: `New quote request — ${lead.name} (${lead.city})`,
      html: `<h2>New quote request</h2><table>${rows}</table>`,
    }),
  });
  return { ok: res.ok, skipped: false as const };
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  // Honeypot. Return 200 so the bot believes it succeeded and moves on.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const result = validate(body);
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 400 });
  const { lead } = result;

  const meta = {
    source_path: req.headers.get('referer') ?? null,
    user_agent: req.headers.get('user-agent')?.slice(0, 300) ?? null,
    submitted_at: new Date().toISOString(),
  };

  const [db, mail] = await Promise.allSettled([saveToSupabase(lead, meta), notify(lead)]);

  const stored = db.status === 'fulfilled' && db.value.ok;
  const mailed = mail.status === 'fulfilled' && mail.value.ok;

  // If neither sink accepted the lead, tell the visitor rather than silently
  // dropping it — a lost lead is worse than an honest error.
  if (!stored && !mailed) {
    const bothSkipped =
      db.status === 'fulfilled' &&
      db.value.skipped &&
      mail.status === 'fulfilled' &&
      mail.value.skipped;
    if (bothSkipped) {
      console.warn('[quote] No lead sink configured. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY or RESEND_API_KEY.');
      console.info('[quote] Lead received:', lead);
      return NextResponse.json({ ok: true, warning: 'no-sink-configured' });
    }
    console.error('[quote] All sinks failed', { db, mail });
    return NextResponse.json({ error: 'We could not save your request.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, stored, mailed });
}
