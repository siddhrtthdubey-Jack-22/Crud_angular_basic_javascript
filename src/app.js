import { Chess } from "chess.js";
import { listPersonas, getPersona } from "./personas.js";
import { renderBoard } from "./board.js";
import { choosePersonaMove, thinkDelay } from "./engine.js";

const app = document.querySelector("#app");

const state = {
  view: "lobby",
  personaId: "viper",
  playerColor: "w",
  chess: new Chess(),
  selected: null,
  lastMove: null,
  messages: [],
  thinking: false,
  overlay: null,
  pendingPromotion: null,
  result: null,
};

function legalTargetsFor(square) {
  return state.chess
    .moves({ square, verbose: true })
    .map((move) => move.to);
}

function pushMessage(from, text) {
  state.messages.push({ from, text, at: Date.now() });
}

function personaLine(kind) {
  const persona = getPersona(state.personaId);
  const pool = persona[kind] ?? persona.onMove;
  return pool[Math.floor(Math.random() * pool.length)];
}

function currentStatus() {
  const { chess, thinking, result, playerColor } = state;
  if (result) return result;
  if (chess.isCheckmate()) return "Checkmate";
  if (chess.isDraw()) return "Draw";
  if (thinking) return `${getPersona(state.personaId).name} is thinking…`;
  if (chess.turn() === playerColor) return chess.inCheck() ? "Your king is in check" : "Your move";
  return "Waiting for the persona";
}

function startGame(personaId, playerColor) {
  state.view = "play";
  state.personaId = personaId;
  state.playerColor = playerColor;
  state.chess = new Chess();
  state.selected = null;
  state.lastMove = null;
  state.thinking = false;
  state.overlay = null;
  state.pendingPromotion = null;
  state.result = null;
  state.messages = [];
  pushMessage(getPersona(personaId).name, personaLine("greetings"));
  render();
  if (playerColor === "b") scheduleAiMove();
}

function endIfOver() {
  const { chess } = state;
  if (!chess.isGameOver()) return false;
  if (chess.isCheckmate()) {
    const winner = chess.turn() === "w" ? "Black" : "White";
    const youWon =
      (winner === "White" && state.playerColor === "w") ||
      (winner === "Black" && state.playerColor === "b");
    state.result = youWon ? "You win by checkmate" : `${getPersona(state.personaId).name} wins by checkmate`;
    pushMessage(getPersona(state.personaId).name, personaLine(youWon ? "onLoss" : "onWin"));
  } else {
    state.result = chess.isStalemate() ? "Draw by stalemate" : "Draw";
    pushMessage(getPersona(state.personaId).name, personaLine("onDraw"));
  }
  return true;
}

function applyMove(move) {
  const played = state.chess.move(move);
  if (!played) return false;
  state.lastMove = { from: played.from, to: played.to };
  state.selected = null;
  if (played.san.includes("+") || played.san.includes("#")) {
    if (state.chess.turn() === state.playerColor) {
      pushMessage(getPersona(state.personaId).name, personaLine("onCheck"));
    }
  }
  return true;
}

function scheduleAiMove() {
  if (state.chess.isGameOver() || state.chess.turn() === state.playerColor) return;
  state.thinking = true;
  render();
  const persona = getPersona(state.personaId);
  const fen = state.chess.fen();
  window.setTimeout(() => {
    const move = choosePersonaMove(fen, persona);
    state.thinking = false;
    if (move && state.chess.fen() === fen) {
      applyMove(move);
      if (!move.captured && Math.random() < 0.35) {
        pushMessage(persona.name, personaLine("onMove"));
      } else if (move.captured && Math.random() < 0.55) {
        pushMessage(persona.name, personaLine("onMove"));
      }
      endIfOver();
    }
    render();
  }, thinkDelay(persona));
}

function tryPlayerMove(from, to) {
  const verbose = state.chess.moves({ square: from, verbose: true }).filter((m) => m.to === to);
  if (!verbose.length) return;
  const needsPromotion = verbose.some((m) => m.promotion);
  if (needsPromotion) {
    state.pendingPromotion = { from, to };
    render();
    return;
  }
  if (applyMove({ from, to })) {
    if (endIfOver()) {
      render();
      return;
    }
    render();
    scheduleAiMove();
  }
}

