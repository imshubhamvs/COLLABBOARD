import React from 'react';

// Simple Router Implementation
const Router = ({ children, currentPath, setCurrentPath }) => {
  const routes = React.Children.toArray(children);
  
  const navigate = (path) => {
    setCurrentPath(path);
  };

  // Provide navigate function to child components
  return (
    <div>
      {React.Children.map(routes, child => 
        React.cloneElement(child, { currentPath, navigate })
      )}
    </div>
  );
};

const Route = ({ path, component: Component, currentPath, navigate, ...props }) => {
  if (currentPath === path || (path.includes(':') && currentPath.startsWith(path.split(':')[0]))) {
    // Extract roomId from path if it's a room route
    const roomId = path.includes(':roomId') ? currentPath.split('room/')[1] : null;
    return <Component navigate={navigate} roomId={roomId} {...props} />;
  }
  return null;
};

export { Router, Route };