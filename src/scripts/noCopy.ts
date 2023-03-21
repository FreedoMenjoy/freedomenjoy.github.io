export const noSelectClass = 'allowcopy';

export function noSelectHandler (event: Event): boolean {
  const target = event.target as HTMLElement;
  console.log('noSelectHandler', target);
  if (target.classList?.contains(noSelectClass)) return true;
  let parent = target.parentElement;
  while (parent != null) {
    if (parent.classList?.contains(noSelectClass)) return true;
    parent = parent.parentElement;
  }
  return false;
}

export function initGlobalNoSelect (origin: GlobalEventHandlers = document): void {
  origin.ondragstart = noSelectHandler;
  origin.onselectstart = noSelectHandler;
  origin.oncontextmenu = noSelectHandler;
}

Object.assign(window, {
  noSelectClass,
  noSelectHandler,
  initGlobalNoSelect,
});
