import { forceQuerySelector } from "./forceQuerySelector";

window.addEventListener('scroll', () => {
    var scroll = forceQuerySelector('.back-to-top');
    scroll.classList.toggle("active", window.scrollY > 500);
});

export function scrollToTop() {
    window.scrollTo({
        top:0,
        behavior:'smooth'
    })
}

Object.assign(window, { scrollToTop });
