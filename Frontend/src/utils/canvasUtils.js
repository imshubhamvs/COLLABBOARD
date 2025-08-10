// // Canvas utility functions
// export const setupCanvas = (canvasRef, ctxRef) => {
//   const resizeCanvas = () => {
//     const canvas = canvasRef.current;
//     canvas.width = window.innerWidth * 0.8;
//     canvas.height = window.innerHeight * 0.8;
//     const context = canvas.getContext('2d');
//     context.lineCap = 'round';
//     context.lineJoin = 'round';
//     ctxRef.current = context;
//   };

//   resizeCanvas();
//   window.addEventListener('resize', resizeCanvas);

//   return () => window.removeEventListener('resize', resizeCanvas);
// };

// export const getCanvasCoordinates = (e, canvas) => {
//   const rect = canvas.getBoundingClientRect();
  
//   return {
//         x: (e.clientX - rect.left) * (canvas.width / rect.width),
//         y: (e.clientY - rect.top) * (canvas.height / rect.height)
//   };
// };

// export const floodFill = (ctx, startX, startY, fillColor) => {
//   const canvas = ctx.canvas;
//   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   const { data, width, height } = imageData;

//   // Ensure coordinates are integers and within bounds
//   startX = Math.floor(startX);
//   startY = Math.floor(startY);
  
//   if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
//     return; // Click outside canvas bounds
//   }

//   const getPixelIndex = (x, y) => (y * width + x) * 4;

//   const getPixelColor = (x, y) => {
//     if (x < 0 || x >= width || y < 0 || y >= height) return null;
//     const idx = getPixelIndex(x, y);
//     return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
//   };

//   const setPixelColor = (x, y, color) => {
//     if (x < 0 || x >= width || y < 0 || y >= height) return;
//     const idx = getPixelIndex(x, y);
//     data[idx] = color[0];
//     data[idx + 1] = color[1];
//     data[idx + 2] = color[2];
//     data[idx + 3] = color[3];
//   };

//   const hexToRgba = (hex) => {
//     const bigint = parseInt(hex.slice(1), 16);
//     return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
//   };

//   const colorsMatch = (a, b) => {
//     if (!a || !b) return false;
//     return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
//   };

//   const startColor = getPixelColor(startX, startY);
//   const fillColorRgba = hexToRgba(fillColor);
  
//   // Don't fill if clicking on the same color or invalid start color
//   if (!startColor || colorsMatch(startColor, fillColorRgba)) return;

//   // Use breadth-first search instead of stack to prevent stack overflow
//   const queue = [[startX, startY]];
//   const visited = new Set();
//   const maxIterations = width * height; // Prevent infinite loops
//   let iterations = 0;

//   while (queue.length > 0 && iterations < maxIterations) {
//     const [x, y] = queue.shift();
//     const key = `${x},${y}`;
    
//     if (visited.has(key)) continue;
//     visited.add(key);
//     iterations++;
    
//     const currentColor = getPixelColor(x, y);
//     if (!colorsMatch(currentColor, startColor)) continue;
    
//     setPixelColor(x, y, fillColorRgba);
    
//     // Add neighboring pixels (4-connected)
//     const neighbors = [
//       [x + 1, y],
//       [x - 1, y], 
//       [x, y + 1],
//       [x, y - 1]
//     ];
    
//     for (const [nx, ny] of neighbors) {
//       if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
//         const neighborKey = `${nx},${ny}`;
//         if (!visited.has(neighborKey)) {
//           queue.push([nx, ny]);
//         }
//       }
//     }
//   }
  
//   ctx.putImageData(imageData, 0, 0);
// };

// export const clearCanvas = (ctx, canvas) => {
//   const rect = canvas.getBoundingClientRect();
//   ctx.fillStyle = 'white';
//   ctx.fillRect(0, 0, rect.width, rect.height);
// };