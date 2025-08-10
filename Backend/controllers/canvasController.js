const Room = require('../models/Room');
const Stroke = require('../models/Stroke');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
// const renderStrokesToPNG = require('./renderToPNG');
const {
  addStroke,
  getAllStrokes,
  saveFullDrawing,
  clearStrokes,
  setRoomTimer,
  getRoomTimer,
  clearRoomTimer
} = require('./strokeService');


// Store active users in rooms
const roomUsers = {}; // roomId => Set of socket IDs

// Verify socket authentication
async function verifySocketAuth(socket) {
  try {
    const token = socket.handshake.auth.token;
    // console.log(socket);
    // console.log(socket.handshake.auth.token);
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const user = await User.findById(decoded.userId).select('-password');
    // console.log(user);
    return user;
  } catch (error) {
    return null;
  }
}

// Check room access
async function checkRoomAccess(userId, roomId) {
  const room = await Room.findOne({ roomId });
  if (!room) return { hasAccess: false, error: 'Room not found' };

  const hasAccess = !room.isPrivate || room.allowedUsers.includes(userId);
  return { hasAccess, room };
}

async function handleJoinRoom(io, socket, { roomId, token }) {
  try {
    // Verify user authentication
    const user = await verifySocketAuth(socket);
    // console.log(roomId,token);
    if (!user) {
      socket.emit('error', { message: 'Authentication required' });
      return;
    }

    // Check room access
    const { hasAccess, room, error } = await checkRoomAccess(user._id, roomId);
    console.log(hasAccess);
    if (!hasAccess) {
      socket.emit('error', { message: error || 'Access denied' });
      return;
    }

    // Add user to room
    socket.join(roomId);
    socket.userId = user._id;
    socket.roomId = roomId;

    // Track active users
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = new Set();
    }
    roomUsers[roomId].add(socket.id);
    // console.log(roomUsers);
    const prev_strokes = getAllStrokes(roomId);
    // console.log(prev_strokes);
    socket.emit('init-canvas-state', prev_strokes);

    const activeUsers = await getActiveRoomUsers(roomId);
    io.to(roomId).emit('users-updated', activeUsers);

  } catch (error) {
    console.error('Error in handleJoinRoom:', error);
    socket.emit('error', { message: 'Failed to join room' });
  }
}

async function handleSendStroke(io, socket, strokeData) {
  try {
    // console.log(strokeData);
    // console.log(strokeData);
    if (!socket.userId || !strokeData.roomId.roomId) {
      socket.emit('error', { message: 'Not authenticated or not in room' });
      return;
    }

    const roomId = strokeData.roomId.roomId;
    const stroke = strokeData.roomId.stroke;
    
    addStroke(roomId,stroke);

    // Trigger auto-save timer if not running
    // if (!getRoomTimer(socket.roomId)) {
    //   const timerId = setTimeout(() => saveSnapshotToDisk(socket.roomId), 5000); // 30s
    //   setRoomTimer(socket.roomId, timerId);
    // }

    // Broadcast to all other users in the room
    socket.to(roomId).emit('receive-stroke', stroke);

  } catch (error) {
    console.error('Error in handleSendStroke:', error);
    socket.emit('error', { message: 'Failed to send stroke' });
  }
}

// async function handleFillColor(io, socket, fillData) {
//   try {
//     if (!socket.userId || !socket.roomId) {
//       socket.emit('error', { message: 'Not authenticated or not in room' });
//       return;
//     }

//     const { x, y, color } = fillData;

//     // Create and save fill stroke
//     const stroke = new Stroke({
//       roomId: socket.roomId,
//       type: 'fill',
//       data: {
//         x,
//         y,
//         fillColor: color,
//         timestamp: new Date()
//       },
//       userId: socket.userId
//     });

//     // await stroke.save();
//     // await stroke.populate('userId', 'fullName');
//     addStrokeToMemory(socket.roomId, stroke);
// // trigger autosave timer as above
//     if (!getRoomTimer(socket.roomId)) {
//       const timerId = setTimeout(() => saveSnapshotToDisk(socket.roomId), 5000); // 30s
//       setRoomTimer(socket.roomId, timerId);
//     }

//     // Broadcast fill action to all other users in the room
//     socket.to(socket.roomId).emit('receive-fill', { x, y, color, stroke });

//   } catch (error) {
//     console.error('Error in handleFillColor:', error);
//     socket.emit('error', { message: 'Failed to fill color' });
//   }
// }

async function handleClearCanvas(io, socket) {
  try {
    if (!socket.userId || !strokeData.roomId.roomId) {
      socket.emit('error', { message: 'Not authenticated or not in room' });
      return;
    }

    const roomId = strokeData.roomId.roomId;

    // Create clear stroke
    clearStrokes(roomId);
    

    // Broadcast clear to all users in the room
    io.to(socket.roomId).emit('canvas-cleared');

  } catch (error) {
    console.error('Error in handleClearCanvas:', error);
    socket.emit('error', { message: 'Failed to clear canvas' });
  }
}

// async function handleAddText(io, socket, textData) {
//   try {
//     if (!socket.userId || !socket.roomId) {
//       socket.emit('error', { message: 'Not authenticated or not in room' });
//       return;
//     }

//     const { text, x, y, color, fontSize } = textData;

//     // Create and save text stroke
//     const stroke = new Stroke({
//       roomId: socket.roomId,
//       type: 'text',
//       data: {
//         text,
//         x,
//         y,
//         color,
//         fontSize,
//         timestamp: new Date()
//       },
//       userId: socket.userId
//     });

//     await stroke.save();
//     await stroke.populate('userId', 'fullName');

//     // Broadcast to all other users in the room
//     socket.to(socket.roomId).emit('receive-text', stroke);

//   } catch (error) {
//     console.error('Error in handleAddText:', error);
//     socket.emit('error', { message: 'Failed to add text' });
//   }
// }

async function handleDisconnect(socket) {
  try {
    if (socket.roomId && roomUsers[socket.roomId]) {
      roomUsers[socket.roomId].delete(socket.id);
      
      // Clean up empty room
      if (roomUsers[socket.roomId].size === 0) {
        delete roomUsers[socket.roomId];
      } else {
        // Update active users for remaining users
        const activeUsers = await getActiveRoomUsers(socket.roomId);
        socket.to(socket.roomId).emit('users-updated', activeUsers);
      }
    }

    console.log(`User disconnected: ${socket.id}`);
  } catch (error) {
    console.error('Error in handleDisconnect:', error);
  }
}


// Helper function to get active users in a room
async function getActiveRoomUsers(roomId) {
  const socketIds = roomUsers[roomId] || new Set();
  return Array.from(socketIds).length; // Just return count for now
}

async function saveSnapshotToDisk(io,socket,roomId) {
  console.log(roomId);
  saveFullDrawing(roomId);
}

module.exports = {
  handleJoinRoom,
  handleSendStroke,
  // handleFillColor,
  handleClearCanvas,
  // handleAddText,
  handleDisconnect,
  verifySocketAuth,
  saveSnapshotToDisk
};

