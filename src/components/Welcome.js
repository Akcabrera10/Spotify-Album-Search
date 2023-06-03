import React, { useState, useEffect } from 'react';
import './Welcome.css';

function Welcome({ searchInput, setSearchInput, search }) {
  const [fadeIn, setFadeIn] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 500);

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <div className={`welcome-container ${fadeIn ? 'fade-in' : ''}`}>
      <div className={`welcome-box ${fadeIn ? 'fade-in' : ''}`}>
        <h1 className={`welcome-text ${fadeIn ? 'fade-in' : ''}`}>Spotify Album Search</h1>
        {showText && (
          <>
            <p className={`ptext ${fadeIn ? 'fade-in' : ''}`}>Who do you want to listen to?</p>
            <div className={`search-container1 ${fadeIn ? 'fade-in' : ''}`}>
              <input
                className="search-input"
                placeholder="Search for Artist"
                type="input"
                onKeyPress={(event) => {
                  if (event.key === 'Enter' && searchInput !== '') {
                    search();
                  }
                }}
                onChange={(event) => setSearchInput(event.target.value)}
              />
              <button
                className="button on"
                onClick={() => {
                  if (searchInput) search();
                }}
              >
                Search
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Welcome;
