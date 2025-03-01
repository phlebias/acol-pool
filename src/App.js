import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MainPage from './components/MainPage';
import ContentPage from './components/ContentPage';
import AdminPage from './components/AdminPage';
import NavBar from './components/NavBar';
import { auth } from './firebase'; // Ensure auth is imported
import { playButtonSound } from './utils/sound';

function App() {
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.tagName.toLowerCase() === 'button') {
        playButtonSound();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/content/:collection/:id" element={<ContentPage />} />
        <Route path="/login" element={<AdminPage />} />
        <Route path="/admin" element={
          <RequireAuth>
            <AdminPage />
          </RequireAuth>
        } />
      </Routes>
    </Router>
  );
}

function RequireAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default App;
