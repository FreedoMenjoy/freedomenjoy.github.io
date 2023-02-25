export function forceQuerySelector<E extends Element = Element> (selector: string): E {
  const element = document.querySelector<E>(selector);
  if (element == null) {
    alert(`forceQuerySelector: selector ${selector} not found`);
    throw Error(`forceQuerySelector: selector ${selector} not found`);
  }
  return element;
}
