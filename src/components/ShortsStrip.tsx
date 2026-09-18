'use client';

import { useState } from 'react';
import { shorts, channelUrl } from '@/data/videos';

/**
 * The three featured YouTube Shorts, loaded as facades.
 *
 * A real <iframe> embed pulls roughly 500KB–1MB of YouTube player JavaScript on
 * every single homepage visit, sets cookies before anyone has clicked anything,
 * and blocks the main thread while the hero is still trying to paint. On a site
 * whose entire purpose is ranking, that is a self-inflicted Core Web Vitals
 * wound — three embeds would be the heaviest thing on the page by an order of
 * magnitude, for content most visitors scroll past.
 *
 * So each card renders a self-hosted still (720x1280 WebP, ~50KB, in
 * /public/shorts) with a play button. The first click swaps that card — and only
 * that card — for the real player, already playing. Nothing from Google is
 * requested until someone actually asks for a video.
 *
 * The embed target is youtube-nocookie.com, which defers YouTube's tracking
 * cookies until playback rather than setting them on load.
 *
 * Each card is a <button> that becomes an iframe, and carries a plain link to
 * the video underneath. That link is the part that matters when JavaScript does
 * not run: a crawler, a text-mode browser or a failed hydration still finds
 * three real, followable links to the channel's videos rather than three dead
 * <div>s. It is also the accessible escape hatch — some people would simply
 * rather watch it on YouTube.
 */
export default function ShortsStrip() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <div className="shorts-strip reveal delay-3">
      {shorts.map((v) => {
        const watchUrl = `https://www.youtube.com/shorts/${v.id}`;
        const isPlaying = playing === v.id;

        return (
          <figure key={v.id} className="shorts-card">
            <div className="shorts-frame">
              {isPlaying ? (
                <iframe
                  className="shorts-player"
                  src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  className="shorts-poster"
                  onClick={() => setPlaying(v.id)}
                  aria-label={`Play: ${v.title}`}
                >
                  <img
                    src={`/shorts/${v.id}.webp`}
                    alt={v.alt}
                    width={720}
                    height={1280}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="shorts-scrim" aria-hidden="true" />
                  <span className="shorts-play" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="shorts-badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
                    </svg>
                    Shorts
                  </span>
                </button>
              )}
            </div>
            <figcaption className="shorts-caption">
              <a href={watchUrl} target="_blank" rel="noopener">
                {v.label}
              </a>
            </figcaption>
          </figure>
        );
      })}

      <p className="shorts-more">
        <a href={channelUrl} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">
          More on YouTube →
        </a>
      </p>
    </div>
  );
}
