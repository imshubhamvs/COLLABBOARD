import React from 'react';

const TextInputModal = ({
  showTextInput,
  textInput,
  setTextInput,
  onAddText,
  onCancel
}) => {
  if (!showTextInput) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h3 className="text-lg font-medium mb-4">Add Text</h3>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter text..."
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={(e) => e.key === 'Enter' && onAddText()}
        />
        <div className="flex space-x-2">
          <button
            onClick={onAddText}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Add Text
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextInputModal;