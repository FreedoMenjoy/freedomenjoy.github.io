/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { canvasGetImageDataAvgColor, distanceWeightConst, distanceWeightEuclidean, distanceWeightEuclidean2, type DistanceWeightFn, distanceWeightManhattan, distanceWeightManhattan2, CanvasUndoableRect, canvasMouseEventPosition } from './util/canvas';
import { RGBColorToHex, type RGBColor } from './util/color';
import { ColorBlindnessMatrixesFns } from './util/colorBlindness';
import { closestRGBColor } from './util/colorClosest';
import { colorDistanceLabParamspaceSquare } from './util/colorDistance';
import { colorNames } from './util/colorNames';
import { colorNamesSimple } from './util/colorNamesSimple';
import { addEventListenerMouseDownMove } from './util/EventListener';
import { forceGetElementById } from './util/forceQuerySelector';
import { roundFixed } from './util/math';

const sliderPointRadiusElement = forceGetElementById<HTMLInputElement>('input-point-radius');
const selectPointDistFnElement = forceGetElementById<HTMLOptionElement>('select-point-dist-fn');
const checkboxPointDraw = forceGetElementById<HTMLInputElement>('input-point-draw');
const checkboxDrawZoom = forceGetElementById<HTMLInputElement>('input-draw-zoom');
const selectColorBlindness = forceGetElementById<HTMLInputElement>('select-color-blindness');
const fileInputElement = forceGetElementById<HTMLInputElement>('file-input');
const canvas = forceGetElementById<HTMLCanvasElement>('canvas');
const canvas2d: CanvasRenderingContext2D = canvas.getContext('2d', { willReadFrequently: true, alpha: false })!;
let canvasImage = document.createElement('img');

Object.assign(window, { canvas, canvas2d });
const canvasRect = canvas.getBoundingClientRect();

const distFns = {
  euclidean: distanceWeightEuclidean,
  euclidean2: distanceWeightEuclidean2,
  manhattan: distanceWeightManhattan,
  manhattan2: distanceWeightManhattan2,
  const: distanceWeightConst,
} as const;

const textSliderPointRadius = forceGetElementById<HTMLSpanElement>('text-input-point-radius');

function updateTextSliderPointRadius (): void {
  textSliderPointRadius.innerText = String(sliderPointRadiusElement.value);
}

sliderPointRadiusElement.addEventListener('input', updateTextSliderPointRadius);

sliderPointRadiusElement.addEventListener('change', updateTextSliderPointRadius);

updateTextSliderPointRadius();

let canvasPixelRect: CanvasUndoableRect | null = null;

function onFileInput (fileEvent: Event): void {
  const files = (fileEvent.target as HTMLInputElement).files;
  if (files == null) return;
  const file = files[0];

  if (!file.type.match('image.*')) return;

  const reader = new FileReader();

  reader.addEventListener('load', function onReaderLoad (readerEvent) {
    console.debug('file', file, readerEvent, reader.result);
    if (reader.result == null) return;
    canvasImage = document.createElement('img');
    // Render thumbnail.
    canvasImage.src = String(reader.result);
    // img.title = theFile.name;

    canvasImage.addEventListener('load', function onImageLoad () {
      console.debug(`img width:${canvasImage.width} height:${canvasImage.height}`);

      const widthScale = canvasImage.width / canvasRect.width;
      const heightScale = canvasImage.height / canvasRect.height;
      const maxScale = Math.max(widthScale, heightScale);

      const drawZoom = checkboxDrawZoom.checked;

      const width = drawZoom ? canvasImage.width : Math.round(canvasImage.width / maxScale);
      const height = drawZoom ? canvasImage.height : Math.round(canvasImage.height / maxScale);

      canvas.width = width;
      canvas.height = height;
      redrawCanvas();

      canvasPixelRect = null;
    });
  });

  // Read in the image file as a data URL.
  reader.readAsDataURL(file);
}

fileInputElement.addEventListener('change', onFileInput);

const textColorRGB = forceGetElementById<HTMLSpanElement>('text-color-rgb');
const textColorHex = forceGetElementById<HTMLSpanElement>('text-color-hex');
const textColorColor = forceGetElementById<HTMLSpanElement>('text-color-color');

const textColorName = forceGetElementById<HTMLSpanElement>('text-color-name');
const textColorNameDistance = forceGetElementById<HTMLSpanElement>('text-color-name-distance');
const textColorNameRGB = forceGetElementById<HTMLSpanElement>('text-color-name-rgb');
const textColorNameHex = forceGetElementById<HTMLSpanElement>('text-color-name-hex');
const textColorNameColor = forceGetElementById<HTMLSpanElement>('text-color-name-color');

