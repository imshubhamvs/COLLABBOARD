// // components/DrawingBoard/useSocketHandlers.js
// import { useEffect } from 'react';

// const useSocketHandlers = (socket, drawStroke, setHistoryStack, ctxRef, canvasRef) => {
//   useEffect(() => {
//     if (!socket || !ctxRef?.current || !canvasRef?.current) return;

//     socket.on('init-canvas-state', (strokes) => {
//       strokes.forEach((stroke) => drawStroke(stroke, ctxRef, canvasRef)); // ✅ fixed
//       setHistoryStack(strokes);
//     });

//     socket.on('receive-stroke', (stroke) => {
//       drawStroke(stroke, ctxRef, canvasRef); // ✅ fixed
//       setHistoryStack((prev) => [...prev, stroke]);
//     });

//     return () => {
//       socket.off('receive-stroke');
//       socket.off('init-canvas-state');
      
//     };
    
//   }, [socket, ctxRef, canvasRef, drawStroke, setHistoryStack]);
// };

// export default useSocketHandlers;
