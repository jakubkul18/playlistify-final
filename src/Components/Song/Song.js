import React, { useCallback } from "react";

import "./Song.css";

const Track = (props) => {
  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{props.song.name}</h3>
        <p>
          {props.song.artist} | {props.song.album}
        </p>
      </div>
      {props.addSong && (
        <button
          onClick={() => props.addSong(props.song.id)}
          className="reset-button"
        >
          +
        </button>
      )}
      {props.deleteSong && (
        <button
          onClick={() => props.deleteSong(props.song.id)}
          className="reset-button"
        >
          -
        </button>
      )}
    </div>
  );
};

export default Track;
