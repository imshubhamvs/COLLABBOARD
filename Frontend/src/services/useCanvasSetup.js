// components/DrawingBoard/useCanvasSetup.js
import { useEffect } from 'react';

const useCanvasSetup = (canvasRef, ctxRef) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    ctxRef.current = context;
  }, [canvasRef, ctxRef]);
};

export default useCanvasSetup;
