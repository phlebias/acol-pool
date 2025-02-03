import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="landing-title">Yer Actual Acol</h1>
      <img 
        src="/logo.png/Ace-of-Spades (1).png"  // This path will reference the file in your public folder
        alt="Acol Bridge Logo"
        className="landing-logo spin"
      />
      <button 
        className="btn landing-btn"
        onClick={() => navigate('/main')}
      >
        Enter
      </button>
    </div>
  );
}

export default LandingPage;
