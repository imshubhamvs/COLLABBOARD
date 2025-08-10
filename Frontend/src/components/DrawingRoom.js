import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import useCanvasSetup from "../services/useCanvasSetup";
import useDrawingHandlers from "../services/useDrawingHandlers";
import { drawStroke } from "../services/drawStroke";
import socketService from "../services/socketService";
import DrawingToolbar from "./DrawingToolbar";

const DrawingRoom = ({ roomId, navigate }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [selectedTool, setTool] = useState("pen");
  const [selectedColor, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [users, setUsers] = useState([]);

  const [isDrawing, setIsDrawing] = useState(false);
  const [strokePoints, setStrokePoints] = useState([]);
  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    setUsers([{ id: user.id, fullName: user.fullName }]);
  }, [user]);

  useCanvasSetup(canvasRef, ctxRef);
 
  const setupSocketListeners = () => {
    // Initial canvas state when joining room
    socketService.onInitCanvasState((strokes) => {
      strokes.forEach((stroke) => drawStroke(stroke, ctxRef, canvasRef)); // ✅ fixed
      setHistoryStack(strokes);
    });

    // // Receive stroke from other users
    socketService.onReceiveStroke((stroke) => {
      drawStroke(stroke, ctxRef, canvasRef); 
      setHistoryStack((prev) => [...prev, stroke]);
    });

    // Canvas cleared by other user
    socketService.onCanvasCleared(() => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

    });

    // Users updated
    socketService.onUsersUpdated((userCount) => {
      setUsers((prev) => {
        // Update user count - in a real app, you'd get actual user data
        const newUsers = [{ id: user.id, fullName: user.fullName }];
        for (let i = 1; i < userCount; i++) {
          newUsers.push({ id: `user-${i}`, fullName: `User ${i}` });
        }
        return newUsers;
      });
    });
  };

    useEffect(() => {
    // Initialize socket connection
    socketService.connect(token);

    // Join room
    socketService.joinRoom(roomId, token);

    // Set up socket listeners
    setupSocketListeners();

    // Cleanup on unmount
    return () => {
      socketService.offAllListeners();
      socketService.disconnect();
    };
  }, [roomId, token]);

  const handleSaveFile = () => {
    socketService.onSaveFile(roomId);
  };
  const handleClearCanvas = () => {
    socketService.clearCanvas(roomId);
  };

  const { startDrawing, draw, endDrawing, undo, redo } = useDrawingHandlers({
    canvasRef,
    ctxRef,
    selectedTool,
    selectedColor,
    lineWidth,
    socketService,
    roomId,
    historyStack,
    setHistoryStack,
    redoStack,
    setRedoStack,
    strokePoints,
    setStrokePoints,
    drawStroke,
    isDrawing,
    setIsDrawing,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                ← Back
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                Room: {roomId}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                  onClick={handleSaveFile}
                >
                  Save
                </button>
              </span>
              <span className="text-sm text-gray-600">
                Users online: {users.length}
              </span>
              <div className="flex space-x-2">
                {users.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    title={user.fullName}
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                ))}
                {users.length > 3 && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                    +{users.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Toolbar */}
        <DrawingToolbar
          tool={selectedTool}
          setTool={setTool}
          color={selectedColor}
          setColor={setColor}
          lineWidth={lineWidth}
          setLineWidth={setLineWidth}
          onClearCanvas={handleClearCanvas}
          undo={undo}
          redo={redo}
        />

        {/* Canvas Area */}
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            style={{
              border: "1px solid #ccc",
              backgroundColor: "white",
              cursor: selectedTool === "fill" ? "cell" : "crosshair",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DrawingRoom;
