export function forceQuerySelector<E extends Element = Element> (selector: string, origin: Pick<HTMLElement, 'querySelector'> = document): E {
  const element = origin.querySelector<E>(selector);
  if (element == null) {
    throw new Error(`${forceQuerySelector.name}: selector ${selector} not found`);
  }
  return element;
}

export function forceGetElementById<E extends Element = Element> (elementId: string, origin: NonElementParentNode = document): E {
  const element = origin.getElementById(elementId);
  if (element == null) {
    throw new Error(`${forceGetElementById.name}: id ${elementId} not found`);
  }
  return element as E;
}

Object.assign(window, { forceQuerySelector, forceGetElementById });
