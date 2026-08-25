import { Chess } from "chess.js";

const PIECE_VALUE = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const PST = {
  p: [
    0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30,
    20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10,
    0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  n: [
    -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30,
    0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20,
    20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20,
    -40, -50, -40, -30, -30, -30, -30, -40, -50,
  ],
  b: [
    -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0,
    5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10,
    0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20,
    -10, -10, -10, -10, -10, -10, -20,
  ],
  r: [
    0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0,
    -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0,
    -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
  ],
  q: [
    -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5,
    5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5,
    5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10,
    -20,
  ],
  k: [
    -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40,
    -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40,
    -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20,
    -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20,
  ],
};

function squareIndex(file, rank, color) {
  const i = rank * 8 + file;
  return color === "w" ? i : 63 - i;
}

export function evaluatePosition(chess, persona) {
  const board = chess.board();
  let score = 0;
  let whiteKing = null;
  let blackKing = null;

  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const piece = board[rank][file];
      if (!piece) continue;
      const sign = piece.color === "w" ? 1 : -1;
      const pst = PST[piece.type][squareIndex(file, 7 - rank, piece.color)];
      score += sign * (PIECE_VALUE[piece.type] + pst);
      if (piece.type === "k") {
        if (piece.color === "w") whiteKing = { file, rank };
        else blackKing = { file, rank };
      }
      if ("nb".includes(piece.type) && (file === 3 || file === 4) && (rank === 3 || rank === 4)) {
        score += sign * persona.centerControl;
      }
    }
  }

  if (chess.inCheck()) {
    score += chess.turn() === "w" ? -persona.kingSafety * 2 : persona.kingSafety * 2;
  }

  if (whiteKing && blackKing) {
    const proximity =
      Math.abs(whiteKing.file - blackKing.file) + Math.abs(whiteKing.rank - blackKing.rank);
    score += (14 - proximity) * (persona.aggression / 8);
  }

  return chess.turn() === "w" ? score : -score;
}

function orderMoves(chess, persona) {
  const moves = chess.moves({ verbose: true });
  return moves.sort((a, b) => {
    const captureA = a.captured ? PIECE_VALUE[a.captured] + persona.captureBias : 0;
    const captureB = b.captured ? PIECE_VALUE[b.captured] + persona.captureBias : 0;
    const promoA = a.promotion ? 800 : 0;
    const promoB = b.promotion ? 800 : 0;
    const checkA = a.san.includes("+") || a.san.includes("#") ? persona.aggression : 0;
    const checkB = b.san.includes("+") || b.san.includes("#") ? persona.aggression : 0;
    return captureB + promoB + checkB - (captureA + promoA + checkA);
  });
}

function minimax(chess, persona, depth, alpha, beta) {
  if (depth === 0 || chess.isGameOver()) {
    if (chess.isCheckmate()) return -20000 + (4 - depth);
    if (chess.isDraw()) return 0;
    return evaluatePosition(chess, persona);
  }

  let best = -Infinity;
  for (const move of orderMoves(chess, persona)) {
    chess.move(move);
    const score = -minimax(chess, persona, depth - 1, -beta, -alpha);
    chess.undo();
    if (score > best) best = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta) break;
  }
  return best;
}

export function choosePersonaMove(fen, persona, rng = Math.random) {
  const chess = new Chess(fen);
  if (chess.isGameOver()) return null;

  const candidates = [];
  for (const move of orderMoves(chess, persona)) {
    chess.move(move);
    const score = -minimax(chess, persona, Math.max(0, persona.depth - 1), -Infinity, Infinity);
    chess.undo();
    candidates.push({ move, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  const top = candidates.slice(0, Math.min(4, candidates.length));
  let pick = top[0];

  if (top.length > 1 && rng() < persona.errorRate) {
    const index = 1 + Math.floor(rng() * (top.length - 1));
    pick = top[index];
  }

  return pick.move;
}

export function thinkDelay(persona, rng = Math.random) {
  const [min, max] = persona.thinkMs;
  return Math.round(min + rng() * (max - min));
}
