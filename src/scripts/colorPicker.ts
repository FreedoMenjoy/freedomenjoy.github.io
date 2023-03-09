import { canvasGetImageDataAvgColor, distanceWeightConst, distanceWeightEuclidean, distanceWeightEuclidean2, type DistanceWeightFn, distanceWeightManhattan, distanceWeightManhattan2, CanvasUndoableRect } from "./util/canvas";
import { RGBColorToHex, type RGBColor } from "./util/color";
import { colorClosest } from "./util/colorClosest";
import { ColorDistanceFn, colorDistanceRedmeanSquare, colorDistanceWeightedSquare } from "./util/colorDistance";
import { colorNames } from "./util/colorNames";
import { addEventListenerMouseDownMove } from "./util/EventListener";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const textElement = document.getElementById('text') as HTMLSpanElement;
const sliderRadiusElement = document.getElementById('radius') as HTMLInputElement;
const selectDistFnElement = document.getElementById('distFn') as HTMLOptionElement;
const selectColorDistFnElement = document.getElementById('colorDistFn') as HTMLOptionElement;
const fileInputElement = document.getElementById('fileInput') as HTMLInputElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvas2d = canvas.getContext('2d')!;

const distFns = {
  euclidean: distanceWeightEuclidean,
  euclidean2: distanceWeightEuclidean2,
  manhattan: distanceWeightManhattan,
  manhattan2: distanceWeightManhattan2,
  const: distanceWeightConst,
} as const;

function onFileInput (evt: Event): void {
  const files = (evt.target as HTMLInputElement).files;
  if (files == null) return;
  const file = files[0];

  if (!file.type.match('image.*')) return;

  const reader = new FileReader();

  reader.addEventListener('load', (e) => {
    console.log('file', file, e, reader.result);
    if (reader.result == null) return;
    const img = document.createElement('img');
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

let canvasRect: CanvasUndoableRect | null = null;

function onMouseMove (e: MouseEvent): void {
  canvasRect?.undo();

  const x = Math.min(e.offsetX, canvas.width - 1);
  const y = Math.min(e.offsetY, canvas.height - 1);
  const rectSize = Math.floor(Number(sliderRadiusElement.value));
  const distFn: DistanceWeightFn = Reflect.get(distFns, selectDistFnElement.value);
  const color = canvasGetImageDataAvgColor(canvas, x, y, { rectSize, distFn });
  const roundColors: RGBColor = color.map(Math.round) as RGBColor;
  // textElement.innerText = `x:${x} y:${y} color:[${roundColors.join(', ')}] rectSize:${rectSize} distFn:${distFn.name} rect:[${color.rectX}, ${color.rectY}, ${color.rectW}, ${color.rectH}: ${color.rectX + color.rectW - 1}, ${color.rectY + color.rectH - 1}]`;
  const hexColor = RGBColorToHex(roundColors);
  textElement.innerText = `rgb(${roundColors.join(', ')}) hex:#${hexColor}`;
  // document.body.style.backgroundColor = `rgb(${roundColors[0]},${roundColors[1]},${roundColors[2]})`;

  canvas2d.beginPath();
  canvas2d.lineWidth = 1;
  canvas2d.strokeStyle = 'red';
  canvasRect = CanvasUndoableRect.rect(canvas2d, color.rectX, color.rectY, color.rectW, color.rectH);
  canvas2d.stroke();
}

addEventListenerMouseDownMove(canvas, onMouseMove);
