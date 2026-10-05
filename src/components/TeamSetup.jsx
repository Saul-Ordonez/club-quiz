import React, { useState } from 'react';

export default function TeamSetup({ initialNames, onStart }) {
  const [names, setNames] = useState(initialNames);

  function startGame(event) {
    event.preventDefault();
    onStart(names.map((name, index) => name.trim() || `Team ${index + 1}`));
  }

  return <section className="team-setup" aria-labelledby="setup-title">
    <h2 id="setup-title">Who’s playing?</h2>
    <p>Add your teams and give each one a name. Leave a name blank to use its default.</p>
    <form onSubmit={startGame}>
      <div className="team-count">
        <span aria-live="polite">{names.length} {names.length === 1 ? 'team' : 'teams'}</span>
        <button type="button" className="secondary" onClick={() => setNames(previous => [...previous, ''])}>+ Add Team</button>
      </div>
      <div className="team-fields">
        {names.map((name, index) => <div className="team-field" key={index}>
          <label htmlFor={`team-name-${index}`}>Team {index + 1} name</label>
          <div>
            <input id={`team-name-${index}`} value={name} placeholder={`Team ${index + 1}`} maxLength={60}
              onChange={event => setNames(previous => previous.map((item, position) => position === index ? event.target.value : item))} />
            <button type="button" className="secondary" disabled={names.length === 1} aria-label={`Remove Team ${index + 1}`}
              onClick={() => setNames(previous => previous.filter((_, position) => position !== index))}>Remove</button>
          </div>
        </div>)}
      </div>
      <button className="primary" type="submit">Start Game →</button>
    </form>
  </section>;
}
