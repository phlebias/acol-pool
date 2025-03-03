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

  // For debugging
  console.log('REACT_APP_DISABLE_ADMIN:', process.env.REACT_APP_DISABLE_ADMIN);
  console.log('NODE_ENV:', process.env.NODE_ENV);

  // Only show admin if we're not explicitly disabling it
  const showAdmin = process.env.REACT_APP_DISABLE_ADMIN !== 'true';

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/main" className="nav-link">Home</Link>
        {!isAuthenticated && showAdmin && (
          <Link to="/login" className="nav-link">Admin Login</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
