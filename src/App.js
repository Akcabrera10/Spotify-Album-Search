import { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import AlbumGrid from './components/AlbumGrid';
import Welcome from './components/Welcome';
import axios from 'axios';


function App() {
  const [currentSongName, setCurrentSongName] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  useEffect(() => {
    axios.post('http://localhost:8000/key')
      .then((response) => {
        const data = response.data;
        setAccessToken(data.access_token);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);
  
  

async function search() {
  console.log('Search for ' + searchInput);

  try {
    const response = await axios.get(
      `http://localhost:8000/search/${searchInput}`
    );

    const albums = response.data.albums;
    setAlbums(albums);

    albums.forEach((album) => {
      setTracks(album.id);
    });

    setSearchPerformed(true);
  } catch (error) {
    console.error('Error:', error);
  }
}


  return (
    <div className="App">
    {!searchPerformed && <Welcome searchInput={searchInput} setSearchInput={setSearchInput}search={search} currentSongName={currentSongName}/>}
    <SearchBar searchInput={searchInput} setSearchInput={setSearchInput}search={search} setCurrentSongName={setCurrentSongName} currentSongName={currentSongName} />
    <AlbumGrid albums={albums} tracks = {tracks} accessToken = {accessToken}/>
    </div>
    );
}

export default App;
