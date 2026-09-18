/**
 * The YouTube Shorts featured in the social-proof strip on the homepage.
 *
 * All three are from the Lint Away Duct Cleaning channel
 * (https://www.youtube.com/@lintawayductcleaning) and all three are Shorts,
 * so they are 9:16 — which is why the card geometry from the old TikTok strip
 * carried over unchanged.
 *
 * `title` is the real YouTube title, used as the accessible name of the play
 * button and the link. `label` is the short on-page caption: the real titles
 * carry hashtags and emoji that read fine in a YouTube feed and badly as page
 * copy, and the hashtags would be indexed as body text.
 *
 * `uploadDate` is optional and is currently unset. When it is filled in, the
 * page automatically emits VideoObject structured data for that video, which is
 * what makes a video eligible for a video rich result and gives an AI assistant
 * something citable. Google treats `uploadDate` as required, so a VideoObject
 * without one is an invalid node rather than a partial one — hence the gate
 * rather than a guessed date. The dates are in YouTube Studio → Content, and
 * the format is ISO 8601: '2024-08-14'.
 */

export type Short = {
  /** YouTube video ID. */
  id: string;
  /** The real YouTube title, verbatim. */
  title: string;
  /** Short on-page caption. */
  label: string;
  /** Alt text for the still. Describes the frame, not the brand. */
  alt: string;
  /** ISO 8601 date, e.g. '2024-08-14'. Unlocks VideoObject markup when set. */
  uploadDate?: string;
};

export const channelUrl = 'https://www.youtube.com/@lintawayductcleaning';

export const shorts: Short[] = [
  {
    id: 'MsaOwSwmpSc',
    title: 'This is the CRAZIEST dryer vent cleaning of all time! 🤯🤯🤯 #oddlysatisfying #dryerventcleaning',
    label: 'The craziest dryer vent we have ever pulled',
    alt: 'A dryer vent being cleaned, with the lint blockage coming loose',
  },
  {
    id: 'D5Y7zv1SEYk',
    title: '“I always clean my Lint Trap” Okay…but how often do you clean your entire Dryer?',
    label: 'You clean the lint trap. When did you last clean the dryer?',
    alt: 'A lint trap next to the full dryer duct it connects to',
  },
  {
    id: 'QHWyEsdFaHo',
    title: 'This dryer vent was never cleaned, 50 years of lint! 🤯 #oddlysatisfying #dryerventcleaning #vacuum',
    label: 'Never cleaned in 50 years — here is what came out',
    alt: 'Decades of packed lint being vacuumed out of an uncleaned dryer vent',
  },
];
