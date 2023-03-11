export function roundFixed (num: number, fix: number = 2): number {
  return Number(Number.prototype.toFixed.call(num, fix));
}

export function clamp (min: number, value: number, max: number): number {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

export function shuffleArrayInplace<T> (array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export function shuffleArray<T> (array: T[]): T[] {
  const newarray = Array.from(array);
  shuffleArrayInplace(newarray);
  return newarray;
}
