import React, { useState } from "react";

import "./SearchTab.css";

const SearchTab = (props) => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="SearchTab">
      <input
        placeholder="Artist, song title or album"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button
        className="SearchButton"
        onClick={() => props.searchSongs(searchInput)}
      >
        SEARCH
      </button>
    </div>
  );
};

export default SearchTab;
