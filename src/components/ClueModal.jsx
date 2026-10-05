import React, { useEffect, useRef, useState } from 'react';
import { imagePath } from '../utils/loadQuestions.js';
export default function ClueModal({ clue, teams, onScore, onClose }) {
  const dialog = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className="clue-modal" aria-labelledby="clue-title" onCancel={event => { event.preventDefault(); onClose(); }}>
    <div className="modal-meta"><span>{clue.category}</span><span>{clue.value.toLocaleString()} POINTS</span></div>
    <h2 id="clue-title">{clue.question || 'Identify what is shown.'}</h2>
    {clue.image && (imageFailed ? <p className="image-fallback" role="status">Image unavailable. Check the file: {clue.image}</p> : <img className="clue-image" src={imagePath(clue.image, import.meta.env.BASE_URL)} alt="Visual clue" onError={() => setImageFailed(true)} />)}
    {revealed ? <><div className="answer" aria-live="polite"><span>THE ANSWER</span><p>{clue.answer}</p></div><div className="scoring-controls">{teams.map(({ name, score }, index) => <div className={`team-adjust team-${index % 3}`} key={index}><span>{name} <strong aria-live="polite">{score.toLocaleString()}</strong></span><div><button onClick={() => onScore(index, -clue.value)} aria-label={`Subtract ${clue.value} from ${name}`}>− {clue.value}</button><button onClick={() => onScore(index, clue.value)} aria-label={`Add ${clue.value} to ${name}`}>+ {clue.value}</button></div></div>)}</div></> : <button className="primary reveal" onClick={() => setRevealed(true)}>Reveal Answer</button>}
    <div className="modal-footer"><span>Returning marks this clue as played.</span><button className="secondary" onClick={onClose}>Return to Board →</button></div>
  </dialog>;
}
