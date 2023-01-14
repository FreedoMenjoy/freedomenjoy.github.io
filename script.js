'use strict';
/* global document */
var checkboxElement = document.querySelector('#checkbox');
var menuOutfitElement = document.querySelector('.menu-outfit');
menuOutfitElement.onclick = function () {
    checkboxElement.checked = !checkboxElement.checked;
};