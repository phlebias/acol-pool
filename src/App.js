import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MainPage from './components/MainPage';
import ContentPage from './components/ContentPage';
import AdminPage from './components/AdminPage';

function App() {
  // Check if admin features are enabled based on the environment variable
  const isAdmin = process.env.REACT_APP_IS_ADMIN === "true";

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/content/:collection/:id" element={<ContentPage />} />

        {/* Admin route - restricted based on isAdmin */}
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminPage />
            ) : (
              <Navigate to="/" replace /> // Redirect to home if not admin
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

