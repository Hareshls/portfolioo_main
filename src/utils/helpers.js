// Shared helpers
export const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
export const PORTRAIT = '/portrait.webp';

// One rAF loop; subscribers run at most every `fr` ms (0 = every frame).
const subs = new Set();
export function tick(fn, fr = 0) { subs.add({ fn, fr, last: 0 }); }
(function loop(t) {
  subs.forEach((s) => { if (t - s.last >= s.fr) { s.last = t; s.fn(t); } });
  requestAnimationFrame(loop);
})(0);
