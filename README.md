# ChessVerse.AI

Browser chess app with **AI personas** — opponents that play and talk like distinct characters instead of a single difficulty slider.

This repository now hosts the ChessVerse.AI web application (the previous README described Angular CRUD learning notes).

## Play

```bash
npm install
npm run dev
```

Open the printed local URL, pick a persona, choose White or Black, and play.

```bash
npm test
npm run build
```

## Personas

| Persona | Style | Strength |
| --- | --- | --- |
| Nova | Curious beginner | ~650 |
| Rookie Raja | Solid club player | ~1100 |
| Viper | Aggressive tactician | ~1450 |
| Sage | Positional squeeze | ~1700 |
| Hunter Kade | Calculator | ~1950 |
| Grandmaster Ghost | Quiet, strong search | ~2300 |

Each persona mixes search depth, capture hunger, king safety, center control, and an error rate so games feel human rather than engine-perfect. Banter is tied to checks, wins, losses, and draws.

## Stack

- Vite
- chess.js for rules and legal moves
- In-browser minimax with persona-weighted evaluation (no server required)
