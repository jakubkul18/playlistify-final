import React from "react";
import Track from "../Song/Song";

import "./Results.css";

const Results = (props) => {
  return (
    <div className="Results">
      <h2>Results</h2>
      <ul>
        {props.searchResults.map((e) => {
          return (
            <li key={e.id} className="hover">
              <Track addSong={props.addSong} song={e} />{" "}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Results;
