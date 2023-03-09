export function forceQuerySelector<E extends Element = Element> (selector: string, origin: Pick<HTMLElement, 'querySelector'> = document): E {
  const element = origin.querySelector<E>(selector);
  if (element == null) {
    throw Error(`forceQuerySelector: selector ${selector} not found`);
  }
  return element;
}

Object.assign(window, { forceQuerySelector });
