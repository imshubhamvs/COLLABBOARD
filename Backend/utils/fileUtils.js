const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { STORAGE_DIR } = require('../config/constants');

if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR);

function getRoomFilePath(roomId) {
  return path.join(STORAGE_DIR, `${roomId}.json.gz`);
}

function saveStrokesToDisk(roomId, strokes) {
  
  const filePath = getRoomFilePath(roomId);
  // console.log(filePath);
  const buffer = Buffer.from(JSON.stringify(strokes), 'utf-8');
  const compressed = zlib.gzipSync(buffer);
  fs.writeFileSync(filePath, compressed);
}

function loadStrokesFromDisk(roomId) {
  const filePath = getRoomFilePath(roomId);
  if (!fs.existsSync(filePath)) return [];
  const compressed = fs.readFileSync(filePath);
  const decompressed = zlib.gunzipSync(compressed);
  // console.log(JSON.parse(decompressed.toString()));
  return JSON.parse(decompressed.toString());
}

module.exports = {
  saveStrokesToDisk,
  loadStrokesFromDisk,
};
