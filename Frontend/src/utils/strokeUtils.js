// // Utility functions for stroke simplification and management
// export const simplifyStroke = (points, tolerance = 2) => {
//   if (points.length <= 2) return points;
 
//   // Douglas-Peucker algorithm for line simplification
//   const simplify = (points, tolerance) => {
//     if (points.length <= 2) return points;
   
//     let dmax = 0;
//     let index = 0;
//     const end = points.length - 1;
   
//     for (let i = 1; i < end; i++) {
//       const d = perpendicularDistance(points[i], points[0], points[end]);
//       if (d > dmax) {
//         index = i;
//         dmax = d;
//       }
//     }
   
//     if (dmax > tolerance) {
//       const recResults1 = simplify(points.slice(0, index + 1), tolerance);
//       const recResults2 = simplify(points.slice(index), tolerance);
     
//       return [...recResults1.slice(0, -1), ...recResults2];
//     }
   
//     return [points[0], points[end]];
//   };
 
//   return simplify(points, tolerance);
// };

// const perpendicularDistance = (point, lineStart, lineEnd) => {
//   const dx = lineEnd.x - lineStart.x;
//   const dy = lineEnd.y - lineStart.y;
 
//   if (dx === 0 && dy === 0) {
//     return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
//   }
 
//   const normalLength = Math.sqrt(dx * dx + dy * dy);
//   return Math.abs((dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) / normalLength);
// };

// export const createStrokeData = (type, data) => {
//   const baseData = {
//     timestamp: Date.now()
//   };
  
//   switch (type) {
//     case 'pen':
//       return {
//         type,
//         data: {
//           ...baseData,
//           points: simplifyStroke(data.points || []),
//           color: data.color,
//           lineWidth: data.lineWidth
//         }
//       };
   
//     case 'fill':
//       return {
//         type,
//         data: {
//           ...baseData,
//           x: data.x,
//           y: data.y,
//           fillColor: data.fillColor // Consistent property name
//         }
//       };
   
//     case 'text':
//       return {
//         type,
//         data: {
//           ...baseData,
//           text: data.text,
//           x: data.x,
//           y: data.y,
//           color: data.color,
//           fontSize: data.fontSize
//         }
//       };
   
//     case 'clear':
//       return {
//         type,
//         data: baseData
//       };
   
//     default:
//       return null;
//   }
// };

// export const replayStroke = (ctx, stroke) => {
//   const { type, data } = stroke;
 
//   switch (type) {
//     case 'pen':
//       replayPenStroke(ctx, data);
//       break;
//     case 'fill':
//       // Fill is handled separately in the component
//       const { x, y, fillColor } = data;
//       // Import floodFill if needed, or handle in component
//       break;
//     case 'text':
//       replayTextStroke(ctx, data);
//       break;
//     case 'clear':
//       const canvas = ctx.canvas;
//       ctx.save();
//       ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
//       ctx.fillStyle = 'white';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       ctx.restore();
//       break;
//   }
// };

// const replayPenStroke = (ctx, data) => {
//   const { points, color, lineWidth } = data;
 
//   if (!points || points.length < 2) return;
 
//   ctx.save();
//   ctx.strokeStyle = color;
//   ctx.lineWidth = lineWidth;
//   ctx.lineCap = 'round';
//   ctx.lineJoin = 'round';
 
//   ctx.beginPath();
  
//   // Convert coordinates back to display space if needed
//   const dpr = window.devicePixelRatio || 1;
//   const firstPoint = points[0];
//   ctx.moveTo(firstPoint.x / dpr, firstPoint.y / dpr);
 
//   for (let i = 1; i < points.length; i++) {
//     const point = points[i];
//     ctx.lineTo(point.x / dpr, point.y / dpr);
//   }
 
//   ctx.stroke();
//   ctx.restore();
// };

// const replayTextStroke = (ctx, data) => {
//   const { text, x, y, color, fontSize } = data;
 
//   ctx.save();
//   ctx.fillStyle = color;
//   ctx.font = `${fontSize}px Arial`;
  
//   // Convert coordinates back to display space if needed
//   const dpr = window.devicePixelRatio || 1;
//   ctx.fillText(text, x / dpr, y / dpr);
//   ctx.restore();
// };