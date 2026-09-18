import type { Metadata } from 'next';
import Link from 'next/link';
import CityBelt from '@/components/CityBelt';
import CityGrid from '@/components/CityGrid';
import CtaBanner from '@/components/CtaBanner';
import QuoteForm from '@/components/QuoteForm';
import ShortsStrip from '@/components/ShortsStrip';
import JsonLd from '@/components/JsonLd';
import { services } from '@/data/services';
import { cities } from '@/data/cities';
import { serviceNode, faqNode } from '@/lib/schema';
import { business } from '@/data/business';

export const metadata: Metadata = {
  title: 'Lint Away Duct Cleaning — Phoenix Valley Air Duct & Dryer Vent Experts',
  description:
    'Camera-verified air duct and dryer vent cleaning across the Phoenix Valley — Phoenix, Tempe, Mesa, Chandler, Gilbert, Scottsdale, Ahwatukee and Paradise Valley. Same-day slots available.',
  alternates: { canonical: '/' },
};

/** The four service FAQs, deduplicated, become the homepage FAQPage. */
const homeFaqs = services.flatMap((s) => s.faqs).slice(0, 8);

export default function Home() {
  return (
    <>
      <JsonLd data={faqNode(homeFaqs, business.url)} />
      {services.map((s) => (
        <JsonLd key={s.slug} data={serviceNode(s)} />
      ))}

      <section id="hero">
        <div className="hero-inner">
          {/* LEFT: Copy */}
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-dot"></div>
              <span>Phoenix Valley's #1 Duct Cleaners</span>
            </div>

            <h1 className="hero-h1">
              Your Home Deserves<br />
              <span className="accent-red">Clean Air.</span><br />
              Not Hidden Gunk.
            </h1>

            <p className="hero-tagline">Cleaning the valley, one duct at a time.</p>

            <p className="hero-body">
              Camera-inspected air duct &amp; dryer vent cleaning for homes and businesses across Phoenix Valley. No guessing — we show you every before and after.
            </p>

            <div className="hero-actions">
              <a href="#quote" className="btn btn-red">Get a Free Estimate →</a>
              <a href="tel:4808779808" className="btn btn-ghost-white">📞 (480) 877-9808</a>
            </div>

            <div className="hero-stars">
              <div className="hero-stars-icons">★★★★★</div>
              {/* Reads from business.ts so the hero can never drift from the
                  data file again — the previous hard-coded "5.0 · 200+" claimed
                  a rating the business does not have. */}
              <div className="hero-stars-text">
                {business.socialProof.rating} on {business.socialProof.reviewSource} ·{' '}
                {business.socialProof.reviewCount} reviews
              </div>
            </div>
          </div>

          {/* RIGHT: Big Clumpy */}
          <div className="hero-mascot-wrap">
            <div className="clumpy-container">
              <div className="clumpy-svg-wrap">
                <img src="/Big-Clumpy.png" alt="Big Clumpy — Lint Away's mascot" />
              </div>
              <div className="clumpy-shadow"></div>

              {/* Floati.ng chips */}
              <div className="hero-chip hero-chip-1">
                <span className="hero-chip-icon">📹</span>Camera-Inspected
              </div>
              <div className="hero-chip hero-chip-2">
                <span className="hero-chip-icon">⚡</span>Same-Day Available
              </div>
              <div className="hero-chip hero-chip-3">
                <span className="hero-chip-icon">🏆</span>500M+ Views
              </div>
            </div>
          </div>
        </div>

        {/* ── Arizona Landscape ── */}

        {/* Mountain silhouette */}
        <div className="hero-mountains">
          <svg viewBox="0 0 1440 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block', width: '100%', height: '230px'}}>
            <defs>
              <linearGradient id="mtnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7A8EA8" />
                <stop offset="100%" stopColor="#5E7088" />
              </linearGradient>
            </defs>
            {/* Back range — symmetric peaks, both edges at y≈100 */}
            <path d="M0,100
                     Q70,42 150,82
                     Q230,28 350,70
                     Q440,12 560,58
                     Q650,5  720,55
                     Q790,5  880,58
                     Q960,12 1090,70
                     Q1180,28 1300,82
                     Q1370,42 1440,100
                     L1440,160 L0,160 Z"
                  fill="#9AAEC0" opacity="0.5" />
            {/* Main range — symmetric peaks, both edges at y≈128 */}
            <path d="M0,128
                     Q60,58  130,96
                     Q215,32 330,82
                     Q415,10 540,72
                     Q630,2  720,62
                     Q810,2  900,72
                     Q985,10 1110,82
                     Q1195,32 1310,96
                     Q1380,58 1440,128
                     L1440,160 L0,160 Z"
                  fill="url(#mtnGrad)" />
            {/* Foreground rocky ridge */}
            <path d="M0,152 Q120,136 240,150 Q360,133 480,148 Q600,131 720,148 Q840,131 960,148 Q1080,133 1200,150 Q1320,136 1440,152 L1440,160 L0,160 Z" fill="#6A7E98" />
          </svg>
        </div>

        {/* ─── LEFT BACKGROUND: tall saguaro — z-index 3, behind van ─── */}
        <div className="hero-cactus-bg hero-cactus-bg-left">
          <svg viewBox="0 0 165 430" width="165" height="430" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
            <defs>
              <linearGradient id="cactusGradLBG" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#265A22" />
                <stop offset="45%" stopColor="#3E7E32" />
                <stop offset="100%" stopColor="#2E6B28" />
              </linearGradient>
            </defs>
            {/* Main trunk */}
            <rect x="62" y="50" width="30" height="380" rx="15" fill="url(#cactusGradLBG)" />
            {/* Left arm: horizontal jog then up */}
            <rect x="16" y="155" width="48" height="20" rx="10" fill="url(#cactusGradLBG)" />
            <rect x="8"  y="78"  width="22" height="97"  rx="11" fill="url(#cactusGradLBG)" />
            {/* Right arm: horizontal jog then up */}
            <rect x="90"  y="205" width="48" height="20" rx="10" fill="url(#cactusGradLBG)" />
            <rect x="116" y="115" width="22" height="110" rx="11" fill="url(#cactusGradLBG)" />
            {/* Rib lines */}
            <line x1="74" y1="50"  x2="74" y2="430" stroke="#336A28" strokeWidth="1.5" opacity="0.45" />
            <line x1="80" y1="50"  x2="80" y2="430" stroke="#5CAA50" strokeWidth="1"   opacity="0.22" />
            {/* Spine dots */}
            <circle cx="62"  cy="125" r="2"   fill="#6DBF60" opacity="0.65" />
            <circle cx="62"  cy="185" r="2"   fill="#6DBF60" opacity="0.65" />
            <circle cx="62"  cy="250" r="2"   fill="#6DBF60" opacity="0.65" />
            <circle cx="92"  cy="140" r="1.8" fill="#6DBF60" opacity="0.65" />
          </svg>
        </div>

        {/* ─── LEFT FOREGROUND: small cactus — z-index 6, in front of van ─── */}
        <div className="hero-cactus-fg hero-cactus-fg-left">
          <svg viewBox="0 0 95 295" width="95" height="295" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
            <defs>
              <linearGradient id="cactusGradLFG" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2E6228" />
                <stop offset="55%" stopColor="#4E9040" />
                <stop offset="100%" stopColor="#3A7830" />
              </linearGradient>
            </defs>
            {/* Main trunk */}
            <rect x="36" y="65" width="28" height="230" rx="14" fill="url(#cactusGradLFG)" />
            {/* Left arm: jog out then up */}
            <rect x="0"  y="135" width="38" height="17" rx="8.5" fill="url(#cactusGradLFG)" />
            <rect x="0"  y="82"  width="20" height="72"  rx="10"  fill="url(#cactusGradLFG)" />
            {/* Rib line */}
            <line x1="47" y1="65" x2="47" y2="295" stroke="#3A7A30" strokeWidth="1.2" opacity="0.38" />
            {/* Spine dots */}
            <circle cx="36" cy="115" r="1.8" fill="#6DBF60" opacity="0.75" />
            <circle cx="36" cy="170" r="1.8" fill="#6DBF60" opacity="0.75" />
            <circle cx="36" cy="230" r="1.8" fill="#6DBF60" opacity="0.75" />
          </svg>
        </div>

        {/* ─── RIGHT BACKGROUND: tall saguaro — z-index 3, behind van ─── */}
        <div className="hero-cactus-bg hero-cactus-bg-right">
          <svg viewBox="0 0 185 465" width="185" height="465" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
            <defs>
              <linearGradient id="cactusGradRBG" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2E6B28" />
                <stop offset="50%" stopColor="#3E7E32" />
                <stop offset="100%" stopColor="#265A22" />
              </linearGradient>
            </defs>
            {/* Main trunk */}
            <rect x="76" y="22" width="32" height="443" rx="16" fill="url(#cactusGradRBG)" />
            {/* Left arm: horizontal jog then up */}
            <rect x="30" y="148" width="48" height="22" rx="11" fill="url(#cactusGradRBG)" />
            <rect x="18" y="65"  width="24" height="103" rx="12" fill="url(#cactusGradRBG)" />
            {/* Right arm: jog out then up (partly off-canvas) */}
            <rect x="106" y="210" width="79" height="22" rx="11" fill="url(#cactusGradRBG)" />
            <rect x="163" y="115" width="22" height="115" rx="11" fill="url(#cactusGradRBG)" />
            {/* Rib lines */}
            <line x1="88"  y1="22" x2="88"  y2="465" stroke="#336A28" strokeWidth="2"   opacity="0.42" />
            <line x1="96"  y1="22" x2="96"  y2="465" stroke="#5CAA50" strokeWidth="1"   opacity="0.22" />
            {/* Spine dots */}
            <circle cx="108" cy="105" r="2.5" fill="#6DBF60" opacity="0.65" />
            <circle cx="108" cy="175" r="2.5" fill="#6DBF60" opacity="0.65" />
            <circle cx="108" cy="245" r="2.5" fill="#6DBF60" opacity="0.65" />
            <circle cx="76"  cy="185" r="2.5" fill="#6DBF60" opacity="0.65" />
          </svg>
        </div>

        {/* ─── RIGHT FOREGROUND: small cactus — z-index 6, in front of van ─── */}
        <div className="hero-cactus-fg hero-cactus-fg-right">
          <svg viewBox="0 0 105 310" width="105" height="310" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
            <defs>
              <linearGradient id="cactusGradRFG" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3A7830" />
                <stop offset="50%" stopColor="#4E9040" />
                <stop offset="100%" stopColor="#2E6228" />
              </linearGradient>
            </defs>
            {/* Main trunk */}
            <rect x="40" y="75" width="28" height="235" rx="14" fill="url(#cactusGradRFG)" />
            {/* Right arm: jog out then up */}
            <rect x="66"  y="138" width="39" height="17" rx="8.5" fill="url(#cactusGradRFG)" />
            <rect x="85"  y="82"  width="20" height="74"  rx="10"  fill="url(#cactusGradRFG)" />
            {/* Rib line */}
            <line x1="52" y1="75" x2="52" y2="310" stroke="#3A7A30" strokeWidth="1.2" opacity="0.38" />
            {/* Spine dots */}
            <circle cx="68" cy="120" r="1.8" fill="#6DBF60" opacity="0.75" />
            <circle cx="68" cy="178" r="1.8" fill="#6DBF60" opacity="0.75" />
            <circle cx="68" cy="235" r="1.8" fill="#6DBF60" opacity="0.75" />
          </svg>
        </div>

        {/* Van + stats strip: stacked in normal flow so wheels always kiss the strip line */}
        <div className="hero-bottom">
        {/* Animated van scene */}
        <div className="van-scene">
          <div className="van-wrap">
            {/* Dust puffs */}
            <div className="dust"></div>
            <div className="dust"></div>
            <div className="dust"></div>
            {/* The real van. Photographed side-on, background removed, so it
                sits over the desert scene rather than in a box.

                It FACES LEFT, which is why the scene animates right-to-left
                (see `vanDrive` in globals.css). The placeholder SVG this
                replaced also faced left while the animation ran left-to-right,
                so the van appeared to drive backwards the whole time. If a
                future van image faces right, switch `.van-wrap` to the
                `vanDriveRight` keyframes and flip the dust direction with it. */}
            <img
              className="van-asset-img"
              src="/van-photo.webp"
              alt="The Lint Away Duct Cleaning van — 480-877-9808, residential and commercial duct cleaning"
              width={380}
              height={201}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        {/* Stats strip */}
        <div className="hero-stats">
          <div className="hero-stat" style={{animationDelay: '0.8s'}}>
            <div className="hero-stat-num"><span className="stat-count" data-target="500">0</span>M<span className="stat-accent">+</span></div>
            <div className="hero-stat-label">Total Social Views</div>
          </div>
          <div className="hero-stat" style={{animationDelay: '0.95s'}}>
            <div className="hero-stat-num">
              {business.socialProof.rating}
              <span className="stat-accent">★</span>
            </div>
            <div className="hero-stat-label">Google Rating</div>
          </div>
          <div className="hero-stat" style={{animationDelay: '1.1s'}}>
            <div className="hero-stat-num"><span className="stat-count" data-target={cities.length}>0</span></div>
            <div className="hero-stat-label">Valley Cities Served</div>
          </div>
          <div className="hero-stat" style={{animationDelay: '1.25s'}}>
            <div className="hero-stat-num">100<span className="stat-accent">%</span></div>
            <div className="hero-stat-label">Camera-Inspected Cleans</div>
          </div>
        </div>
        </div>{/* /hero-bottom */}
      </section>


      {/* ═══════════════════════════════════════════
           SERVICES
      ═══════════════════════════════════════════ */}
      <section id="services">
        <div className="services-inner">
          <div className="services-head">
            <div className="services-head-left reveal">
              <div className="section-label">What We Do</div>
              <h2 className="services-h2">Every Service.<br />One Standard of Clean.</h2>
            </div>
            <a href="/services" className="btn btn-ghost-dark reveal delay-2">See All Services →</a>
          </div>

          <div className="services-grid">

            <div className="service-card reveal delay-1">
              <div className="service-icon-wrap icon-red">🏠</div>
              <div className="service-tag tag-residential">Residential</div>
              <div className="service-title">Dryer Vent Cleaning</div>
              <div className="service-desc">Clogged dryer vents cause 15,000+ house fires a year. We clear yours completely — with camera confirmation before and after.</div>
              <a href="/services/residential-dryer-vent-cleaning" className="service-link">Learn More <span className="arrow">→</span></a>
            </div>

            <div className="service-card reveal delay-2">
              <div className="service-icon-wrap icon-blue">🏢</div>
              <div className="service-tag tag-commercial">Commercial</div>
              <div className="service-title">Commercial Dryer Vent</div>
              <div className="service-desc">Laundromats, apartment complexes, hotels — we schedule around your operations so you never lose a business day.</div>
              <a href="/services/commercial-dryer-vent-cleaning" className="service-link">Learn More <span className="arrow">→</span></a>
            </div>

            <div className="service-card reveal delay-3">
              <div className="service-icon-wrap icon-red">💨</div>
              <div className="service-tag tag-residential">Residential</div>
              <div className="service-title">Air Duct Cleaning</div>
              <div className="service-desc">Remove years of dust, allergens, and debris from your HVAC system. Breathe air that's actually clean — verified with our camera system.</div>
              <a href="/services/residential-air-duct-cleaning" className="service-link">Learn More <span className="arrow">→</span></a>
            </div>

            <div className="service-card reveal delay-4">
              <div className="service-icon-wrap icon-blue">🏗️</div>
              <div className="service-tag tag-commercial">Commercial</div>
              <div className="service-title">Commercial Air Duct</div>
              <div className="service-desc">Full HVAC duct cleaning for offices, retail spaces, and facilities. Improved air quality means healthier employees and lower energy bills.</div>
              <a href="/services/commercial-air-duct-cleaning" className="service-link">Learn More <span className="arrow">→</span></a>
            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
           WHY US
      ═══════════════════════════════════════════ */}
      <section id="why-us">
        <div className="why-blob why-blob-1"></div>
        <div className="why-blob why-blob-2"></div>
        <div className="why-inner">

          <div className="why-left">
            <div className="section-label reveal-left">Why Lint Away</div>
            <h2 className="why-pullquote reveal-left delay-1">
              Millions Watched.<br />
              <span className="accent">Every One Got</span><br />
              Proof of Clean.
            </h2>
            <p className="why-sub reveal-left delay-2">
              We're Arizona's most-watched duct cleaning company because we show every single job on camera — before, during, and after. No claims. Just proof.
            </p>

            <div className="why-stats">
              <div className="why-stat reveal delay-3">
                <div className="why-stat-num"><span className="stat-count" data-target="500">0</span>M<sup>+</sup></div>
                <div className="why-stat-label">Social Views</div>
              </div>
              <div className="why-stat reveal delay-4">
                <div className="why-stat-num">
                  {business.socialProof.rating}
                  <sup style={{color: 'var(--blue)'}}>★</sup>
                </div>
                <div className="why-stat-label">Google Rating</div>
              </div>
              <div className="why-stat reveal delay-5">
                <div className="why-stat-num">
                  <span className="stat-count" data-target={business.socialProof.reviewCount}>
                    0
                  </span>
                </div>
                <div className="why-stat-label">Reviews</div>
              </div>
            </div>
          </div>

          <div className="why-right">
            <div className="why-pillars">

              <div className="pillar reveal-right delay-1">
                <div className="pillar-icon">📹</div>
                <div className="pillar-body">
                  <div className="pillar-title">Camera-Inspected Every Time</div>
                  <div className="pillar-desc">We inspect with a camera before we start and show you the results after. You see exactly what we removed — no surprises, no upsells.</div>
                </div>
              </div>

              <div className="pillar reveal-right delay-2">
                <div className="pillar-icon">🏅</div>
                <div className="pillar-body">
                  <div className="pillar-title">Fully Certified Technicians</div>
                  <div className="pillar-desc">Our team is trained, certified, and background-checked. You're letting us into your home — we take that seriously.</div>
                </div>
              </div>

              <div className="pillar reveal-right delay-3">
                <div className="pillar-icon">🌵</div>
                <div className="pillar-body">
                  <div className="pillar-title">Locally Owned & Operated</div>
                  <div className="pillar-desc">We live in the Valley. Your neighbors are our customers. We protect our reputation one job at a time.</div>
                </div>
              </div>

              <div className="pillar reveal-right delay-4">
                <div className="pillar-icon">⚡</div>
                <div className="pillar-body">
                  <div className="pillar-title">Same-Day Service Available</div>
                  <div className="pillar-desc">Don't wait weeks for a clean. We offer same-day appointments across all 7 Phoenix Valley cities we serve.</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
           PROCESS
      ═══════════════════════════════════════════ */}
      <section id="process">
        <div className="process-inner">
          <div className="process-head">
            <div className="section-label reveal">How It Works</div>
            <h2 className="process-h2 reveal delay-1">Clean Air in 3 Steps</h2>
            <p className="process-sub reveal delay-2">Simple, transparent, and done right the first time.</p>
          </div>

          <div className="process-steps">

            <div className="process-step reveal delay-1">
              <div className="process-num-wrap">
                <div className="process-num">1</div>
                <div className="process-icon">📞</div>
              </div>
              <div className="process-title">Schedule Your Service</div>
              <div className="process-desc">Call or book online in under 2 minutes. We'll confirm same-day or schedule at your convenience across Phoenix Valley.</div>
            </div>

            <div className="process-step reveal delay-3">
              <div className="process-num-wrap">
                <div className="process-num">2</div>
                <div className="process-icon">🔍</div>
              </div>
              <div className="process-title">We Inspect &amp; Clean</div>
              <div className="process-desc">Our certified tech arrives on time, camera-inspects your ducts or vents, then does a full professional clean — showing you everything live.</div>
            </div>

            <div className="process-step reveal delay-5">
              <div className="process-num-wrap">
                <div className="process-num">3</div>
                <div className="process-icon">✨</div>
              </div>
              <div className="process-title">Breathe Clean Air</div>
              <div className="process-desc">We show you the before and after, confirm your system is clear, and you're done. Better air quality starts today.</div>
            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
           SOCIAL PROOF
      ═══════════════════════════════════════════ */}
      <section id="social-proof">
        <div className="proof-inner">
          <div className="proof-head">
            <div className="section-label reveal">Proof, Not Promises</div>
            <h2 className="proof-h2 reveal delay-1"><span className="accent">500M+ People</span> Have Watched Us Clean</h2>
            <p className="proof-sub reveal delay-2">YouTube · TikTok · Instagram · Facebook — we post every job because the results speak for themselves.</p>
          </div>

          {/* ─── YouTube Shorts strip ─── */}
          <div className="shorts-invite reveal delay-2">
            <div className="shorts-invite-eyebrow">Watch on YouTube</div>
            <h3 className="shorts-invite-title">See the Dirt. See the Clean. <span className="accent">No Filter.</span></h3>
            <p className="shorts-invite-sub">We film every job — before, during, after. Watch real Phoenix Valley homes breathe clean air.</p>
          </div>

          <ShortsStrip />

          <div className="proof-testimonials">

            <div className="testimonial reveal delay-1">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">"I highly recommend Trevor and his team! They use a camera to check the vent for any blockage. Don't waste your time calling anyone else — these guys are the best."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{background: 'var(--red)'}}>M</div>
                <div>
                  <div className="testimonial-name">Maria R.</div>
                  <div className="testimonial-location">Scottsdale, AZ</div>
                </div>
              </div>
            </div>

            <div className="testimonial reveal delay-3">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">"Called them for my parents' house and they were very impressed. I've already referred them to another family member. Camera proof makes all the difference."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{background: 'var(--blue)'}}>J</div>
                <div>
                  <div className="testimonial-name">Jason K.</div>
                  <div className="testimonial-location">Chandler, AZ</div>
                </div>
              </div>
            </div>

            <div className="testimonial reveal delay-5">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">"Same-day service, super professional, and they showed me every step on their camera. Our air quality has noticeably improved. Worth every penny."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{background: '#22C55E'}}>S</div>
                <div>
                  <div className="testimonial-name">Sara T.</div>
                  <div className="testimonial-location">Tempe, AZ</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
           PARTNERS
      ═══════════════════════════════════════════ */}
      <section id="partners">
        <div className="partners-head">
          <div className="section-label reveal">Trusted Partners &amp; Certifications</div>
          <h2 className="partners-h2 reveal delay-1">Industry-Backed. Community-Trusted.</h2>
          <p className="partners-sub reveal delay-2">Our tools, certifications, and affiliations reflect the standard we hold ourselves to every job.</p>
        </div>

        <div className="partners-belt-wrap">
          <div className="partners-belt">

            {/* Original set */}
            <div className="partner-badge"><div className="partner-logo-wrap"><div className="partner-icon">🔭</div><div className="partner-name">Vent Vision</div></div></div>
            <div className="partner-badge"><div className="partner-logo-wrap"><div className="partner-icon">⚙️</div><div className="partner-name">Nikro</div></div></div>
            <div className="partner-badge"><div className="partner-logo-wrap"><div className="partner-icon">🌬️</div><div className="partner-name">Air-Care</div></div></div>
            <div className="partner-badge"><div className="partner-logo-wrap"><div className="partner-icon">🔧</div><div className="partner-name">Innovative Dryer Products</div></div></div>
            <div className="partner-badge"><div className="partner-logo-wrap"><div className="partner-icon">🏛️</div><div className="partner-name">NADCA</div></div></div>
            <div className="partner-badge"><div className="partner-logo-wrap"><div className="partner-icon">⭐</div><div className="partner-name">BBB</div></div></div>

            {/* Duplicate set for seamless infinite loop */}
            <div className="partner-badge"><div className="partner-logo-wrap"><div className="partner-icon">🔭</div><div className="partner-name">Vent Vision</div></div></div>
            <div className="partner-badge"><div className="partner-logo-wrap"><div className="partner-icon">⚙️</div><div className="partner-name">Nikro</div></div></div>
            <div className="partner-badge"><div className="partner-logo-wrap"><div className="partner-icon">🌬️</div><div className="partner-name">Air-Care</div></div></div>
            <div className="partner-badge"><div className="partner-logo-wrap"><div className="partner-icon">🔧</div><div className="partner-name">Innovative Dryer Products</div></div></div>
            <div className="partner-badge"><div className="partner-logo-wrap"><div className="partner-icon">🏛️</div><div className="partner-name">NADCA</div></div></div>
            <div className="partner-badge"><div className="partner-logo-wrap"><div className="partner-icon">⭐</div><div className="partner-name">BBB</div></div></div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
           SERVICE AREAS
      ═══════════════════════════════════════════ */}
      <section id="service-areas">
        <div className="areas-inner">
          <div className="section-label reveal">Where We Serve</div>
          <h2 className="areas-h2 reveal delay-1">All of Phoenix Valley, Covered</h2>
          <p className="areas-sub reveal delay-2">From Ahwatukee to Scottsdale — same-day available in every city.</p>
        </div>

        {/* All eight cities, static and full width, each panel linking to
            its own landing page. */}
        <CityBelt />

        {/* Crawlable text backup for the strip above: real link text plus the
            county, and the readable version on a phone. */}
        <CityGrid />
      </section>


      <CtaBanner />
      {/* The form sits LAST on purpose: every "Get a Quote" CTA on the site
          targets #quote, so the destination of the site's primary action is the
          form itself rather than another page with another button on it. */}
      <QuoteForm />
    </>
  );
}
