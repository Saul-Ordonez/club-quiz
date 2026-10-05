import React, { useEffect, useState } from 'react';
import { loadQuestions } from './utils/loadQuestions.js';
import GameBoard from './components/GameBoard.jsx';
import ScoreBoard from './components/ScoreBoard.jsx';
import ClueModal from './components/ClueModal.jsx';
import TeamSetup from './components/TeamSetup.jsx';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [round, setRound] = useState('');
  const [used, setUsed] = useState(new Set());
  const [teams, setTeams] = useState([]);
  const [teamNames, setTeamNames] = useState(['', '', '']);
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    loadQuestions(import.meta.env.BASE_URL, controller.signal).then(result => { setData(result); setRound(result.questions[0].round); }).catch(error => { if (error.name !== 'AbortError') setError(error.message); });
    return () => controller.abort();
  }, []);
  const resetGame = () => {
    if (window.confirm('Reset the whole game and return to team setup? All clues and scores will be reset.')) {
      setUsed(new Set());
      setTeams(previous => previous.map(team => ({ ...team, score: 0 })));
      setRound(data.questions[0].round);
      setStarted(false);
    }
  };
  const closeClue = () => { setUsed(previous => new Set([...previous, active.id])); setActive(null); };
  const clues = data?.questions.filter(clue => clue.round === round) || [];
  const played = clues.filter(clue => used.has(clue.id)).length;
  const rounds = [...new Set(data?.questions.map(clue => clue.round) || [])];
  return <main className="app"><header><a className="brand" href="./"><span className="brand-icon">✳</span> ENGINEERING PEER MENTOR JEOPARDY NIGHT</a></header>
    <div className="game-heading"><div><h1>{started ? 'Choose a clue' : 'Game setup'}</h1>{data && <p className="intro">{started
      ? `${teams.length} ${teams.length === 1 ? 'team' : 'teams'} playing · ${clues.length - played} clues remaining this round`
      : `${new Set(data.questions.map(clue => clue.category)).size} categories · ${data.questions.length} clues · ${rounds.length} ${rounds.length === 1 ? 'round' : 'rounds'}`}</p>}</div>{data && started && <button className="secondary" onClick={resetGame}>↻ Reset Game</button>}</div>
    {error ? <div className="notice" role="alert"><h2>We couldn’t load the game.</h2><p>{error}</p><button className="secondary" onClick={() => window.location.reload()}>Try Again</button></div> : !data ? <p role="status">Loading the game…</p> : <>
      {data.warnings.length > 0 && <details className="notice"><summary>{data.warnings.length} CSV row(s) skipped — view details</summary><ul>{data.warnings.map((warning, i) => <li key={i}>{warning}</li>)}</ul></details>}
      {!started ? <TeamSetup initialNames={teamNames} onStart={names => {
        setTeamNames(names);
        setTeams(names.map(name => ({ name, score: 0 })));
        setStarted(true);
      }} /> : <>
      <div className="board-toolbar"><div className="round-label"><span className="live-dot" />{rounds.length > 1 ? <label>Round <select value={round} onChange={event => setRound(event.target.value)}>{rounds.map(item => <option key={item}>{item}</option>)}</select></label> : `ROUND ${round}`}</div><span>{played} / {clues.length} CLUES PLAYED</span></div>
      <GameBoard clues={clues} used={used} onSelect={setActive} />
      {played === clues.length && <p className="completion" role="status">{used.size === data.questions.length ? 'Game complete! Final scores are below.' : 'Round complete! Select another round to keep playing.'}</p>}
      <ScoreBoard teams={teams} onReset={() => setTeams(previous => previous.map(team => ({ ...team, score: 0 })))} />
      <footer><span>Host controls: reveal each answer, then award or deduct points.</span></footer>
      </>}
    </>}
    {active && <ClueModal key={active.id} clue={active} teams={teams} onClose={closeClue} onScore={(teamIndex, amount) => setTeams(previous => previous.map((team, index) => index === teamIndex ? { ...team, score: team.score + amount } : team))} />}
  </main>;
}
