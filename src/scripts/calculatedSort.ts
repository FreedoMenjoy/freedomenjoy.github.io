function implCalculatedQSort<T> (values: T[], arr: number[], start: number, end: number): void {
  if (start >= end) return;

  const pivot = arr[start];

  let count = 0;
  for (let i = start + 1; i <= end; i++) {
    if (arr[i] <= pivot) count++;
  }

  const pivotIndex = start + count;
  [arr[pivotIndex], arr[start]] = [arr[start], arr[pivotIndex]];
  [values[pivotIndex], values[start]] = [values[start], values[pivotIndex]];

  let i = start;
  let j = end;

  while (i < pivotIndex && j > pivotIndex) {
    while (arr[i] <= pivot) i++;
    while (arr[j] > pivot) j--;
    if (i < pivotIndex && j > pivotIndex) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      [values[i], values[j]] = [values[j], values[i]];
      i++;
      j--;
    }
  }

  implCalculatedQSort(values, arr, start, pivotIndex - 1);
  implCalculatedQSort(values, arr, pivotIndex + 1, end);
}

export function calculatedQSort<T> (arr: T[], mapfn: (v: T, k: number) => number): T[] {
  /**
   * @type {T[]}
   */
  const result = Array.from(arr);
  if (arr.length < 2) return result;
  /**
   * @type {[T, number][]}
   */
  const mapped = Array.from(arr, (v, k) => mapfn(v, k));
  implCalculatedQSort(result, mapped, 0, arr.length - 1);
  return result;
}

const arr = Array.from({ length: 100 }, () => ({ val: Math.floor(Math.random() * 100) }));
console.log(arr);
console.log(calculatedQSort(arr, (v) => v.val));