function onSquare(square) {
  if (state.thinking || state.chess.isGameOver()) return;
  if (state.chess.turn() !== state.playerColor) return;

  const piece = state.chess.get(square);
  if (state.selected) {
    if (square === state.selected) {
      state.selected = null;
      render();
      return;
    }
    const targets = legalTargetsFor(state.selected);
    if (targets.includes(square)) {
      tryPlayerMove(state.selected, square);
      return;
    }
  }
  if (piece && piece.color === state.playerColor) {
    state.selected = square;
    render();
  }
}

function undoTurn() {
  if (state.thinking) return;
  state.chess.undo();
  if (state.chess.turn() !== state.playerColor) state.chess.undo();
  state.lastMove = null;
  state.result = null;
  render();
}

function lobbyView() {
  return `
    <header class="topbar">
      <div class="brand">
        <div class="logo">♞</div>
        <div>
          <h1>ChessVerse.AI</h1>
          <p>AI personas with distinct voices and playing styles</p>
        </div>
      </div>
      <a class="btn" href="/persona-studio/">Persona studio</a>
    </header>
    <section class="hero">
      <div>
        <h2>Play a person, not a slider.</h2>
        <p class="lead">
          Pick an opponent with a name, a temperament, and a way of seeing the board.
          Each persona searches differently, blunders differently, and talks like itself.
        </p>
        <div class="pills">
          <span class="pill">Built-in + studio personas</span>
          <span class="pill">Human-like mistakes</span>
          <span class="pill">In-game banter</span>
          <span class="pill">Runs in the browser</span>
        </div>
      </div>
      <div class="panel">
        <h3>How a persona thinks</h3>
        <p class="lead" style="margin:0">
          Search depth, capture hunger, king safety, and error rate are mixed per character.
          Viper hunts. Sage squeezes. Ghost rarely misses.
        </p>
      </div>
    </section>
    <div class="grid">
      ${listPersonas().map(
        (p) => `
        <button class="card" data-persona="${p.id}" style="--persona:${p.color}">
          <header>
            <h3>${p.name}</h3>
            <span class="rating">${p.rating} Elo</span>
          </header>
          <span class="tag">${p.archetype} · ${p.title}</span>
          <p>${p.style}</p>
        </button>`,
      ).join("")}
    </div>
  `;
}

