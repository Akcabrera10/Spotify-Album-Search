import React from 'react';
import './Welcome.css';

function Welcome({searchInput, setSearchInput, search}) {
  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <h1 className="welcome-text">Welcome to Spotify Album Search!</h1>
        <p className ="ptext">To get started, type an artist name and click "Search", it will display the artist's albums currently available on spotify.</p>
        <div className="search-container">
        <input className = "search-input"
          placeholder="Search for Artist"
          type="input"
          onKeyPress={(event) => {
            if (event.key === 'Enter' && searchInput !== '') {
              search();
            }
          }}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <button onClick={() => { if (searchInput) search(); }}>Search</button>
      </div>
      </div>
      
    </div>
  );
}

export default Welcome;
