import { forceGetElementById, forceQuerySelector } from './forceQuerySelector';

interface HTMLElement {
  requestFullscreen?: () => void | Promise<void>;
  webkitRequestFullscreen?: () => void | Promise<void>;
  mozRequestFullscreen?: () => void | Promise<void>;
}

export async function requestFullscreen (element: HTMLElement): Promise<void> {
  if (element.requestFullscreen) {
    await element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    await element.webkitRequestFullscreen();
  } else if (element.mozRequestFullscreen) {
    await element.mozRequestFullscreen();
  }
}

export async function forceQuerySelectorRequestFullscreen (selector: string, origin?: Pick<globalThis.HTMLElement, 'querySelector'>): Promise<void> {
  const element = forceQuerySelector(selector, origin);
  await requestFullscreen(element);
}

export async function forceGetElementByIdRequestFullscreen (elementId: string, origin?: NonElementParentNode): Promise<void> {
  const element = forceGetElementById(elementId, origin);
  await requestFullscreen(element);
}

Object.assign(window, {
  requestFullscreen,
  forceQuerySelectorRequestFullscreen,
  forceGetElementByIdRequestFullscreen,
});
