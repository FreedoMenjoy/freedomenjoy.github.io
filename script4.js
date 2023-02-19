let button = document.querySelector('#button');

let rightAnswers = [1, 2, 3];

button.addEventListener('click', function() {
	let inputs = document.querySelectorAll('#test input');
	
	let i = 0;
	for (let input of inputs) {
		if (input.value == rightAnswers[i]) {
			input.classList.add('correct');
		} else {
			input.classList.add('incorrect');
		}
		
		i++;
	}
});