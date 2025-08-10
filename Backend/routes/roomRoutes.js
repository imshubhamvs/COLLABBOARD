const express = require('express');
const Room = require('../models/Room');
const User = require('../models/User');
const Stroke = require('../models/Stroke');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Create a new room
router.post('/create', auth, async (req, res) => {
  try {
    const { isPrivate = false } = req.body;
    const roomId = uuidv4().substring(0, 8).toUpperCase();

    const room = new Room({
      roomId,
      creator: req.user.id,
      isPrivate,
      allowedUsers: [req.user.id]
    });

    await room.save();
    res.status(201).json({ roomId, message: 'Room created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join a room
router.post('/join', auth, async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.id;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check access for private rooms
    if (room.isPrivate && !room.allowedUsers.includes(userId)) {
      return res.status(403).json({ message: 'Access denied to private room' });
    }

    // Add user to allowed users if not already present
    if (!room.allowedUsers.includes(userId)) {
      room.allowedUsers.push(userId);
      await room.save();
    }

    res.json({ message: 'Successfully joined room', roomId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's rooms
router.get('/my-rooms', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const rooms = await Room.find({
      allowedUsers: userId
    }).sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get room strokes (for canvas initialization)
router.get('/:roomId/strokes', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    // Check if user has access to room
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.isPrivate && !room.allowedUsers.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get strokes with simplified format for better performance
    const strokes = await Stroke.find({ roomId })
      .sort({ createdAt: 1 })
      .limit(1000) // Limit to prevent overload
      .select('type data userId createdAt');

    res.json(strokes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check room access
router.get('/:roomId/access', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const hasAccess = !room.isPrivate || room.allowedUsers.includes(userId);
    res.json({ hasAccess, isCreator: room.creator.toString() === userId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;