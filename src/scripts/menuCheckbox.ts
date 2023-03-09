import { forceQuerySelector } from './util/forceQuerySelector';

const checkboxElement = forceQuerySelector<HTMLInputElement>('#checkbox');
const menuOutfitElement = forceQuerySelector('.menu-outfit');
menuOutfitElement.addEventListener('click', () => {
  if (checkboxElement != null) { checkboxElement.checked = !checkboxElement.checked; }
});
