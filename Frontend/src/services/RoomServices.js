const API_BASE_URL = 'http://localhost:5000';

export const roomService = {
  async getMyRooms(token) {
    const response = await fetch(`${API_BASE_URL}/api/rooms/my-rooms`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }
    
    return response.json();
  },

  async createRoom(token, isPrivate) {
    const response = await fetch(`${API_BASE_URL}/api/rooms/create`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ isPrivate })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create room');
    }
    
    return response.json();
  },

  async joinRoom(token, roomId) {
    const response = await fetch(`${API_BASE_URL}/api/rooms/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ roomId })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to join room');
    }
    
    return data;
  }
};