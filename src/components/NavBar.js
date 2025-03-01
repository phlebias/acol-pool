import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import './NavBar.css';

function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/main" className="nav-link">Home</Link>
        {!isAuthenticated && <Link to="/login" className="nav-link">Admin Login</Link>}
      </div>
    </nav>
  );
}

export default NavBar;
