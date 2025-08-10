import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Router, Route } from './components/Router';
import { RootRoute, RoomRoute } from './components/Routes';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Main App Component
const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL when path changes
  useEffect(() => {
    if (window.location.pathname !== currentPath) {
      window.history.pushState({}, '', currentPath);
    }
  }, [currentPath]);

  return (
    <AuthProvider>
      <Router currentPath={currentPath} setCurrentPath={setCurrentPath}>
        <Route path="/" component={RootRoute} />
        <Route path="/login" component={Login} />
        <Route 
          path="/dashboard" 
          component={ProtectedRoute}
          innerComponent={Dashboard}
        />
        <Route 
          path="/room/:roomId" 
          component={RoomRoute}
        />
      </Router>
    </AuthProvider>
  );
};

export default App;