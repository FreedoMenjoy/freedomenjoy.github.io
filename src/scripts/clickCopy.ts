/* eslint-disable @typescript-eslint/no-non-null-assertion */
export function clickCopy (this: HTMLTextAreaElement | HTMLInputElement): void {
  console.log('click copy', this.textContent);
  this.select?.();
  this.setSelectionRange?.(0, 99999);

  void navigator.clipboard.writeText(this.textContent!).then(() => {
    alert('Текст скопирован');
  });
}

export function clickCopyId (elementId: string): void {
  const element = document.getElementById(elementId) as HTMLTextAreaElement;
  if (element == null) throw new Error(`Element with id ${elementId} not found`);
  clickCopy.call(element);
}

Object.assign(window, {
  clickCopy,
  clickCopyId,
});
