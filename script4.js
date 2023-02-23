let button = document.querySelector('#button');


button.addEventListener('click', function() {
	let inputs = document.querySelectorAll('#test input');
	
	for (let input of inputs) {
		if (input.value == input.dataset.right) {
			input.classList.add('correct');
		} else {
			input.classList.add('incorrect');
		}
	}
});
