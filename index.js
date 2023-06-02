const PORT = 8000;
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
let accessToken;
const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.json('hi');
});

app.post('/key', (req, res) => {
  let authParameters = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data:
      'grant_type=client_credentials&client_id=' +
      process.env.REACT_APP_CLIENT_ID +
      '&client_secret=' +
      process.env.REACT_APP_CLIENT_SECRET,
    url: 'https://accounts.spotify.com/api/token',
  };

  axios(authParameters)
    .then((response) => {
      const data = response.data;
      accessToken=data.access_token;
      res.json({ access_token: data.access_token });
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/search/:searchInput', (req, res) => {
  const { searchInput } = req.params;

  let searchParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    },
  };

  fetch(
    'https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist',
    searchParameters
  )
    .then((response) => response.json())
    .then((data) => {
      const artistID = data.artists.items[0].id;
      fetch(
        'https://api.spotify.com/v1/artists/' +
          artistID +
          '/albums' +
          '?include_groups=album&market=US&limit=50',
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => {
          res.json({ albums: data.items });
        })
        .catch((error) => {
          console.error('Error:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/album-tracks/:albumId', (req, res) => {
    const { albumId } = req.params;
  
    let searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    };
  
    fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, searchParameters)
      .then((response) => response.json())
      .then((data) => {
        res.json({ tracks: data.items });
      })
      .catch((error) => {
        console.error('Error fetching album tracks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
  

app.listen(PORT, () => console.log('Server is running on port', PORT));
