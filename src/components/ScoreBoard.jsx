import React from 'react';
export default function ScoreBoard({ teams, onReset }) {
  return <section className="scores-section" aria-label="Team scores"><div className="section-label"><span>THE SCOREBOARD</span><button className="text-button" onClick={onReset}>Reset Scores</button></div>
    <div className="scores">{teams.map(({ name, score }, index) => <div className={`score-card team-${index % 3}`} key={index}><div className="team-name"><span className="team-dot" />{name}</div><div className="score" aria-live="polite">{score.toLocaleString()}<span>PTS</span></div></div>)}</div>
  </section>;
}
