import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from './Dashboard';
import Login from './Login';
import DrawingRoom from './DrawingRoom';

const RootRoute = ({ navigate }) => {
  const { user } = useAuth();
  return user ? <Dashboard navigate={navigate} /> : <Login navigate={navigate} />;
};

const RoomRoute = ({ navigate, currentPath }) => {
  const { user, loading } = useAuth();
  // Wait until auth has finished loading
  console.log(loading);
  while (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // console.log(currentPath)

  if (!user) {
    return <Login navigate={navigate} />;
  }

  // Extract roomId from URL
  const roomId = window.location.pathname.split('/room/')[1];
  // console.log(roomId);

  // if (!roomId) {
  //   return <div className="text-center text-red-600">Room not found</div>;
  // }

  return <DrawingRoom roomId={roomId} navigate={navigate} />;
};

export { RootRoute, RoomRoute };