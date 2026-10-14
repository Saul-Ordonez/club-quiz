import React, { useEffect, useRef } from 'react';

export default function ResultsModal({ teams, onClose, onReset }) {
  const dialog = useRef(null);
  // Sort a copy so scoreboard order stays unchanged. Negative scores are valid.
  const standings = teams.map((team, index) => ({ ...team, id: index }))
    .sort((a, b) => b.score - a.score);
  const winners = standings.filter(team => team.score === standings[0].score);

  useEffect(() => {
    const previous = document.activeElement;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);

  return <dialog ref={dialog} className="clue-modal results-modal" aria-labelledby="results-title"
    onCancel={event => { event.preventDefault(); onClose(); }}>
    <p className="results-label">FINAL RESULTS</p>
    <h2 id="results-title">{winners.length > 1 ? 'A tie for first place!' : `${winners[0].name} wins!`}</h2>
    <p className="results-summary">{winners.length > 1 && `${winners.map(team => team.name).join(' · ')} — `}{standings[0].score.toLocaleString()} points</p>
    <ol className="results-list" aria-label="Final team standings">
      {standings.map(team => {
        const rank = standings.findIndex(other => other.score === team.score) + 1;
        return <li key={team.id} className={rank === 1 ? 'result-winner' : ''}>
          <span className="result-rank">{rank}</span>
          <span className="result-name">{team.name}</span>
          <strong>{team.score.toLocaleString()} <small>PTS</small></strong>
        </li>;
      })}
    </ol>
    <div className="modal-footer">
      <button className="secondary" onClick={onClose}>Back to Board</button>
      <button className="primary" onClick={onReset}>New Game</button>
    </div>
  </dialog>;
}
