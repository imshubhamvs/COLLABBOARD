import { io } from 'socket.io-client';


class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }
    // console.log(token);

    this.socket = io('http://localhost:5000', {
      
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinRoom(roomId, token) {
    if (this.socket) {
      // console.log(roomId);
      this.socket.emit('join-room', { roomId, token });
    }
  }

  sendStroke(roomId, stroke ) {
    if (this.socket && this.isConnected) {
      // this.socket.emit('fill-color', fillData);
      this.socket.emit('send-stroke', { roomId, stroke });
    }
  }

  sendFill({roomId, fillStroke}) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send-stroke', { roomId, stroke: fillStroke });
    }
  }

  sendText(textData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('add-text', textData);
    }
  }

  clearCanvas() {
    if (this.socket && this.isConnected) {
      this.socket.emit('clear-canvas');
    }
  }
  
  

  onInitCanvasState(callback) {
    if (this.socket) {
      this.socket.on('init-canvas-state', callback);
    }
  }

  onReceiveStroke(callback) {
    if (this.socket) {
      this.socket.on('receive-stroke', callback);
    }
  }

  onReceiveFill(callback) {
    if (this.socket) {
      this.socket.on('receive-fill', callback);
    }
  }

  onSaveFile(roomId)
  {
    if(this.socket)
    {
      this.socket.emit('save-drawing',roomId);
    }
  }

  onReceiveText(callback) {
    if (this.socket) {
      this.socket.on('receive-text', callback);
    }
  }

  onCanvasCleared(callback) {
    if (this.socket) {
      this.socket.on('canvas-cleared', callback);
    }
  }

  onUsersUpdated(callback) {
    if (this.socket) {
      this.socket.on('users-updated', callback);
    }
  }

  offAllListeners() {
    if (this.socket) {
      this.socket.off('init-canvas-state');
      this.socket.off('receive-stroke');
      this.socket.off('receive-fill');
      this.socket.off('receive-text');
      this.socket.off('canvas-cleared');
      this.socket.off('users-updated');
    }
  }
}

const Socketserv =  new SocketService();
export default Socketserv;
