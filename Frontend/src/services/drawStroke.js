// components/DrawingBoard/drawStroke.js
import { floodFill } from './floodFillUtils';

export const drawStroke = (stroke, ctxRef, canvasRef) => {
  // console.log(ctxRef);

  if (!ctxRef.current) return;
  // console.log(stroke);
  const ctx = ctxRef.current;

  if (stroke.type === 'pen') {
    ctx.beginPath();
    ctx.moveTo(...stroke.from);
    ctx.lineTo(...stroke.to);
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.lineWidth;
    ctx.stroke();
    ctx.closePath();
  }

  if (stroke.type === 'fill') {
    floodFill(stroke.x, stroke.y, stroke.color, ctxRef, canvasRef);
  }

  if (stroke.type === 'text') {
    ctx.fillStyle = stroke.color;
    ctx.font = '20px Arial';
    ctx.fillText(stroke.text, stroke.x, stroke.y);
  }

  // if (stroke.type === 'rectangle') {
  //   const [x1, y1] = stroke.from;
  //   const [x2, y2] = stroke.to;
  //   const width = x2 - x1;
  //   const height = y2 - y1;
  //   ctx.strokeStyle = stroke.color;
  //   ctx.lineWidth = 2;
  //   ctx.strokeRect(x1, y1, width, height);
  // }

  // if (stroke.type === 'circle') {
  //   const [x1, y1] = stroke.from;
  //   const [x2, y2] = stroke.to;
  //   const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  //   ctx.beginPath();
  //   ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
  //   ctx.strokeStyle = stroke.color;
  //   ctx.lineWidth = 2;
  //   ctx.stroke();
  //   ctx.closePath();
  // }

  // if (stroke.type === 'line') {
  //   const [x1, y1] = stroke.from;
  //   const [x2, y2] = stroke.to;
  //   ctx.beginPath();
  //   ctx.moveTo(x1, y1);
  //   ctx.lineTo(x2, y2);
  //   ctx.strokeStyle = stroke.color;
  //   ctx.lineWidth = 2;
  //   ctx.stroke();
  //   ctx.closePath();
  // }
};
