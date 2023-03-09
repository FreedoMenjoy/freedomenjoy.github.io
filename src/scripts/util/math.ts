export function roundFixed (num: number, fix: number = 2): number {
  return Number(Number.prototype.toFixed.call(num, fix));
}

export function clamp (min: number, value: number, max: number): number {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}
