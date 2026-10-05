# Club Quiz

A static, CSV-driven classroom quiz game. React + Vite + JavaScript, with Papa Parse for CSV. No backend or saved browser state. Refreshing starts a new game.

## Run locally

Use Node.js 22.12+ (or a compatible version supported by Vite 7).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. `npm run build` produces `dist/`; `npm run preview` serves that build locally. `npm test` checks data validation and asset paths.

## Replace the game

Edit `public/data/questions.csv`. Preserve these headers:

```csv
round,category,value,question,answer,type,image
1,Circuits,100,What unit measures resistance?,Ohm,text,
1,Circuits,200,Identify this component.,Capacitor,image,component.svg
```

- `round`: required label. Rounds appear in their first-seen CSV order and share team scores.
- `category`: required label; category order follows the CSV within each round.
- `value`: positive whole number of points; values are sorted numerically.
- `question`: clue text. May be blank when an image is supplied.
- `answer`: required answer text.
- `type`: `text` or `image`. An image-type clue requires an image filename.
- `image`: optional filename relative to `public/images/`. Blank fields are ignored. An image is displayed whenever supplied, including on a text-type row.

Quote fields containing commas, line breaks, or quotation marks using standard CSV escaping (`"He said ""hello"""`). Spreadsheet CSV export handles this automatically. Use UTF-8.

A round/category/value combination must be unique. Malformed rows are skipped with visible warnings; missing headers or no valid clues display an error. Categories and values are data-driven; missing category/value combinations display an empty cell. The sample has 25 clues in five categories, including two original local SVG diagrams, one without question text.

## Add images

Place your files in `public/images/`, then put the filename (for example `capacitor.jpg`) in the CSV `image` field. Relative subfolders such as `circuits/capacitor.jpg` also work. Names are case-sensitive on GitHub Pages. Do not include `/images/`, `public/`, external URLs, or `../`. PNG, JPEG, WebP, and SVG work in modern browsers. Images keep their aspect ratio; failed loads show a fallback message. For accessible play, use question text to describe visual clues where possible without giving away the answer.

## Hosting a game

At startup, add or remove teams and enter their names, then select **Start Game**. At least one team is required. Blank names use Team 1, Team 2, etc. Names are limited to 60 characters.

Click a tile, read the clue, and select **Reveal Answer**. Use each team's plus/minus buttons to award or deduct the clue value. Buttons can be used repeatedly for host corrections. **Return to Board** marks the clue played, even without revealing its answer. Escape also returns to the board. Scores can be negative. Reset Scores only clears scores. Reset Game confirms first, clears all rounds and scores, and returns to team setup with your previous names ready to edit. When a round is complete, a status message appears.

## GitHub Pages

Deployment is configured in `.github/workflows/deploy.yml`. Pages uses **GitHub Actions** as its source. Pushes to `main` run tests, build the app, and deploy `dist/`. You can also run the workflow manually from the Actions tab.

The site URL is https://saul-ordonez.github.io/club-quiz/. Vite uses `/club-quiz/` as its base so CSV and image paths work there. Local development also uses http://localhost:5173/club-quiz/.

The repository and deployed game are public. Deployment status and logs are available in the repository’s Actions tab.

After updating CSV or images, commit and push to `main` to rebuild and republish. See https://vite.dev/guide/static-deploy.html#github-pages for Vite's deployment reference.

## Structure

- `src/App.jsx`: loading, rounds, scores, played clues, and reset behavior.
- `src/components/`: GameBoard, CategoryColumn, ClueTile, ClueModal, ScoreBoard, TeamSetup.
- `src/utils/loadQuestions.js`: CSV parsing, validation, fetching, and image paths.
- `src/styles.css`: responsive board, scoreboard, and native dialog styling.
- `public/data/questions.csv`, `public/images/`: replaceable game content.
- `src/utils/loadQuestions.test.js`: data and path regression checks.

Suggested next milestone: an optional clue timer. Timers, special rounds, audio, and host/projector views are intentionally deferred.
