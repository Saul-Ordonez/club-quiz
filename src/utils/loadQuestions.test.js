import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseQuestions, imagePath } from './loadQuestions.js';
const header = 'round,category,value,question,answer,type,image\n';
test('sample supplies 25 clues and two local images', () => {
  const result = parseQuestions(readFileSync(new URL('../../public/data/questions.csv', import.meta.url), 'utf8'));
  assert.equal(result.questions.length, 25);
  assert.equal(result.warnings.length, 0);
  const images = result.questions.filter(clue => clue.image);
  assert.equal(images.length, 2);
  images.forEach(clue => assert.ok(readFileSync(new URL(`../../public/images/${clue.image}`, import.meta.url)).length));
});
test('supports quoted commas, image-only clues, and arbitrary rounds', () => {
  const result = parseQuestions(header + 'Bonus,Art,750,"Red, blue?",Colors,text,\n2,Shapes,20,,Triangle,image,shape.svg');
  assert.equal(result.questions[0].question, 'Red, blue?');
  assert.equal(result.questions[1].question, '');
  assert.equal(result.warnings.length, 0);
});
test('skips invalid and duplicate rows without losing good clues', () => {
  const result = parseQuestions(header + ['1,A,100,Q,A,text,','1,A,100,Q,A,text,','1,,200,Q,A,text,','1,A,no,Q,A,text,','1,A,300,,,text,','1,A,400,Q,A,image,','1,A,500,Q,A,image,../secret.svg','1,A,600,Q,A,text,,extra'].join('\n'));
  assert.equal(result.questions.length, 1);
  assert.equal(result.warnings.length, 7);
});
test('rejects missing headers and entirely invalid files', () => {
  assert.throws(() => parseQuestions('hello'), /headers/);
  assert.throws(() => parseQuestions(header + '1,A,-2,Q,A,text,'), /No valid clues/);
});
test('image URLs respect deployment prefixes and escape filenames', () => {
  assert.equal(imagePath('a b.svg', '/club-quiz/'), '/club-quiz/images/a%20b.svg');
  assert.equal(imagePath('science/a#b.png', './'), './images/science/a%23b.png');
});
