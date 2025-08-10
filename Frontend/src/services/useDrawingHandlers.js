// components/DrawingBoard/useDrawingHandlers.js
// import react from 'react'
import simplify from 'simplify-js';
import { floodFill } from './floodFillUtils';
// import socketService from './socketService';

const useDrawingHandlers = (params) => {
  const {
    canvasRef, ctxRef, selectedTool, selectedColor,lineWidth ,socketService, roomId,
    historyStack, setHistoryStack, redoStack, setRedoStack,
    strokePoints, setStrokePoints,
    drawStroke,
    isDrawing, setIsDrawing,
  } = params;


  // const [startPos, setStartPos] = react.useState(null);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    // console.log(e);

    if (selectedTool === 'fill') {
      floodFill(offsetX, offsetY, selectedColor, ctxRef, canvasRef);
      const fillStroke = { type: 'fill', x: offsetX, y: offsetY, color: selectedColor };
      // console.log(fillStroke);
      socketService.sendStroke({ roomId, stroke: fillStroke });
      setHistoryStack((prev) => [...prev, fillStroke]);
      setRedoStack([]);
      return;
    }


    if (selectedTool === 'pen') {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(offsetX, offsetY);
      ctxRef.current.lastX = offsetX;
      ctxRef.current.lastY = offsetY;
      setIsDrawing(true);
      // console.log(offsetX,offsetY);
      setStrokePoints([{ x: offsetX, y: offsetY }]);
      return;
    }

  };

  const draw = (e) => {
    if (!isDrawing) return;

    if (selectedTool === 'pen') {
      const { offsetX, offsetY } = e.nativeEvent;
      ctxRef.current.strokeStyle = selectedColor;
      ctxRef.current.lineWidth = lineWidth;
      ctxRef.current.lineTo(offsetX, offsetY);
      ctxRef.current.stroke();
      ctxRef.current.lastX = offsetX;
      ctxRef.current.lastY = offsetY;
      // console.log(offsetX,offsetY);
      setStrokePoints((prev) => [...prev, { x: offsetX, y: offsetY }]);
    }

    // 📝 Optional: for real-time preview of rectangle/line/circle
    // You can implement preview layer in future if needed
  };

  const endDrawing = (e) => {
    if (!isDrawing) return;

    // const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(false);

    if (selectedTool === 'pen') {
      ctxRef.current.closePath();

      const simplified = simplify(strokePoints, 2, true);
      const strokeGroup = [];

      for (let i = 1; i < simplified.length; i++) {
        const from = [simplified[i - 1].x, simplified[i - 1].y];
        const to = [simplified[i].x, simplified[i].y];
        const stroke = { type: 'pen', color: selectedColor, from, to ,lineWidth};
        socketService.sendStroke({ roomId, stroke });
        strokeGroup.push(stroke);
      }

      if (strokeGroup.length > 0) {
        setHistoryStack((prev) => [...prev, ...strokeGroup]);
        setRedoStack([]);
      }

      setStrokePoints([]);
      return;
    }


  };

 

  const undo = () => {
    if (!historyStack.length) return;
    const newHistory = [...historyStack];
    const last = newHistory.pop();
    setHistoryStack(newHistory);
    setRedoStack((prev) => [...prev, last]);

    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    newHistory.forEach((s) => drawStroke(s, ctxRef, canvasRef));
  };

  const redo = () => {
    if (!redoStack.length) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setHistoryStack((prev) => [...prev, next]);
    drawStroke(next, ctxRef, canvasRef);
  };

  return { startDrawing, draw, endDrawing, undo, redo };
};


export default useDrawingHandlers;
