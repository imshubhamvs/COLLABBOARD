import React from 'react';

const DrawingToolbar = ({
  tool,
  setTool,
  color,
  setColor,
  lineWidth,
  setLineWidth,
  onClearCanvas,
  undo,
  redo
}) => {
  return (
    <div className="w-64 bg-white shadow-sm border-r p-4 space-y-4">
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Tools</h3>
        <div className="space-y-2">
          <button
            onClick={() => setTool('pen')}
            className={`w-full text-left px-3 py-2 rounded ${tool === 'pen' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
          >
            ✏️ Pen
          </button>
          <button
            onClick={() => setTool('fill')}
            className={`w-full text-left px-3 py-2 rounded ${tool === 'fill' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
          >
            🪣 Fill
          </button>
          <button
            onClick={() => setTool('text')}
            className={`w-full text-left px-3 py-2 rounded ${tool === 'text' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
          >
            📝 Text
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Color</h3>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10 rounded border border-gray-300"
        />
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Size</h3>
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-gray-600">{lineWidth}px</span>
      </div>

      <div className="space-y-2">
        <button
          onClick={onClearCanvas}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
        >
          Clear Canvas
        </button>
      </div>
      <div className="space-y-2">
        <button onClick={undo} className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">Undo</button>
        <button onClick={redo} className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">Redo</button>
      </div>
    </div>
  );
};

export default DrawingToolbar;