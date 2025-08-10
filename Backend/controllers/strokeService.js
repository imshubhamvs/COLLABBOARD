const { MAX_MEMORY_STROKES } = require('../config/constants');
const { saveStrokesToDisk, loadStrokesFromDisk } = require('../utils/fileUtils');

const roomStrokes = {}; // roomId => { memory: [], totalCount }
const roomTimers = new Map();

function initRoom(roomId) {
  if (!roomStrokes[roomId]) {
    const diskStrokes = loadStrokesFromDisk(roomId);
    roomStrokes[roomId] = {
      memory: [],
      totalCount: diskStrokes.length,
    };
  }
}

function addStroke(roomId, stroke) {
  initRoom(roomId);

  const room = roomStrokes[roomId];
  room.memory.push(stroke);

  if (room.memory.length > MAX_MEMORY_STROKES) {
    const toSave = room.memory.splice(0, room.memory.length - MAX_MEMORY_STROKES);
    const prev = loadStrokesFromDisk(roomId);
    saveStrokesToDisk(roomId, [...prev, ...toSave]);
    room.totalCount += toSave.length;
  }
}

function getAllStrokes(roomId) {
  initRoom(roomId);
  const disk = loadStrokesFromDisk(roomId);
  return [...disk, ...roomStrokes[roomId].memory];
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

function saveFullDrawing(roomId) {
    console.log("save_draw",roomId);
  const full = getAllStrokes(roomId);
  saveStrokesToDisk(roomId, full);
}

module.exports = {
  addStroke,
  getAllStrokes,
  saveFullDrawing,
  clearStrokes,
  setRoomTimer,
  getRoomTimer,
  clearRoomTimer
};
