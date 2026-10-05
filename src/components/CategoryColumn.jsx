import React from 'react';
import ClueTile from './ClueTile.jsx';
export default function CategoryColumn({ category, clues, values, used, onSelect, index }) {
  return <section className="category"><h2><span className="category-number">{String(index + 1).padStart(2, '0')}</span>{category}</h2>
    {values.map(value => { const clue = clues.find(item => item.value === value); return <ClueTile key={value} clue={clue} used={clue && used.has(clue.id)} onSelect={onSelect} />; })}
  </section>;
}
