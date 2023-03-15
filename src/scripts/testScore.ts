import { togglebox } from './openbox';
import { forceGetElementById, forceQuerySelector } from './util/forceQuerySelector';
import { shuffleArray } from './util/math';

const testBoxElement = forceGetElementById<HTMLDivElement>('test-box');
const testElements = Array.from(document.querySelectorAll<HTMLDivElement>('#test-box div'));
const scoreElement = forceGetElementById<HTMLSpanElement>('score');
const totalElement = forceGetElementById<HTMLSpanElement>('total');

export function shuffleTests (num = testElements.length): void {
  for (const test of Array.from(testBoxElement.childNodes)) {
    testBoxElement.removeChild(test);
  }
  const newTests = shuffleArray(testElements).slice(0, num);
  for (const test of newTests) {
    testBoxElement.appendChild(test);
  }
}

export function calculateScore (): void {
  const currentTestElements = document.querySelectorAll<HTMLInputElement>('#test-box input');

  let correct = 0;
  currentTestElements.forEach(testElement => {
    if (Number(testElement.value) === Number(testElement.dataset.right)) {
      testElement.classList.add('correct');
      testElement.classList.remove('incorrect');
      correct++;
    } else {
      testElement.classList.remove('correct');
      testElement.classList.add('incorrect');
    }
  });

  scoreElement.innerText = String(correct);
  totalElement.innerText = String(currentTestElements.length);
}

export function clearTests (all = true): number {
  const tests = all ? testElements : Array.from(document.querySelectorAll<HTMLDivElement>('#test-box div'));
  for (const test of tests) {
    const input = forceQuerySelector<HTMLInputElement>('input', test);
    input.value = '';
    input.classList.remove('correct', 'incorrect');
  }
  return tests.length;
}

export function toggleboxTests (num?: number): boolean {
  const enabled = togglebox('#box');
  console.log('toggleboxTests', enabled);
  if (enabled) {
    shuffleTests(num);
    return true;
  } else {
    clearTests();
    return false;
  }
}

Object.assign(window, {
  testElements,
  shuffleTests,
  calculateScore,
  clearTests,
  toggleboxTests,
});
