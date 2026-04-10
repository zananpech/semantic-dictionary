/**
 * Playful Scholar — Global Color Palette
 *
 * Single source of truth for all colors in the Lexicon mobile app.
 * Import this wherever you need colors:
 *   import { Colors } from '@/lib/colors';
 */

export const Colors = {
  // ─── Backgrounds ────────────────────────────────────────────────────────────
  /** Soft lavender-white — main page background */
  pageBg:       '#F5F0FF',
  /** Pure white — card/surface background */
  surface:      '#FFFFFF',
  /** Light lavender button / icon background */
  surfaceAlt:   '#F0EEFF',

  // ─── Borders ────────────────────────────────────────────────────────────────
  /** Default lavender-tint border */
  border:       '#E8E0FF',
  /** Slightly deeper border for cards */
  borderCard:   '#EDE8FF',

  // ─── Text ───────────────────────────────────────────────────────────────────
  /** Deep indigo-black — headings & word names */
  textHeading:  '#1E1A40',
  /** Medium indigo-gray — body text, definitions */
  textBody:     '#4A4570',
  /** Muted lavender — subtitles, placeholders, secondary info */
  textMuted:    '#9B97C0',
  /** Light lavender — section labels, results count */
  textLabel:    '#C0BBDA',
  /** Pure white — text on colored buttons */
  textOnColor:  '#FFFFFF',

  // ─── Primary — Electric Indigo ──────────────────────────────────────────────
  /** Main CTA color: buttons, active tabs, shadows */
  indigo:       '#6C63FF',
  /** Transparent indigo fill for tags/badges */
  indigoBg:     'rgba(108,99,255,0.12)',

  // ─── Secondary — Coral Rose ─────────────────────────────────────────────────
  /** Hero accent, bookmark active, count badge */
  coral:        '#FF6584',
  /** Transparent coral fill */
  coralBg:      'rgba(255,101,132,0.12)',
  /** Very light coral surface (remove button bg) */
  coralLight:   '#FFF0F3',
  /** Light coral border */
  coralBorder:  '#FFCCD5',

  // ─── Tertiary — Mint Teal ───────────────────────────────────────────────────
  /** Synonym tags, discovery accents */
  teal:         '#0ABFBC',
  /** Transparent teal fill */
  tealBg:       'rgba(10,191,188,0.12)',
  /** Teal border for tags */
  tealBorder:   'rgba(10,191,188,0.30)',

  // ─── Accent — Warm Amber ────────────────────────────────────────────────────
  /** Shuffle/refresh button, highlights */
  amber:        '#FFAA00',
  /** Transparent amber fill */
  amberBg:      'rgba(255,170,0,0.13)',

  // ─── Part-of-Speech Colors (for PosBadge) ───────────────────────────────────
  pos: {
    noun:      { color: '#FF6584', bg: 'rgba(255,101,132,0.12)' },  // 🌸 coral
    verb:      { color: '#6C63FF', bg: 'rgba(108,99,255,0.12)'  },  // 💜 indigo
    adjective: { color: '#FFAA00', bg: 'rgba(255,170,0,0.13)'   },  // 🌟 amber
    adverb:    { color: '#0ABFBC', bg: 'rgba(10,191,188,0.12)'  },  // 🩵 teal
    fallback:  { color: '#9B97C0', bg: 'rgba(155,151,192,0.12)' },  // gray
  },
} as const;
