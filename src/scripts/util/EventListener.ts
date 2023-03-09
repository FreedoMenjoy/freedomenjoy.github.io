export function addEventListenerMouseDownMove<T extends HTMLElement = HTMLElement> (target: T, whileMove: (this: T, e: MouseEvent) => any, { onmousedown = true, stopPropagation = true } = {}): void {
  function boundWhileMove (e: MouseEvent): void {
    whileMove.call(target, e);
  }

  function endMove (): void {
    target.removeEventListener('mousemove', boundWhileMove);
    window.removeEventListener('mouseup', endMove);
  }

  function startMove (event: MouseEvent): void {
    if (stopPropagation) event.stopPropagation(); // remove if you do want it to propagate ..
    if (onmousedown) whileMove.call(target, event);
    target.addEventListener('mousemove', boundWhileMove);
    window.addEventListener('mouseup', endMove);
  }

  window.addEventListener('mousedown', startMove);
}
