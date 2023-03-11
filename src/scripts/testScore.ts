import { forceGetElementById, forceQuerySelector } from './util/forceQuerySelector';
import { shuffleArray } from './util/math';

const scoreElement = forceQuerySelector<HTMLSpanElement>('#score');

export function shuffleTests (): void {
  const testBox = forceGetElementById<HTMLDivElement>('test-box');
  const tests = Array.from(document.querySelectorAll<HTMLDivElement>('#test-box div'));
  for (const test of tests) {
    testBox.removeChild(test);
  }
  for (const test of shuffleArray(tests)) {
    testBox.appendChild(test);
  }
}

shuffleTests();

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
}

Object.assign(window, { shuffleTests, calculateScore });
