import React, { useState } from 'react';

function SearchBar() {
  const [query, setQuery] = useState('');
  return (
    <div className="stack">
      <div className="row" style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" maxLength={100} aria-label="Search" />
        <button className="btn" style={{ flex: 'none' }} onClick={() => setQuery('')}>Clear</button>
      </div>
      <p>Searching for: <b style={{ color: 'var(--cyan)' }}>“{query}”</b></p>
      <span className="count">{query.length} / 100 characters</span>
    </div>
  );
}
export default SearchBar;
