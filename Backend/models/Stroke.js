const mongoose = require("mongoose");

const strokeSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true },
  type: { 
    type: String, 
    enum: ['pen', 'fill', 'text', 'clear'], 
    required: true 
  },
  data: {
    // For pen strokes
    points: [{ x: Number, y: Number }],
    color: String,
    lineWidth: Number,
    
    // For fill
    x: Number,
    y: Number,
    fillColor: String,
    
    // For text
    text: String,
    fontSize: Number,
    
    // Common
    timestamp: { type: Date, default: Date.now }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient querying
strokeSchema.index({ roomId: 1, createdAt: 1 });

module.exports = mongoose.model("Stroke", strokeSchema);