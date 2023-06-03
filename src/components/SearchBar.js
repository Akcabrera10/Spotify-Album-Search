import React, { useState, useEffect } from 'react';


function SearchBar({ searchInput, setSearchInput, search }) {

  const [fadeIn, setFadeIn] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => {
    setFadeIn(true);
  }, 2000);

  return () => {
    clearTimeout(timer);
  };
}, []);

  return (
    <>
    {fadeIn && (<div className="search-bar">
      <div className="logo">
        <img src="/icons/spotify.png" alt="Logo"/>
      </div>
      <h2 className="logoh2" onClick = {() => window.location.href ='/'}> Album Search </h2>
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
        <button className ="on" onClick={() => { if (searchInput) search(); }}>Search</button>
      </div>
    </div>
  )}
  </>
  );
}

export default SearchBar;
