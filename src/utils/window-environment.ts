export function isTouchDevice(): boolean {
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - `msMaxTouchPoints` is not in the TypeScript DOM lib
    (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0)
  );
}
