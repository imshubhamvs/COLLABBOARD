// routes/rooms.js
const express = require('express');
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Create room
router.post('/create', auth, async (req, res) => {
  try {
    const { isPrivate } = req.body;
    const roomId = uuidv4();
    console.log(req.user._id);
    const room = new Room({  
      roomId,
      creator: req.user._id,
      isPrivate: isPrivate || false,
      allowedUsers: [req.user._id]
    });
    
    await room.save();
    res.status(201).json({ roomId, isPrivate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join room
router.post('/join', auth, async (req, res) => {
  try {
    const { roomId } = req.body;
    
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (room.isPrivate && !room.allowedUsers.includes(req.userId)) {
      return res.status(403).json({ message: 'Access denied to private room' });
    }
    
    if (!room.allowedUsers.includes(req.userId)) {
      room.allowedUsers.push(req.userId);
      await room.save();
    }
    
    res.json({ message: 'Joined room successfully', roomId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user rooms
router.get('/my-rooms', auth, async (req, res) => {
  try {
    const rooms = await Room.find({
      allowedUsers: req.user._id
    }).populate('creator', 'fullName email');
    
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;