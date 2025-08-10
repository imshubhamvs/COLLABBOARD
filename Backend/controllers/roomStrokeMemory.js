// utils/roomStrokeMemory.js
const roomStrokes = new Map();  // roomId -> strokes[]
const roomTimers = new Map();   // roomId -> timeoutID

function addStrokeToMemory(roomId, stroke) {
  if (!roomStrokes.has(roomId)) {
    roomStrokes.set(roomId, []);
  }
  roomStrokes.get(roomId).push(stroke);
}

function getStrokes(roomId) {
  return roomStrokes.get(roomId) || [];
}

function clearStrokes(roomId) {
  roomStrokes.delete(roomId);
}

function setRoomTimer(roomId, timerId) {
  roomTimers.set(roomId, timerId);
}

function getRoomTimer(roomId) {
  return roomTimers.get(roomId);
}

function clearRoomTimer(roomId) {
  const timer = roomTimers.get(roomId);
  if (timer) clearTimeout(timer);
  roomTimers.delete(roomId);
}

module.exports = {
  addStrokeToMemory,
  getStrokes,
  clearStrokes,
  setRoomTimer,
  getRoomTimer,
  clearRoomTimer
};
