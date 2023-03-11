export interface AddEventListenerMouseDownMoveOptions {
  onmousedown?: boolean;
  stopPropagation?: boolean;
  buttons?: number[];
}

export function addEventListenerMouseDownMove<T extends HTMLElement = HTMLElement> (target: T, whileMove: (this: T, e: MouseEvent) => any, options?: AddEventListenerMouseDownMoveOptions): void {
  let ismousedown: boolean = false;

  window.addEventListener('mousedown', function onWindowMouseup (event) {
    if (options?.buttons != null && !options.buttons.some(button => event.buttons & button)) return;
    ismousedown = true;
  });

  window.addEventListener('mouseup', function onWindowMouseup () {
    ismousedown = false;
  });

  if (options?.onmousedown) {
    target.addEventListener('mousedown', function onMousedown (event) {
      whileMove.call(target, event);
    });
  }

  target.addEventListener('mousemove', function onMousemove (event) {
    if (!ismousedown) return;
    if (options?.stopPropagation) event.stopPropagation(); // remove if you do want it to propagate ...
    whileMove.call(target, event);
  });
}
