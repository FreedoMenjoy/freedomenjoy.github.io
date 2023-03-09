export function clickCopy (this: HTMLTextAreaElement | HTMLInputElement): void {
  console.log('click copy', this.textContent);
  this.select?.();
  this.setSelectionRange?.(0, 99999);

  navigator.clipboard.writeText(this.textContent!);

  alert('Текст скопирован');
}

export function clickCopyId (elementId: string) {
  const element = document.getElementById(elementId) as HTMLTextAreaElement;
  if (element == null) throw new Error(`Element with id ${elementId} not found`);
  return clickCopy.call(element);
}

Object.assign(window, {
  clickCopy,
  clickCopyId,
});
