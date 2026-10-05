import React from 'react';
export default function ClueTile({ clue, used, onSelect }) {
  if (!clue) return <div className="tile empty" aria-label="No clue at this value">—</div>;
  return <button className={`tile ${used ? 'used' : ''}`} disabled={used} onClick={() => onSelect(clue)} aria-label={`${clue.category}, ${clue.value} points${used ? ', played' : ''}`}>
    {used ? <><span className="played-check">✓</span><span className="played-label">PLAYED</span></> : clue.value.toLocaleString()}
  </button>;
}
