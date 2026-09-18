import Link from 'next/link';
import { business } from '@/data/business';

export default function CtaBanner() {
  return (
    <section id="cta-banner">
      <div className="cta-blob cta-blob-1"></div>
      <div className="cta-blob cta-blob-2"></div>
      <div className="cta-inner">
        <div className="cta-copy reveal-left">
          <div className="cta-label">Don&apos;t Wait</div>
          <h2 className="cta-h2">
            A Clogged Dryer Vent
            <br />
            is a Fire Waiting to Happen.
          </h2>
          <p className="cta-sub">
            Most cleanings take under an hour. Same-day slots available across Phoenix Valley.
          </p>
        </div>
        <div className="cta-actions reveal-right">
          <div className="cta-phone-block">
            <div className="cta-phone-label">Call Anytime</div>
            <a href={business.telephoneHref} className="cta-phone-num">
              {business.telephoneDisplay}
            </a>
          </div>
          <Link href="#quote" className="btn btn-white">
            Get a Free Quote →
          </Link>
        </div>
      </div>
    </section>
  );
}
