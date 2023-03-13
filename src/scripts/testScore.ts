import { forceGetElementById } from './util/forceQuerySelector';
import { shuffleArray } from './util/math';

const testBoxElement = forceGetElementById<HTMLDivElement>('test-box');
const testElements = Array.from(document.querySelectorAll<HTMLDivElement>('#test-box div'));
const scoreElement = forceGetElementById<HTMLSpanElement>('score');
const totalElement = forceGetElementById<HTMLSpanElement>('total');

export function shuffleTests (num = testElements.length): void {
  for (const test of testElements) {
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

Object.assign(window, { testElements, shuffleTests, calculateScore });
