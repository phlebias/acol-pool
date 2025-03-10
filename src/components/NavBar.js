import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { playButtonSound } from '../utils/sound';
import './NavBar.css';

function NavBar({ user, isAdmin }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    playButtonSound();
    try {
      await signOut(auth);
      navigate('/main');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/main" className="nav-link" onClick={() => playButtonSound()}>Home</Link>
        {!user && (
          <Link to="/login" className="nav-link" onClick={() => playButtonSound()}>Admin Login</Link>
        )}
        {isAdmin && (
          <Link to="/admin" className="nav-link" onClick={() => playButtonSound()}>Admin Panel</Link>
        )}
        {user && (
          <button onClick={handleLogout} className="nav-link logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
