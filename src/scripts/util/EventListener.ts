export interface AddEventListenerMouseDownMoveOptions {
  onmousedown?: boolean;
  stopPropagation?: boolean;
  buttons?: number[];
}

export function addEventListenerMouseDownMove<T extends HTMLElement = HTMLElement> (target: T, whileMove: (this: T, e: MouseEvent) => any, options?: AddEventListenerMouseDownMoveOptions): void {
  function boundWhileMove (e: MouseEvent): void {
    whileMove.call(target, e);
  }

  let ismousedown: boolean = false;

  window.addEventListener('mousedown', (event) => {
    if (options?.buttons != null && !options.buttons.includes(event.which)) return;
    ismousedown = true;
  });

  window.addEventListener('mouseup', () => {
    ismousedown = false;
  });

  if (options?.onmousedown) {
    target.addEventListener('mousedown', (event) => {
      whileMove.call(target, event);
    });
  }

  target.addEventListener('mousemove', (event) => {
    if (!ismousedown) return;
    if (options?.stopPropagation) event.stopPropagation(); // remove if you do want it to propagate ...
    whileMove.call(target, event);
  });
}
