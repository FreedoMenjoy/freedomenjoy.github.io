import { forceQuerySelector } from './util/forceQuerySelector';

export function openbox (selector: string): void {
  const element = forceQuerySelector<HTMLElement>(selector);
  element.style.display = 'block';
}

export function closebox (selector: string): void {
  const element = forceQuerySelector<HTMLElement>(selector);
  element.style.display = 'none';
}

export function togglebox (selector: string, display: string = 'block'): boolean {
  const element = forceQuerySelector<HTMLElement>(selector);
  if (element.style.display === 'none') {
    element.style.display = display;
    return true;
  } else {
    element.style.display = 'none';
    return false;
  }
}

Object.assign(window, { openbox, closebox, togglebox });
