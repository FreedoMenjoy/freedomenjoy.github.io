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

function initUnselectable (node: Element): void {
  if (node.classList?.contains(noSelectClass)) return;
  if (node.nodeType === 1) {
    node.setAttribute('unselectable', 'on');
    // node.classList?.add('denycopy');
  }
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    initUnselectable(child);
  }
}

export function initGlobalNoUnselectable (origin: Node & GlobalEventHandlers & ParentNode = document): void {
  for (let i = 0; i < origin.children.length; i++) {
    const child = origin.children[i];
    initUnselectable(child);
  }
}

Object.assign(window, {
  noSelectClass,
  noSelectHandler,
  initGlobalNoSelect,
  initGlobalNoUnselectable,
});
