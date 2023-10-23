import { useEffect, useState } from "react";
import "../Playlista/Playlista.css";
import Track from "../Song/Song";

const Playlist = (props) => {
  const [playlistName, setPlaylistName] = useState("");
  const [token, setToken] = useState("");

  const REDIRECT_URI = "http://localhost:3000/callback";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES =
    "playlist-modify-private playlist-modify-public user-read-private";

  useEffect(() => {
    const expirationTime = localStorage.getItem("expirationTime");
    const hash = window.location.hash;
    if (expirationTime && parseInt(expirationTime) > Date.now()) {
      let token = window.localStorage.getItem("token");
      setToken(token);
    }

    if (hash) {
      let temp = hash;

      temp = temp.split("&");
      temp = temp[0];
      temp = temp.split("=");
      temp = temp[1];
      window.location.hash = "";
      window.localStorage.setItem("token", temp);
      window.localStorage.setItem("expirationTime", Date.now() + 3600000);
      setToken(temp);
    }
  }, []);

  const createPlaylist = async () => {
    if (playlistName.length > 3) {
      try {
        props.spotifyApi.setAccessToken(token);

        const resCreatePlaylist = await props.spotifyApi.createPlaylist(
          playlistName,
          {
            description: "utowrzona przez apkę",
            public: true,
          }
        );

        if (resCreatePlaylist.statusCode === 201) {
          const playlistId = resCreatePlaylist.body.id;

          const songUris = props.addedSongs.map((song) => song.uri);
          const resAddTracks = await props.spotifyApi.addTracksToPlaylist(
            playlistId,
            songUris
          );

          if (resAddTracks.statusCode === 201) {
            alert("Playlista pomyślnie utworzona.");
          } else {
            alert("Nie udało się utworzyć playlisty");
          }
        }
        console.log(resCreatePlaylist.body.id);
      } catch (error) {
        console.log(error);
        alert("Coś poszło nie tak");
      }
    } else {
      alert("Nazwa playlisty jest za krótka!");
    }
  };

  return (
    <div className="Playlist">
      <input
        placeholder="Playlist name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
      />
      <ul>
        {token ? (
          <button className="Playlist-save" onClick={createPlaylist}>
            SAVE TO SPOTIFY
          </button>
        ) : (
          <a
            className="logIn"
            href={`${AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_BASIC_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
          >
            Log in to create playlist
          </a>
        )}

        {props.addedSongs.map((e) => {
          return (
            <li key={e.id} className="hover">
              <Track song={e} deleteSong={props.deleteSong} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Playlist;
