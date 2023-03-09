export function addEventListenerMouseDownMove<T extends HTMLElement = HTMLElement> (target: T, whileMove: (this: T, e: MouseEvent) => any, { onmousedown = true, stopPropagation = true } = {}): void {
  function boundWhileMove (e: MouseEvent): void {
    whileMove.call(target, e);
  }

  let ismousedown: boolean = false;

  window.addEventListener('mousedown', () => {
    ismousedown = true;
  });

  window.addEventListener('mouseup', () => {
    ismousedown = false;
  });

  if (onmousedown) {
    target.addEventListener('mousedown', (event) => {
      whileMove.call(target, event);
    });
  }

  target.addEventListener('mousemove', (event) => {
    if (!ismousedown) return;
    if (stopPropagation) event.stopPropagation(); // remove if you do want it to propagate ...
    whileMove.call(target, event);
  });
}
