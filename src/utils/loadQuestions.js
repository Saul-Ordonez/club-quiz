import Papa from 'papaparse';

export function imagePath(filename, base = './') {
  return `${base}images/${filename.split('/').map(encodeURIComponent).join('/')}`;
}

export function parseQuestions(csv) {
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: 'greedy', transformHeader: h => h.trim().toLowerCase() });
  const required = ['round', 'category', 'value', 'question', 'answer', 'type', 'image'];
  if (required.some(name => !parsed.meta.fields?.includes(name))) {
    throw new Error(`CSV headers must include: ${required.join(', ')}.`);
  }
  const warnings = [];
  const questions = [];
  const seen = new Set();
  const badRows = new Set(parsed.errors.map(error => error.row));
  if (parsed.errors.some(error => error.row === undefined)) throw new Error('The CSV could not be parsed. Check quotation marks and commas.');
  parsed.data.forEach((raw, index) => {
    const row = Object.fromEntries(required.map(key => [key, String(raw[key] ?? '').trim()]));
    const value = Number(row.value);
    const key = JSON.stringify([row.round, row.category, value]);
    const unsafeImage = row.image && (row.image.startsWith('/') || row.image.includes('\\') || row.image.split('/').some(part => !part || part === '..' || part === '.') || /^[a-z]+:/i.test(row.image));
    let reason = '';
    if (badRows.has(index)) reason = 'malformed CSV fields';
    else if (!row.round || !row.category || !row.answer) reason = 'missing round, category, or answer';
    else if (!row.value || !Number.isSafeInteger(value) || value <= 0) reason = 'value must be a positive whole number';
    else if (!['text', 'image'].includes(row.type)) reason = 'type must be text or image';
    else if (!row.question && !row.image) reason = 'a question or image is required';
    else if (row.type === 'image' && !row.image) reason = 'image clues need an image filename';
    else if (unsafeImage) reason = 'image must be a local filename or relative subfolder path';
    else if (seen.has(key)) reason = 'duplicate round/category/value';
    if (reason) { warnings.push(`Data row ${index + 1}: skipped — ${reason}.`); return; }
    seen.add(key);
    questions.push({ ...row, value, id: key });
  });
  if (!questions.length) throw new Error(`No valid clues were found. ${warnings.slice(0, 3).join(' ')}`);
  return { questions, warnings };
}

export async function loadQuestions(base, signal) {
  const response = await fetch(`${base}data/questions.csv`, { signal });
  if (!response.ok) throw new Error(`Could not load questions.csv (HTTP ${response.status}). Check public/data/questions.csv.`);
  return parseQuestions(await response.text());
}