function playView() {
  const persona = getPersona(state.personaId);
  const legal = state.selected ? legalTargetsFor(state.selected) : [];
  const history = state.chess.history();
  const pairs = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push(`${Math.floor(i / 2) + 1}. ${history[i]}${history[i + 1] ? " " + history[i + 1] : ""}`);
  }

  const promo = state.pendingPromotion
    ? `<div class="overlay"><div class="dialog">
        <h3>Promote pawn</h3>
        <div class="promo">
          ${["q", "r", "b", "n"]
            .map(
              (piece) =>
                `<button class="btn" data-promo="${piece}">${piece.toUpperCase()}</button>`,
            )
            .join("")}
        </div>
      </div></div>`
    : "";

  return `
    <header class="topbar">
      <div class="brand">
        <div class="logo">♞</div>
        <div>
          <h1>ChessVerse.AI</h1>
          <p>vs ${persona.name}</p>
        </div>
      </div>
      <div class="actions">
        <a class="btn" href="/persona-studio/">Persona studio</a>
        <button class="btn" data-action="lobby">All personas</button>
      </div>
    </header>
    <div class="play-layout">
      <div class="board-wrap">
        <div class="meta-row">
          <div class="player">
            <div class="avatar" style="background:${persona.color};color:#111">${persona.name[0]}</div>
            <div>
              <strong>${persona.name}</strong>
              <div class="status">${persona.rating} · ${persona.archetype}</div>
            </div>
          </div>
          <div class="status">${currentStatus()}</div>
        </div>
        ${renderBoard({
          chess: state.chess,
          orientation: state.playerColor,
          selected: state.selected,
          legalTargets: legal,
          lastMove: state.lastMove,
        })}
        <div class="meta-row" style="margin:12px 0 0">
          <div class="player">
            <div class="avatar" style="background:#d4af5a;color:#111">You</div>
            <div>
              <strong>You</strong>
              <div class="status">Playing ${state.playerColor === "w" ? "White" : "Black"}</div>
            </div>
          </div>
        </div>
      </div>
      <aside class="side">
        <div class="panel">
          <h3>${persona.name}</h3>
          <p class="lead" style="margin:0 0 10px">${persona.style}</p>
          <div class="status">Openings: ${persona.openings}</div>
        </div>
        <div class="panel">
          <h3>Table talk</h3>
          <div class="chat">
            ${state.messages
              .map(
                (m) =>
                  `<div class="msg ${m.from === "You" ? "you" : ""}"><strong>${m.from}:</strong> ${m.text}</div>`,
              )
              .join("")}
          </div>
        </div>
        <div class="panel">
          <h3>Moves</h3>
          <div class="moves">${pairs.join(" ") || "Game starts from the initial position."}</div>
        </div>
        <div class="panel actions">
          <button class="btn" data-action="undo">Take back</button>
          <button class="btn" data-action="resign">Resign</button>
          <button class="btn primary" data-action="rematch">Rematch</button>
        </div>
      </aside>
    </div>
    ${promo}
  `;
}

function colorPrompt(personaId) {
  const persona = getPersona(personaId);
  return `
    <header class="topbar">
      <div class="brand">
        <div class="logo">♞</div>
        <div>
          <h1>ChessVerse.AI</h1>
          <p>Choose a side against ${persona.name}</p>
        </div>
      </div>
      <button class="btn" data-action="lobby">Back</button>
    </header>
    <div class="panel" style="max-width:560px">
      <h3>${persona.name} · ${persona.rating}</h3>
      <p class="lead">${persona.style}</p>
      <div class="color-pick">
        <button class="btn primary" data-start="${personaId}" data-color="w">Play White</button>
        <button class="btn" data-start="${personaId}" data-color="b">Play Black</button>
      </div>
    </div>
  `;
}

export function render() {
  if (state.view === "lobby") app.innerHTML = lobbyView();
  else if (state.view === "color") app.innerHTML = colorPrompt(state.personaId);
  else app.innerHTML = playView();
}

app.addEventListener("click", (event) => {
  const squareBtn = event.target.closest("[data-square]");
  if (squareBtn && state.view === "play") {
    onSquare(squareBtn.dataset.square);
    return;
  }
  const card = event.target.closest("[data-persona]");
  if (card) {
    state.view = "color";
    state.personaId = card.dataset.persona;
    render();
    return;
  }
  const start = event.target.closest("[data-start]");
  if (start) {
    startGame(start.dataset.start, start.dataset.color);
    return;
  }
  const action = event.target.closest("[data-action]");
  if (action) {
    const name = action.dataset.action;
    if (name === "lobby") {
      state.view = "lobby";
      render();
    } else if (name === "undo") undoTurn();
    else if (name === "rematch") startGame(state.personaId, state.playerColor);
    else if (name === "resign") {
      state.result = `${getPersona(state.personaId).name} wins by resignation`;
      pushMessage(getPersona(state.personaId).name, personaLine("onWin"));
      render();
    }
    return;
  }
  const promo = event.target.closest("[data-promo]");
  if (promo && state.pendingPromotion) {
    const { from, to } = state.pendingPromotion;
    state.pendingPromotion = null;
    if (applyMove({ from, to, promotion: promo.dataset.promo })) {
      if (!endIfOver()) scheduleAiMove();
    }
    render();
  }
});

const requested = new URLSearchParams(window.location.search).get("persona");
if (requested && listPersonas().some((persona) => persona.id === requested)) {
  state.view = "color";
  state.personaId = requested;
}

render();
