'use strict';
var checkboxElement = null;
var menuOutfitElement = null;
/* global document alert */
try {
    checkboxElement = document.querySelector('#checkbox');
    menuOutfitElement = document.querySelector('.menu-outfit');
    if (checkboxElement == null)
        alert('DEBUG: Checkbox button element not found');
    if (menuOutfitElement == null)
        alert('DEBUG: Menu button element not found');
    if (menuOutfitElement != null) {
        menuOutfitElement.addEventListener('click', (event) => {
            event.stopPropagation();
            if (checkboxElement != null)
                checkboxElement.checked = !checkboxElement.checked;
        });
    }
}
catch (err) {
    alert(`ERROR ${String(err)}`);
}
