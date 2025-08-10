const { createCanvas } = require('canvas');

function renderStrokesToPNG(strokes, width = 1920, height = 1080) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Optional: white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  for (const stroke of strokes) {
    const { type, data } = stroke;

    if (type === 'pen' && data.points && data.points.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = data.color || '#000000';
      ctx.lineWidth = data.lineWidth || 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      const points = data.points;
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }

    else if (type === 'text') {
      ctx.fillStyle = data.color || '#000000';
      ctx.font = `${data.fontSize || 20}px sans-serif`;
      ctx.fillText(data.text, data.x, data.y);
    }

    else if (type === 'fill') {
      // Simulate a fill (use true flood fill later if needed)
      ctx.fillStyle = data.fillColor || '#ff0000';
      ctx.beginPath();
      ctx.arc(data.x, data.y, 10, 0, 2 * Math.PI); // simulate fill region
      ctx.fill();
    }

    else if (type === 'clear') {
      ctx.clearRect(0, 0, width, height);
    }
  }

  return canvas.toBuffer('image/png');
}

module.exports = renderStrokesToPNG;
