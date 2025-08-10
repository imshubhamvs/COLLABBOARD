const API_BASE_URL = 'http://localhost:5000';

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  },

  verify: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Token invalid');
    }
    
    return response.json();
  }
};

// Room API calls
export const roomAPI = {
  getMyRooms: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/rooms/my-rooms`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch rooms');
    }
    
    return data;
  },

  createRoom: async (token, isPrivate) => {
    const response = await fetch(`${API_BASE_URL}/api/rooms/create`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ isPrivate })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create room');
    }
    
    return data;
  },

  joinRoom: async (token, roomId) => {
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
  },

  checkRoomAccess: async (token, roomId) => {
    const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/access`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check room access');
    }
    
    return data;
  },

  getRoomStrokes: async (token, roomId) => {
    const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/strokes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch room strokes');
    }
    
    return data;
  }
};