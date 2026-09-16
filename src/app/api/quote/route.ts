import { NextResponse } from 'next/server';
import { citySlugs, cityBySlug } from '@/data/cities';
import { serviceSlugs, serviceBySlug } from '@/data/services';
import { business } from '@/data/business';

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

/**
 * Escape anything that came from the form before it goes into HTML.
 *
 * Every field here is attacker-controlled. Without this, someone could put
 * markup — or a link — in the message box and it would render live inside the
 * notification email. Email clients are a phishing surface like any other.
 */
function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Turn the stored slugs back into something a human reads at a glance. */
function readable(lead: Lead) {
  const city =
    lead.city === 'other'
      ? 'Elsewhere in the Valley'
      : (cityBySlug.get(lead.city)?.fullName ?? lead.city);
  const service =
    lead.service === 'not-sure'
      ? 'Not sure yet — needs advice'
      : (serviceBySlug.get(lead.service)?.name ?? lead.service);
  return { city, service };
}

async function notify(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  // Resend recommends sending from a subdomain so the sending reputation stays
  // separate from the company's regular mail on the root domain.
  const from = process.env.LEAD_FROM_EMAIL ?? 'Lint Away Website <leads@send.lintawayductcleaning.com>';
  if (!key || !to) return { ok: false, skipped: true as const };

  const { city, service } = readable(lead);
  const telHref = lead.phone.replace(/[^\d+]/g, '');

  // Built for a phone: these get read in a van between jobs, not at a desk.
  // Big tap targets for call and email, details underneath.
  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f6fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
    <div style="background:#0D4A5C;border-radius:16px 16px 0 0;padding:22px 24px;">
      <div style="color:#3BC6EA;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">New quote request</div>
      <div style="color:#fff;font-size:24px;font-weight:700;margin-top:6px;">${esc(lead.name)}</div>
      <div style="color:rgba(255,255,255,.75);font-size:15px;margin-top:4px;">${esc(service)} &middot; ${esc(city)}</div>
    </div>

    <div style="background:#fff;padding:22px 24px;">
      <table role="presentation" width="100%" style="border-collapse:collapse;">
        <tr>
          <td style="padding:0 6px 10px 0;width:50%;">
            <a href="tel:${esc(telHref)}" style="display:block;text-align:center;background:#E8192C;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 10px;border-radius:10px;">Call ${esc(lead.phone)}</a>
          </td>
          <td style="padding:0 0 10px 6px;width:50%;">
            <a href="mailto:${esc(lead.email)}" style="display:block;text-align:center;background:#EBF8FC;color:#0D4A5C;text-decoration:none;font-weight:700;font-size:15px;padding:14px 10px;border-radius:10px;">Email back</a>
          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" style="border-collapse:collapse;font-size:15px;color:#2E2E4A;margin-top:8px;">
        <tr><td style="padding:9px 0;border-top:1px solid #E8EAF0;color:#8C8FA0;width:96px;">Phone</td><td style="padding:9px 0;border-top:1px solid #E8EAF0;">${esc(lead.phone)}</td></tr>
        <tr><td style="padding:9px 0;border-top:1px solid #E8EAF0;color:#8C8FA0;">Email</td><td style="padding:9px 0;border-top:1px solid #E8EAF0;">${esc(lead.email)}</td></tr>
        <tr><td style="padding:9px 0;border-top:1px solid #E8EAF0;color:#8C8FA0;">City</td><td style="padding:9px 0;border-top:1px solid #E8EAF0;">${esc(city)}</td></tr>
        <tr><td style="padding:9px 0;border-top:1px solid #E8EAF0;color:#8C8FA0;">Service</td><td style="padding:9px 0;border-top:1px solid #E8EAF0;">${esc(service)}</td></tr>
      </table>

      ${
        lead.message
          ? `<div style="margin-top:16px;padding:14px 16px;background:#F5F7FF;border-left:3px solid #45ABC0;border-radius:0 8px 8px 0;font-size:15px;line-height:1.6;color:#2E2E4A;white-space:pre-wrap;">${esc(lead.message)}</div>`
          : ''
      }
    </div>

    <div style="background:#fff;border-radius:0 0 16px 16px;padding:14px 24px 20px;border-top:1px solid #E8EAF0;color:#8C8FA0;font-size:12px;line-height:1.6;">
      Sent from the quote form on ${esc(business.url.replace('https://', ''))}.
      Reply to this email and it goes straight to the customer.
    </div>
  </div>
</body></html>`;

  const text = [
    `NEW QUOTE REQUEST`,
    ``,
    `${lead.name}`,
    `${service} — ${city}`,
    ``,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    lead.message ? `\nMessage:\n${lead.message}` : '',
    ``,
    `Sent from the quote form on ${business.url}.`,
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: to.split(',').map((s) => s.trim()),
      // Hitting reply goes to the customer, not to the website.
      reply_to: lead.email,
      // Service and city up front so it is triageable from the inbox list.
      subject: `${service} — ${city} — ${lead.name}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    console.error('[quote] Resend rejected the send:', res.status, await res.text().catch(() => ''));
  }
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
