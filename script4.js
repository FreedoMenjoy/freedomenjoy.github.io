const buttonElement = document.querySelector('#button');
const scoreElement = document.querySelector('#score');


buttonElement.addEventListener('click', function() {
	let inputs = document.querySelectorAll('#test input');
	
	let correct = 0;
	for (let input of inputs) {
		if (input.value == input.dataset.right) {
			input.classList.add('correct');
			input.classList.remove('incorrect');
			correct++;
		} else {
			input.classList.remove('correct');
			input.classList.add('incorrect');
		}
	}
	
	scoreElement.innerText = String(correct);
});
