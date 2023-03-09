import { forceQuerySelector } from './util/forceQuerySelector';

window.addEventListener('scroll', () => {
  const scroll = forceQuerySelector('.back-to-top');
  scroll.classList.toggle('active', window.scrollY > 500);
});

export function scrollToTop (): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

Object.assign(window, { scrollToTop });
