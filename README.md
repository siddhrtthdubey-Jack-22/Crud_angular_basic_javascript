# ChessVerse.AI

Chess in the browser, plus the **AI assistant persona** studio this project started from. Personas you create in the studio can be played on the ChessVerse.AI board.

## Apps in this repo

| App | Path | Stack |
| --- | --- | --- |
| ChessVerse.AI board | `/` | Vite, chess.js, persona engine |
| Persona studio | `/persona-studio/` | AngularJS CRUD, `localStorage` |
| Ionic personas | `ionic-app/` | Ionic Angular, Capacitor |

Both studio apps share the key `ai-assistant-personas`. ChessVerse.AI is seeded as a house persona.

## Run the chess board and studio

```bash
npm install
npm run dev
```

Open the printed URL for the board. Open `/persona-studio/` to create or edit AI assistant personas (including ChessVerse.AI), then use **Play this persona in ChessVerse.AI**.

```bash
npm test
npm run build
```

## Ionic app

```bash
cd ionic-app
npm install
npm start
```

## Built-in chess opponents

Nova, Rookie Raja, Viper, Sage, Hunter Kade, Grandmaster Ghost, and **ChessVerse.AI**. Studio personas appear on the lobby after you save them.
