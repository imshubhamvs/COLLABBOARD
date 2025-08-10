// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/roomRoutes');

const {
  handleJoinRoom,
  handleSendStroke,
  // handleFillColor,
  handleClearCanvas,
  // handleAddText,
  handleDisconnect,
  saveSnapshotToDisk
} = require('./controllers/canvasController');
// const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/collaborative-drawing', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const User = require('./models/User');
    const user = await User.findById(decoded.userId);
    socket.userId = user._id;
    socket.userInfo = { id: user._id, fullName: user.fullName, email: user.email };
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket handling
// socketHandler(io);

io.on('connection', (socket) => {
  // console.log('User connected:', socket.id);

  // Room management
  socket.on('join-room', (data) => handleJoinRoom(io, socket, data));

  // Drawing events
  socket.on('send-stroke', (data) => handleSendStroke(io, socket, data));
  // socket.on('fill-color', (data) => handleFillColor(io, socket, data));
  socket.on('clear-canvas', () => handleClearCanvas(io, socket));
  // socket.on('add-text', (data) => handleAddText(io, socket, data));

  socket.on('save-drawing',(data)=>saveSnapshotToDisk(io,socket,data));
  // Disconnect handling
  socket.on('disconnect', () => handleDisconnect(socket));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});