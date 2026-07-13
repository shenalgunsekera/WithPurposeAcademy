/**
 * Whether the page-load intro has already played this session. Hero entrances
 * wait for the loader curtain on hard loads, but start immediately on
 * client-side navigations (the loader only plays once per full load).
 */
export const boot = { done: false };

export function heroDelay(extra = 0) {
  return (boot.done ? 0.15 : 1.7) + extra;
}
