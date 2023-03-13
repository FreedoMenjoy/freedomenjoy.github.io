import { forceGetElementById } from './util/forceQuerySelector';
import { shuffleArray } from './util/math';

const testBox = forceGetElementById<HTMLDivElement>('test-box');
const tests = Array.from(document.querySelectorAll<HTMLDivElement>('#test-box div'));
const scoreElement = forceGetElementById<HTMLSpanElement>('score');
const totalElement = forceGetElementById<HTMLSpanElement>('total');

export function shuffleTests (num = tests.length): void {
  for (const test of tests) {
    testBox.removeChild(test);
  }
  const newTests = shuffleArray(tests).slice(0, num);
  for (const test of newTests) {
    testBox.appendChild(test);
  }
}

export function calculateScore (): void {
  const inputs = document.querySelectorAll<HTMLInputElement>('#test-box input');

  let correct = 0;
  inputs.forEach(input => {
    if (Number(input.value) === Number(input.dataset.right)) {
      input.classList.add('correct');
      input.classList.remove('incorrect');
      correct++;
    } else {
      input.classList.remove('correct');
      input.classList.add('incorrect');
    }
  });

  scoreElement.innerText = String(correct);
  totalElement.innerText = String(inputs.length);
}

Object.assign(window, { shuffleTests, calculateScore });
