import {useState, useEffect} from 'react';
import axios from 'axios';
function AlbumGrid({ albums, tracks, accessToken }) {

  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [imageColor, setImageColor] = useState('');


  useEffect(() => {
    if (selectedAlbum) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = selectedAlbum.images[0].url;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, img.width, img.height).data;
        const color = getDominantColor(imageData);
        setImageColor(color);
      };
    }
  }, [selectedAlbum]);
  const getDominantColor = (imageData) => {
  // This function gets the first pixel of the image to use as the background for the album.
    const r = imageData[0];
    const g = imageData[1];
    const b = imageData[2];
    return `rgb(${r}, ${g}, ${b})`;
  };

  const formatTrackDuration = (durationMs) => {
    const minutes = Math.floor(durationMs / 60000); // Divide by 60000 to get minutes
    const seconds = Math.floor((durationMs % 60000) / 1000); // Get the remaining seconds
  
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Format the time as "M:SS"
  };

  const handlePreviewPlay = (previewUrl, spotifyUrl) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    setCurrentPreview(previewUrl);

    if (previewUrl) {
      const audio = new Audio(previewUrl);
      setCurrentAudio(audio);
      audio.play();
    } else {
      window.open(spotifyUrl, '_blank');
    }
  };


  const handleAlbumClick = async (album) => {
    setSelectedAlbum(album);
    try {
      const response = await axios.get(
        `http://localhost:8000/album-tracks/${album.id}`
      );
      const data = response.data;
      console.log(data.tracks);
      setAlbumTracks(data.tracks);
    } catch (error) {
      console.error('Error fetching album tracks:', error);
    }
  };
  
  let temp;

  return (
    <div className="albums">
      {albums.map((album, i) => {
        if (album.name === temp) {
          return null;
        }
        temp = album.name;
        if (i % 4 === 0) {
          return (
            <div className="row" key={album.id}>
              <div className="column" onClick={() => handleAlbumClick(album)}>
                <img src={album.images[0].url} alt={album.name} />
                <div className="card-title">{album.name}</div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="column" key={album.id} onClick={() => handleAlbumClick(album)}>
              <img src={album.images[0].url} alt={album.name} />
              <div className="card-title">{album.name}</div>
            </div>
          );
        }
      })}
      {selectedAlbum && (
        <div className={`popup${selectedAlbum ? ' show' : ''}`}>
        <div className="popup-info" style={{ backgroundColor: imageColor }}>
          <div className="popup-image-container">
          <div className="previous-button">
          <button className="round-button" onClick={() => setSelectedAlbum(null)}>
            <span>&lt;</span>
          </button>`
        </div>
            <img className="popup-image" src={selectedAlbum.images[0].url} alt={selectedAlbum.name} />
          </div>
          
          <div className="popup-text">
            <div className="popup-title">{selectedAlbum.name}</div>
            <div className="popup-content">Total tracks: {selectedAlbum.total_tracks}</div>
          </div>
        </div>
        <div className = "popup-track">
        <span className="track-name">&nbsp;&nbsp;Title</span>
        <span className="track-artists">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Artist</span>
        <span className="track-duration">Duration</span>
        </div>

        <div className="popup-tracks-container">
    {albumTracks.map((track, index) => (
      <div key={track.id} className="popup-track">
        <span className="track-number">{index + 1}.</span>
        <span className="track-name" onClick={() => handlePreviewPlay(track.preview_url, track.external_urls.spotify)}>{track.name}</span>
        <span className="track-artists">{track.artists[0].name}</span>
        <span className="track-duration">{formatTrackDuration(track.duration_ms)}</span>
      </div>
    ))}
  </div>

  <button className="bbutton" onClick={() => setSelectedAlbum(null)}>Close</button>
</div>
     
      )}
    </div>
  );
}

export default AlbumGrid;
