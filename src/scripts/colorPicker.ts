/* eslint-disable @typescript-eslint/no-non-null-assertion */
const textElement = document.getElementById('text') as HTMLSpanElement;
const sliderRadiusElement = document.getElementById('radius') as HTMLInputElement;
const selectDistFnElement = document.getElementById('distFn') as HTMLOptionElement;
const fileInputElement = document.getElementById('fileInput') as HTMLInputElement;
const img = document.createElement('img');
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvas2d = canvas.getContext('2d')!;

function roundFixed (num: number, fix: number = 2): number {
  return Number(Number.prototype.toFixed.call(num, fix));
}

function addEventListenerMouseDownMove<T extends HTMLElement = HTMLElement> (target: T, whileMove: (e: MouseEvent) => any): void {
  function endMove (): void {
    window.removeEventListener('mousemove', whileMove);
    window.removeEventListener('mouseup', endMove);
  }

  function startMove (event: MouseEvent): void {
    event.stopPropagation(); // remove if you do want it to propagate ..
    window.addEventListener('mousemove', whileMove);
    window.addEventListener('mouseup', endMove);
  }

  target.addEventListener('mousedown', startMove);
}

function pixelMultEuclidean (dx: number, dy: number): number {
  return 1 / (Math.sqrt(dx * dx + dy * dy) + 1);
}

function pixelMultEuclidean2 (dx: number, dy: number): number {
  const mult = pixelMultEuclidean(dx, dy);
  return mult * mult;
}

function pixelMultManhattan (dx: number, dy: number): number {
  return 1 / (Math.abs(dx) + Math.abs(dy) + 1);
}

function pixelMultManhattan2 (dx: number, dy: number): number {
  const mult = pixelMultManhattan(dx, dy);
  return mult * mult;
}

function pixelMultConst (dx: number, dy: number): number {
  return 1;
}

const distFns = {
  euclidean: pixelMultEuclidean,
  euclidean2: pixelMultEuclidean2,
  manhattan: pixelMultManhattan,
  manhattan2: pixelMultManhattan2,
  const: pixelMultConst,
} as const;

type RGBColor = [r: number, g: number, b: number];

function getCanvasRectColor (canvas: HTMLCanvasElement, x: number, y: number, { rectSize = 1, distFn = pixelMultEuclidean, canvas2d = canvas.getContext('2d')! } = {}): RGBColor & { rectX: number, rectY: number, rectW: number, rectH: number } {
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let avger = 0;
  const rectX = Math.max(x - rectSize, 0);
  const rectY = Math.max(y - rectSize, 0);
  const rectW = Math.max(Math.min(canvas.width - x + rectSize, rectSize * 2 + 1, Math.min(x, rectSize) + rectSize + 1), 1);
  const rectH = Math.max(Math.min(canvas.height - y + rectSize, rectSize * 2 + 1, Math.min(y, rectSize) + rectSize + 1), 1);
  const data = canvas2d.getImageData(rectX, rectY, rectW, rectH).data;
  for (let i = 0; i < data.length; i += 4) {
    const di = i / 4;
    const dx = rectX + (di % rectW) - x;
    const dy = rectY + Math.floor(di / rectW) - y;
    const R = data[i];
    const G = data[i + 1];
    const B = data[i + 2];
    const mult = distFn(dx, dy);
    sumR += R * R * mult;
    sumG += G * G * mult;
    sumB += B * B * mult;
    avger += mult;
  }
  const color: RGBColor = [
    Math.sqrt(sumR / avger),
    Math.sqrt(sumG / avger),
    Math.sqrt(sumB / avger),
  ];
  return Object.assign(color, { rectX, rectY, rectW, rectH });
}

function onFileInput (evt: Event): void {
  const files = (evt.target as HTMLInputElement).files;
  if (files == null) return;
  const file = files[0];

  if (!file.type.match('image.*')) return;

  const reader = new FileReader();

  reader.addEventListener('load', (e) => {
    console.log('file', file, e, reader.result);
    if (reader.result == null) return;
    // Render thumbnail.
    img.src = String(reader.result);
    // img.title = theFile.name;

    img.addEventListener('load', function onImageLoad () {
      console.log(`img width:${img.width} height:${img.height}`);

      const canvasRect = canvas.getBoundingClientRect();

      // canvas.width = Math.max(img.width, 200);
      // canvas.height = Math.max(img.height, 200);
      canvas2d.drawImage(img, 0, 0, canvasRect.width, canvasRect.height);
    });
  });

  // Read in the image file as a data URL.
  reader.readAsDataURL(file);
}

fileInputElement.addEventListener('change', onFileInput);

function onMouseMove (e: MouseEvent): void {
  // canvas.width = img.width;
  // canvas.height = img.height;
  // canvas2d.drawImage(img, 0, 0, img.width, img.height);

  const x = Math.min(e.offsetX, img.width - 1);
  const y = Math.min(e.offsetY, img.height - 1);
  const rectSize = Math.floor(Number(sliderRadiusElement.value));
  const distFn = Reflect.get(distFns, selectDistFnElement.value) ?? pixelMultEuclidean;
  const color = getCanvasRectColor(canvas, x, y, { rectSize, distFn });
  // textElement.innerText = `x:${x} y:${y} color:[${roundColors.join(', ')}] rectSize:${rectSize} distFn:${distFn.name} rect:[${color.rectX}, ${color.rectY}, ${color.rectW}, ${color.rectH}: ${color.rectX + color.rectW - 1}, ${color.rectY + color.rectH - 1}]`;
  const hexColor = roundFixed(Math.round(color[0]), 0) * 0x10000 + roundFixed(Math.round(color[1]), 0) * 0x100 + roundFixed(Math.round(color[2]), 0);
  textElement.innerText = `цвет: rgb(${color.map(c => Math.round(c)).join(', ')}) hex:#${hexColor.toString(16).padStart(6, '0')}`;
  // document.body.style.backgroundColor = `rgb(${roundColors[0]},${roundColors[1]},${roundColors[2]})`;

  // canvas2d.beginPath();
  // canvas2d.lineWidth = 1;
  // canvas2d.strokeStyle = 'red';
  // canvas2d.rect(rectX, rectY, rectW, rectH);
  // canvas2d.stroke();
}

addEventListenerMouseDownMove(canvas, onMouseMove);
