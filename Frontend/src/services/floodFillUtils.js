// components/DrawingBoard/floodFillUtils.js
export const hexToRgba = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
};

export const floodFill = (startX, startY, fillColor, ctxRef, canvasRef) => {
  const ctx = ctxRef.current;
  const canvas = canvasRef.current;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;

  const targetColor = getColorAtPixel(data, startX, startY, width);
  const replacementColor = hexToRgba(fillColor);
  if (colorsMatch(targetColor, replacementColor)) return;

  const pixelStack = [[startX, startY]];
  while (pixelStack.length) {
    const [x, y] = pixelStack.pop();
    const currentColor = getColorAtPixel(data, x, y, width);
    if (!colorsMatch(currentColor, targetColor)) continue;
    setColorAtPixel(data, x, y, width, replacementColor);
    pixelStack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  ctx.putImageData(imageData, 0, 0);
};

const getColorAtPixel = (data, x, y, width) => {
  const i = (y * width + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};

const setColorAtPixel = (data, x, y, width, color) => {
  const i = (y * width + x) * 4;
  [data[i], data[i + 1], data[i + 2], data[i + 3]] = color;
};

const colorsMatch = (a, b) =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
