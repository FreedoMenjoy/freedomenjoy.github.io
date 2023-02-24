'use strict';
/* global document alert */
const checkboxElement = document.querySelector('#checkbox');
checkboxElement.checked; // force error state before click
const menuOutfitElement = document.querySelector('.menu-outfit');
menuOutfitElement.addEventListener('click', (event) => {
    if (checkboxElement != null)
        checkboxElement.checked = !checkboxElement.checked;
});
