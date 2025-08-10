// socket/socketHandler.js
const Room = require('../models/Room');
const {
  handleJoinRoom,
  handleSendStroke,
  handleFillColor,
  handleClearCanvas,
  handleAddText,
  handleDisconnect,
} = require('../controllers/canvasController');
// In-memory storage for room states
// const roomStates = new Map();
// const connectedUsers = new Map();

// // Simplify.js algorithm implementation
// function simplifyPoints(points, tolerance = 2) {
//   if (points.length <= 2) return points;
  
//   function getSqDist(p1, p2) {
//     const dx = p1.x - p2.x;
//     const dy = p1.y - p2.y;
//     return dx * dx + dy * dy;
//   }
  
//   function getSqSegDist(p, p1, p2) {
//     let x = p1.x, y = p1.y;
//     let dx = p2.x - x, dy = p2.y - y;
    
//     if (dx !== 0 || dy !== 0) {
//       const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
//       if (t > 1) {
//         x = p2.x;
//         y = p2.y;
//       } else if (t > 0) {
//         x += dx * t;
//         y += dy * t;
//       }
//     }
    
//     dx = p.x - x;
//     dy = p.y - y;
//     return dx * dx + dy * dy;
//   }
  
//   function simplifyDPStep(points, first, last, sqTolerance, simplified) {
//     let maxSqDist = sqTolerance;
//     let index = 0;
    
//     for (let i = first + 1; i < last; i++) {
//       const sqDist = getSqSegDist(points[i], points[first], points[last]);
//       if (sqDist > maxSqDist) {
//         index = i;
//         maxSqDist = sqDist;
//       }
//     }
    
//     if (maxSqDist > sqTolerance) {
//       if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
//       simplified.push(points[index]);
//       if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
//     }
//   }
  
//   const last = points.length - 1;
//   const simplified = [points[0]];
//   simplifyDPStep(points, 0, last, tolerance * tolerance, simplified);
//   simplified.push(points[last]);
  
//   return simplified;
// }

function socketHandler(io) {
  io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Room management
  socket.on('join-room', (data) => handleJoinRoom(io, socket, data));

  // Drawing events
  socket.on('send-stroke', (data) => handleSendStroke(io, socket, data));
  socket.on('fill-color', (data) => handleFillColor(io, socket, data));
  socket.on('clear-canvas', () => handleClearCanvas(io, socket));
  socket.on('add-text', (data) => handleAddText(io, socket, data));

  // Disconnect handling
  socket.on('disconnect', () => handleDisconnect(socket));
});
}

module.exports = socketHandler;