import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfitDashboard from './pages/ProfitDashboard';
import ProfileDashboard from './pages/Profile';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    // Overwrite default anchor link actions for in-app navigation
    const handleLinkClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        window.history.pushState({}, '', href);
        setCurrentPath(href);
      }
    };
    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  useEffect(() => {
    const authPaths = ['/dashboard', '/admin', '/profile'];
    if (authPaths.includes(currentPath)) {
      const user = localStorage.getItem('parksense_user');
      if (!user) {
        window.history.pushState({}, '', '/login');
        setCurrentPath('/login');
      }
    }
  }, [currentPath]);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  return (
    <>
      {currentPath === '/login' && <Login navigate={navigate} />}
      {currentPath === '/dashboard' && <Dashboard navigate={navigate} />}
      {currentPath === '/admin' && <ProfitDashboard navigate={navigate} />}
      {currentPath === '/profile' && <ProfileDashboard navigate={navigate} />}
      {currentPath !== '/login' && currentPath !== '/dashboard' && currentPath !== '/admin' && currentPath !== '/profile' && (
        <Landing navigate={navigate} />
      )}
    </>
  );
}
