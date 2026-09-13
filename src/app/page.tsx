import type { Metadata } from 'next';
import Link from 'next/link';
import CityBelt from '@/components/CityBelt';
import CityGrid from '@/components/CityGrid';
import CtaBanner from '@/components/CtaBanner';
import QuoteForm from '@/components/QuoteForm';
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
              <a href="#cta-banner" className="btn btn-red">Get a Free Estimate →</a>
              <a href="tel:4808779808" className="btn btn-ghost-white">📞 (480) 877-9808</a>
            </div>

            <div className="hero-stars">
              <div className="hero-stars-icons">★★★★★</div>
              <div className="hero-stars-text">5.0 on Google · 200+ reviews</div>
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
            {/*
            ╔══════════════════════════════════════════════════════════════╗
            ║  VAN ASSET — SWAP THIS BLOCK TO USE YOUR REAL VAN IMAGE     ║
            ║                                                              ║
            ║  OPTION A — PNG/WebP with transparent background (easiest): ║
            ║    Delete the <svg>…</svg> below and replace with:          ║
            ║    <img className="van-asset-img"                               ║
            ║         src="assets/lint-away-van.png"                      ║
            ║         alt="Lint Away Van"                                  ║
            ║         width="500" height="110" />                           ║
            ║                                                              ║
            ║  OPTION B — Keep the SVG placeholder until art is ready.    ║
            ║                                                              ║
            ║  The .van-wrap div handles ALL animation — the image inside  ║
            ║  just needs to be 500 × 110 px (or edit width/height above). ║
            ║  Wheel spin animation targets .wheel-fl and .wheel-rl —     ║
            ║  if using a PNG, remove those two <g> elements or hide them. ║
            ╚══════════════════════════════════════════════════════════════╝
            */}
            <svg className="lint-van van-asset-svg" width="500" height="110" viewBox="0 0 500 110" xmlns="http://www.w3.org/2000/svg">
              {/* Van shadow */}
              <ellipse cx="260" cy="106" rx="210" ry="6" fill="rgba(0,0,0,0.18)" filter="url(#vanBlur)" />
              <defs>
                <filter id="vanBlur"><feGaussianBlur stdDeviation="3" /></filter>
                <linearGradient id="vanBody" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F0F0F0" />
                </linearGradient>
                <linearGradient id="vanCabin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8EAEC" />
                  <stop offset="100%" stopColor="#D4D8DC" />
                </linearGradient>
                <linearGradient id="windshield" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8DCE8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#A8C8DC" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Main van body (cargo area) */}
              <rect x="90" y="12" width="380" height="78" rx="8" fill="url(#vanBody)" stroke="#D8D8D8" strokeWidth="1" />
              {/* Cab/hood area */}
              <path d="M15,55 Q15,12 55,12 L108,12 L108,90 L15,90 Z" fill="url(#vanCabin)" stroke="#C8C8C8" strokeWidth="1" />
              {/* Hood slope */}
              <path d="M15,55 Q30,30 55,22 L108,12" fill="none" stroke="#C0C4C8" strokeWidth="1" />
              {/* Windshield */}
              <path d="M28,54 Q30,28 58,22 L100,18 L100,70 L28,70 Z" fill="url(#windshield)" stroke="#B0C4D4" strokeWidth="1" />
              {/* Windshield glare */}
              <path d="M35,28 Q50,22 80,20 L82,28 Q55,30 38,35 Z" fill="white" opacity="0.35" />
              {/* Side door line */}
              <line x1="108" y1="12" x2="108" y2="90" stroke="#D0D0D0" strokeWidth="1.5" />
              {/* Door handle */}
              <rect x="116" y="52" width="18" height="5" rx="2.5" fill="#C0C4C8" />
              {/* Cargo side windows (small) */}
              <rect x="200" y="20" width="60" height="30" rx="3" fill="#B8D0E0" opacity="0.7" stroke="#C8D8E8" strokeWidth="0.5" />
              {/* Side graphic stripe */}
              <rect x="108" y="78" width="362" height="12" rx="0" fill="#45ABC0" opacity="0.85" />
              {/* Lint Away logo text on van side */}
              <text x="230" y="52" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="16" fill="#1A1A2E" textAnchor="middle">Lint Away</text>
              <text x="230" y="68" fontFamily="Nunito, sans-serif" fontWeight="600" fontSize="8.5" fill="#45ABC0" textAnchor="middle" letter-spacing="0.5">DUCT CLEANING</text>
              {/* Phone number */}
              <text x="370" y="48" fontFamily="Nunito, sans-serif" fontWeight="700" fontSize="9" fill="#1A1A2E" textAnchor="middle">480-877-9808</text>
              <text x="370" y="60" fontFamily="Nunito, sans-serif" fontWeight="500" fontSize="7.5" fill="#555" textAnchor="middle">Professional Duct Cleaning</text>
              <text x="370" y="71" fontFamily="Nunito, sans-serif" fontWeight="500" fontSize="7" fill="#777" textAnchor="middle">Residential &amp; Commercial</text>
              {/* Mini Big Clumpy on van side */}
              <circle cx="155" cy="50" r="22" fill="#8A8D9E" />
              <circle cx="155" cy="50" r="20" fill="#9598A8" filter="url(#vanBlur2)" />
              <defs><filter id="vanBlur2"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /><feDisplacementMap in="SourceGraphic" scale="4" /></filter></defs>
              {/* Mini eyes */}
              <ellipse cx="149" cy="47" rx="6" ry="6.5" fill="white" />
              <ellipse cx="161" cy="47" rx="6" ry="6.5" fill="white" />
              <circle cx="150" cy="48" r="4" fill="#1E90FF" />
              <circle cx="162" cy="48" r="4" fill="#1E90FF" />
              <circle cx="150" cy="48" r="2" fill="#1A1A2E" />
              <circle cx="162" cy="48" r="2" fill="#1A1A2E" />
              <circle cx="148" cy="46" r="1.5" fill="white" opacity="0.9" />
              <circle cx="160" cy="46" r="1.5" fill="white" opacity="0.9" />
              {/* Mini smile */}
              <path d="M148 57 Q155 63 162 57" stroke="#3A3D4E" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Van roof rack / equipment */}
              <rect x="130" y="6" width="220" height="8" rx="3" fill="#C8CACC" stroke="#B8BABC" strokeWidth="0.5" />
              <rect x="145" y="1" width="8" height="7" rx="2" fill="#B0B4B8" />
              <rect x="170" y="1" width="40" height="6" rx="2" fill="#B0B4B8" />
              <rect x="225" y="1" width="8" height="7" rx="2" fill="#B0B4B8" />
              {/* Front bumper */}
              <rect x="10" y="82" width="18" height="8" rx="3" fill="#C0C4C8" />
              {/* Headlight */}
              <rect x="14" y="60" width="14" height="10" rx="3" fill="#FFFDE0" stroke="#E0D890" strokeWidth="0.5" />
              <rect x="14" y="60" width="14" height="5" rx="2" fill="white" opacity="0.6" />
              {/* Rear lights */}
              <rect x="466" y="22" width="10" height="18" rx="3" fill="#E84040" opacity="0.9" />
              <rect x="466" y="22" width="10" height="8" rx="2" fill="#FF6060" opacity="0.7" />
              {/* Rear bumper */}
              <rect x="462" y="82" width="18" height="8" rx="3" fill="#C0C4C8" />
              {/* License plate area */}
              <rect x="458" y="68" width="22" height="14" rx="2" fill="#F0F0E8" stroke="#C8C8B8" strokeWidth="0.5" />
              <text x="469" y="78" fontFamily="monospace" fontSize="5.5" fill="#333" textAnchor="middle">AZ•123</text>

              {/* FRONT WHEEL — cy=92, r=18 → bottom at y=110 = SVG bottom = strip top line */}
              <g className="wheel-fl" style={{transformOrigin: '68px 92px'}}>
                <circle cx="68" cy="92" r="18" fill="#2A2A2A" />
                <circle cx="68" cy="92" r="13" fill="#404040" />
                <circle cx="68" cy="92" r="7"  fill="#808080" />
                <circle cx="68" cy="92" r="3.5" fill="#B0B0B0" />
                {/* spokes */}
                <line x1="68" y1="79" x2="68" y2="92"  stroke="#606060" strokeWidth="2" />
                <line x1="68" y1="92" x2="68" y2="105" stroke="#606060" strokeWidth="2" />
                <line x1="55" y1="92" x2="81" y2="92"  stroke="#606060" strokeWidth="2" />
                <line x1="59" y1="83" x2="77" y2="101" stroke="#606060" strokeWidth="1.5" />
                <line x1="77" y1="83" x2="59" y2="101" stroke="#606060" strokeWidth="1.5" />
              </g>
              {/* REAR WHEEL — cy=92, r=18 → bottom at y=110 = SVG bottom = strip top line */}
              <g className="wheel-rl" style={{transformOrigin: '400px 92px'}}>
                <circle cx="400" cy="92" r="18" fill="#2A2A2A" />
                <circle cx="400" cy="92" r="13" fill="#404040" />
                <circle cx="400" cy="92" r="7"  fill="#808080" />
                <circle cx="400" cy="92" r="3.5" fill="#B0B0B0" />
                <line x1="400" y1="79" x2="400" y2="92"  stroke="#606060" strokeWidth="2" />
                <line x1="400" y1="92" x2="400" y2="105" stroke="#606060" strokeWidth="2" />
                <line x1="387" y1="92" x2="413" y2="92"  stroke="#606060" strokeWidth="2" />
                <line x1="391" y1="83" x2="409" y2="101" stroke="#606060" strokeWidth="1.5" />
                <line x1="409" y1="83" x2="391" y2="101" stroke="#606060" strokeWidth="1.5" />
              </g>
              {/* Wheel wells */}
              <path d="M40,90 Q68,70 96,90" fill="#D0D4D8" stroke="#C0C4C8" strokeWidth="1" />
              <path d="M372,90 Q400,70 428,90" fill="#D0D4D8" stroke="#C0C4C8" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Stats strip */}
        <div className="hero-stats">
          <div className="hero-stat" style={{animationDelay: '0.8s'}}>
            <div className="hero-stat-num"><span className="stat-count" data-target="500">0</span>M<span className="stat-accent">+</span></div>
            <div className="hero-stat-label">Total Social Views</div>
          </div>
          <div className="hero-stat" style={{animationDelay: '0.95s'}}>
            <div className="hero-stat-num">5<span className="stat-accent">★</span></div>
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
                <div className="why-stat-num">5<sup style={{color: 'var(--blue)'}}>★</sup></div>
                <div className="why-stat-label">Google Rating</div>
              </div>
              <div className="why-stat reveal delay-5">
                <div className="why-stat-num"><span className="stat-count" data-target="200">0</span><sup>+</sup></div>
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
            <p className="proof-sub reveal delay-2">TikTok · YouTube · Instagram · Facebook — we post every job because the results speak for themselves.</p>
          </div>

          {/* ─── TikTok Strip ─── */}
          <div className="tiktok-invite reveal delay-2">
            <div className="tiktok-invite-eyebrow">🎵 Follow Our Journey on TikTok</div>
            <h3 className="tiktok-invite-title">See the Dirt. See the Clean. <span className="accent">No Filter.</span></h3>
            <p className="tiktok-invite-sub">We film every job — before, during, after. Watch real Phoenix Valley homes breathe clean air.</p>
          </div>

          <div className="tiktok-strip reveal delay-3">

            {/* TikTok Embed 1 */}
            <div className="tiktok-card">
              <div className="tiktok-placeholder">
                <div className="tiktok-play-icon">▶</div>
                <div className="tiktok-label">Air Duct Before &amp; After<br />Phoenix Home Clean</div>
                <div className="tiktok-cta-badge">📱 Watch on TikTok</div>
              </div>
              {/*
                DEV SWAP — replace .tiktok-placeholder with TikTok embed:
                <blockquote className="tiktok-embed"
                  cite="https://www.tiktok.com/@lintawayductcleaning/video/VIDEO_ID_1"
                  data-video-id="VIDEO_ID_1" style={{maxWidth: '100%', minWidth: '100%', height: '100%'}}>
                </blockquote>
                <script async={true} src="https://www.tiktok.com/embed.js"></script>
              */}
            </div>

            {/* TikTok Embed 2 */}
            <div className="tiktok-card">
              <div className="tiktok-placeholder">
                <div className="tiktok-play-icon">▶</div>
                <div className="tiktok-label">Dryer Vent Full Clean<br />See What We Pulled Out</div>
                <div className="tiktok-cta-badge">📱 Watch on TikTok</div>
              </div>
              {/*
                DEV SWAP — replace .tiktok-placeholder with TikTok embed:
                <blockquote className="tiktok-embed"
                  cite="https://www.tiktok.com/@lintawayductcleaning/video/VIDEO_ID_2"
                  data-video-id="VIDEO_ID_2" style={{maxWidth: '100%', minWidth: '100%', height: '100%'}}>
                </blockquote>
                <script async={true} src="https://www.tiktok.com/embed.js"></script>
              */}
            </div>

            {/* TikTok Embed 3 */}
            <div className="tiktok-card">
              <div className="tiktok-placeholder">
                <div className="tiktok-play-icon">▶</div>
                <div className="tiktok-label">Live Camera Inspection<br />What's Really in Your Vents?</div>
                <div className="tiktok-cta-badge">📱 Watch on TikTok</div>
              </div>
              {/*
                DEV SWAP — replace .tiktok-placeholder with TikTok embed:
                <blockquote className="tiktok-embed"
                  cite="https://www.tiktok.com/@lintawayductcleaning/video/VIDEO_ID_3"
                  data-video-id="VIDEO_ID_3" style={{maxWidth: '100%', minWidth: '100%', height: '100%'}}>
                </blockquote>
                <script async={true} src="https://www.tiktok.com/embed.js"></script>
              */}
            </div>

          </div>

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


      <QuoteForm />
      <CtaBanner />
    </>
  );
}
