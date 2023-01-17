/*'use strict';
 global document 
var checkboxElement = document.querySelector('#checkbox');
var menuOutfitElement = document.querySelector('.menu-outfit');
menuOutfitElement.onclick = function () {
    checkboxElement.checked = !checkboxElement.checked;
};*/
'use strict';
/* global document alert*/ 
var checkboxElement = document.querySelector('#checkbox');
var menuOutfitElement = document.querySelector('.menu-outfit');
menuOutfitElement.onclick = function () {
    checkboxElement.checked = !checkboxElement.checked;
};
if (checkboxElement == null)
    alert('DEBUG: Checkbox button element not found');
if (menuOutfitElement == null)
    alert('DEBUG: Menu button element not found');
if (menuOutfitElement != null) {
    menuOutfitElement.addEventListener('click', function () {
        if (checkboxElement != null)
            checkboxElement.checked = !checkboxElement.checked;
    });
}