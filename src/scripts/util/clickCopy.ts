export function clickCopy (this: HTMLTextAreaElement, e: MouseEvent): void {
  this.select();
  this.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(this.value);

  alert('Текст скопирован');
}
