import { forceQuerySelector } from "./forceQuerySelector";

const scoreElement = forceQuerySelector<HTMLSpanElement>('#score');

export function calculateScore () {
  const inputs = document.querySelectorAll<HTMLInputElement>('#test input');
	
	let correct = 0;
  inputs.forEach(input => {
    if (input.value == input.dataset.right) {
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

Object.assign(window, { calculateScore });
