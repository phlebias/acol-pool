import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MainPage from './components/MainPage';
import ContentPage from './components/ContentPage';
import NavBar from './components/NavBar';
import adminRoutes from './adminRoutes';
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
        {adminRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
