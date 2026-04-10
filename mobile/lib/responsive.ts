/**
 * Responsive helpers for Lexicon mobile app.
 *
 * Usage:
 *   import { rs, isSmall, isTablet, sw, sh } from '@/lib/responsive';
 *
 *   fontSize: rs(16)          // scales with screen width
 *   maxWidth: sw(0.75)        // 75% of screen width
 *   paddingTop: isSmall ? 8 : 16
 */

import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/** Raw screen width in dp */
export const screenWidth = SCREEN_W;

/** Raw screen height in dp */
export const screenHeight = SCREEN_H;

/** True for small phones (e.g. iPhone SE — width ≤ 375) */
export const isSmall = SCREEN_W <= 375;

/** True for large phones / phablets (width ≥ 414) */
export const isLarge = SCREEN_W >= 414;

/** True for tablets / iPads (width ≥ 768) */
export const isTablet = SCREEN_W >= 768;

/**
 * Returns a percentage of the screen width.
 * @example sw(0.9) → 90% of screen width
 */
export const sw = (pct: number) => SCREEN_W * pct;

/**
 * Returns a percentage of the screen height.
 * @example sh(0.1) → 10% of screen height
 */
export const sh = (pct: number) => SCREEN_H * pct;

/**
 * Responsive scale — scales a base size proportionally to screen width,
 * relative to a 390px design baseline (iPhone 14).
 *
 * @example rs(16) → ~14 on SE, 16 on 390w, ~18 on tablet
 */
export const rs = (size: number, factor = 0.4): number => {
  const scale = SCREEN_W / 390;
  const delta = (scale - 1) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(size * (1 + delta)));
};

/**
 * Clamp a value between min and max.
 * Useful for font sizes that shouldn't grow too large on tablets.
 */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Responsive font size — scales with screen but clamps to a safe range.
 * @example rfs(34, 26, 40) → min 26, max 40, scaled around 34
 */
export const rfs = (base: number, min: number, max: number): number =>
  clamp(rs(base), min, max);

/**
 * Max content width — keeps content readable on tablets by capping width.
 * On phones, returns '100%' equivalent; on tablets returns a fixed cap.
 */
export const maxContentWidth = isTablet ? 600 : SCREEN_W;
