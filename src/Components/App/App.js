import React, { useState, useEffect } from "react";
import "./App.css";

import SearchTab from "../SearchTab/SearchTab";
import Results from "../Results/Results";
import Playlist from "../Playlista/Playlista";
import SpotifyWebApi from "spotify-web-api-node";

function App() {
  // const fakeSongs = [
  //   {
  //     name: "test",
  //     artist: "Example track artist",
  //     album: "Example track Album",
  //     id: 1,
  //   },
  //   {
  //     name: "kuba",
  //     artist: "Example track artist2",
  //     album: "Example track Album2",
  //     id: 2,
  //   },
  //   {
  //     name: "asd",
  //     artist: "Kuba",
  //     album: "Example track Album3",
  //     id: 3,
  //   },
  //   {
  //     name: "example track name4",
  //     artist: "Example track artist4",
  //     album: "Example track Album4",
  //     id: 4,
  //   },
  //   {
  //     name: "example",
  //     artist: "Example ",
  //     album: "Example track Album4",
  //     id: 5,
  //   },
  // ];

  const [searchResults, setSearchResults] = useState([]);
  const [addedSongs, setAddedSongs] = useState([]);

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.REACT_APP_BASIC_CLIENT_ID,
    clientSecret: process.env.REACT_APP_BASIC_CLIENT_SECRET,
  });

  const filter = (searchValue) => {
    if (searchValue.length > 0) {
      const results = searchResults.filter((song) =>
        song.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      console.log(results);
      setSearchResults(results);
    }
  };

  const addSong = (id) => {
    const clickedSong = searchResults.find((song) => song.id === id);
    console.log(clickedSong);
    setAddedSongs((prevState) => [...prevState, clickedSong]);
    // setSearchResults((prevState) => prevState.filter((song) => song.id !== id));
  };

  const deleteSong = (id) => {
    setAddedSongs((prev) => prev.filter((el) => el.id !== id));
  };

  const searchSongs = async (searchValue) => {
    try {
      const resToken = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body:
          "grant_type=client_credentials&client_id=" +
          process.env.REACT_APP_BASIC_CLIENT_ID +
          "&client_secret=" +
          process.env.REACT_APP_BASIC_CLIENT_SECRET,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const resJson = await resToken.json();

      if (resToken.status === 200) {
        spotifyApi.setAccessToken(resJson.access_token);

        if (searchValue.length >= 3) {
          const resTracks = await spotifyApi.searchTracks(searchValue, {
            limit: 50,
          });
          console.log(resTracks);

          if (resTracks.statusCode === 200) {
            const mappedTracks = resTracks.body.tracks.items.map((track) => ({
              id: track.id,
              name: track.name,
              artist: track.artists.map((artist) => artist.name).join(", "),
              album: track.album.name,
              uri: track.uri,
            }));

            setSearchResults(mappedTracks);
          }
        }
      }
    } catch (error) {
      alert("Error! " + error.message);
    }
  };
  //test
  return (
    <div>
      <div className="navbar">
        <h1>
          Play<span className="highlight">list</span>ify
        </h1>
      </div>

      <div className="Apka">
        <div className="center">
          <SearchTab searchSongs={searchSongs} />
        </div>
        <div className="App-playlist">
          <Results
            searchResults={searchResults}
            deleteSong={deleteSong}
            addSong={addSong}
          />
          <Playlist
            spotifyApi={spotifyApi}
            deleteSong={deleteSong}
            addedSongs={addedSongs}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
