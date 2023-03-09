import { forceQuerySelector } from './util/forceQuerySelector';

export function openbox (selector: string): void {
  const element = forceQuerySelector<HTMLElement>(selector);
  if (element.style.display === 'none') {
    element.style.display = 'block';
  } else {
    element.style.display = 'none';
  }
}

Object.assign(window, { openbox });
