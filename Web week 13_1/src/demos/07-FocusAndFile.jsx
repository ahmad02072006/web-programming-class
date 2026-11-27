import React, { useRef, useState, useEffect } from 'react';

export default function FocusAndFile() {
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const [info, setInfo] = useState(null);

  // Cmd/Ctrl+K focuses the search box through the ref
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); handleFocus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleFocus = () => {
    inputRef.current.focus();      // focus the DOM element
    inputRef.current.select();     // also select existing text
  };
  // File inputs MUST use useRef (cannot be controlled)
  const handleUpload = () => {
    const file = fileRef.current.files[0];
    setInfo(file ? { name: file.name, size: file.size, type: file.type || 'unknown' } : null);
  };

  return (
    <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
      <div className="card stack">
        <div className="eyebrow">focus management</div>
        <input ref={inputRef} type="text" defaultValue="select me" aria-label="Search" />
        <button className="btn sm" onClick={handleFocus}>Focus Search (Ctrl/Cmd+K)</button>
      </div>
      <div className="card stack">
        <div className="eyebrow">file input</div>
        <input type="file" ref={fileRef} onChange={handleUpload} aria-label="Choose a file" />
        {info && <pre className="console">{JSON.stringify(info, null, 2)}</pre>}
      </div>
    </div>
  );
}
