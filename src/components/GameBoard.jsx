import React from 'react';
import CategoryColumn from './CategoryColumn.jsx';
export default function GameBoard({ clues, used, onSelect }) {
  const categories = [...new Set(clues.map(clue => clue.category))];
  const values = [...new Set(clues.map(clue => clue.value))].sort((a, b) => a - b);
  return <div className="board-scroll"><div className="board" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(150px, 1fr))` }}>
    {categories.map((category, index) => <CategoryColumn key={category} {...{ category, index, values, used, onSelect }} clues={clues.filter(clue => clue.category === category)} />)}
  </div></div>;
}