const textColorNameSimple = forceGetElementById<HTMLSpanElement>('text-color-name-simple');
const textColorNameSimpleDistance = forceGetElementById<HTMLSpanElement>('text-color-name-simple-distance');
const textColorNameSimpleRGB = forceGetElementById<HTMLSpanElement>('text-color-name-simple-rgb');
const textColorNameSimpleHex = forceGetElementById<HTMLSpanElement>('text-color-name-simple-hex');
const textColorNameSimpleColor = forceGetElementById<HTMLSpanElement>('text-color-name-simple-color');

function displayColor (color: RGBColor): void {
  canvasPixelRect?.undo();
  canvasPixelRect = null;

  const roundColor: RGBColor = color.map(Math.round) as RGBColor;
  textColorRGB.innerText = roundColor.join(', ');
  textColorHex.innerText = RGBColorToHex(roundColor);
  textColorColor.style.backgroundColor = `rgb(${roundColor.join(', ')})`;

  const closestColorName = closestRGBColor(color, colorNames, colorDistanceLabParamspaceSquare);
  textColorName.innerText = closestColorName.name;
  textColorNameDistance.innerText = String(roundFixed(Math.sqrt(closestColorName.distance), 2));
  textColorNameRGB.innerText = closestColorName.color.join(', ');
  textColorNameHex.innerText = RGBColorToHex(closestColorName.color);
  textColorNameColor.style.backgroundColor = `rgb(${closestColorName.color.join(', ')})`;

  const closestColorNameSimple = closestRGBColor(color, colorNamesSimple, colorDistanceLabParamspaceSquare);
  textColorNameSimple.innerText = closestColorNameSimple.name;
  textColorNameSimpleDistance.innerText = String(roundFixed(Math.sqrt(closestColorNameSimple.distance), 2));
  textColorNameSimpleRGB.innerText = closestColorNameSimple.color.join(', ');
  textColorNameSimpleHex.innerText = RGBColorToHex(closestColorNameSimple.color);
  textColorNameSimpleColor.style.backgroundColor = `rgb(${closestColorNameSimple.color.join(', ')})`;
}

const textX = forceGetElementById<HTMLSpanElement>('text-x');
const textY = forceGetElementById<HTMLSpanElement>('text-y');

function onMouseMove (e: MouseEvent): void {
  canvasPixelRect?.undo();
  canvasPixelRect = null;

  const { x, y } = canvasMouseEventPosition(canvas, e);
  console.debug(`x:${x} y:${y}`);
  const rectSize = Math.floor(Number(sliderPointRadiusElement.value));
  const pointDistFn: DistanceWeightFn = Reflect.get(distFns, selectPointDistFnElement.value);
  const color = canvasGetImageDataAvgColor(canvas, x, y, { rectSize, distFn: pointDistFn });

  textX.innerText = String(x);
  textY.innerText = String(y);

  displayColor(color);

  if (checkboxPointDraw.checked) {
    canvas2d.beginPath();
    canvas2d.lineWidth = 1;
    canvas2d.strokeStyle = 'red';
    canvasPixelRect = CanvasUndoableRect.rect(canvas2d, color.rectX, color.rectY, color.rectW, color.rectH);
    canvas2d.rect(x, y, 1, 1);
    canvas2d.stroke();
  }
}

function redrawCanvas (): void {
  canvas2d.drawImage(canvasImage, 0, 0, canvas.width, canvas.height);
  const colorBlindnessFn: (color: RGBColor) => RGBColor = Reflect.get(ColorBlindnessMatrixesFns, selectColorBlindness.value);
  const newCanvasData = canvas2d.getImageData(0, 0, canvas.width, canvas.height);
  if (selectColorBlindness.value === 'normal' || colorBlindnessFn != null) {
    const newCanvasDataData = newCanvasData.data;
    for (let i = 0; i < newCanvasDataData.length; i += 4) {
      const newColor = colorBlindnessFn([newCanvasDataData[i], newCanvasDataData[i + 1], newCanvasDataData[i + 2]]);
      newCanvasDataData[i] = newColor[0];
      newCanvasDataData[i + 1] = newColor[1];
      newCanvasDataData[i + 2] = newColor[2];
    }
  }
  canvas2d.putImageData(newCanvasData, 0, 0);
}

selectColorBlindness.addEventListener('change', () => {
  redrawCanvas();
});

addEventListenerMouseDownMove(canvas, onMouseMove, { onmousedown: true, buttons: [1] });

canvas.addEventListener('contextmenu', function onCanvasContextmenu (event) {
  event.preventDefault();
});

const textLogs = forceGetElementById<HTMLCanvasElement>('text-log');

canvas.addEventListener('mousedown', (event) => {
  // textLogs.innerText = `button: ${event.button} buttons: ${event.buttons} type: ${event.type}`;
});
