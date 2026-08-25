const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const UNICODE = {
  w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
  b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" },
};

export function squareName(file, rank) {
  return `${FILES[file]}${rank + 1}`;
}

export function coordsFromSquare(square) {
  return { file: FILES.indexOf(square[0]), rank: Number(square[1]) - 1 };
}

export function renderBoard({ chess, orientation, selected, legalTargets, lastMove }) {
  const board = chess.board();
  const ranks = orientation === "w" ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const files = orientation === "w" ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
  const lastFrom = lastMove?.from;
  const lastTo = lastMove?.to;

  const squares = ranks
    .map((rank) =>
      files
        .map((file) => {
          const square = squareName(file, rank);
          const piece = board[7 - rank][file];
          const isLight = (file + rank) % 2 === 1;
          const isSelected = selected === square;
          const isLegal = legalTargets.includes(square);
          const isLast = square === lastFrom || square === lastTo;
          const classes = [
            "sq",
            isLight ? "light" : "dark",
            isSelected ? "selected" : "",
            isLegal ? "legal" : "",
            isLast ? "last" : "",
            chess.inCheck() && piece?.type === "k" && piece.color === chess.turn() ? "check" : "",
          ]
            .filter(Boolean)
            .join(" ");
          const pieceHtml = piece
            ? `<span class="piece ${piece.color}" draggable="false">${UNICODE[piece.color][piece.type]}</span>`
            : "";
          const captureDot = isLegal && piece ? "capture" : isLegal ? "target" : "";
          return `<button type="button" class="${classes}" data-square="${square}" aria-label="${square}">
            ${pieceHtml}
            ${captureDot === "target" ? '<i class="dot"></i>' : ""}
            ${captureDot === "capture" ? '<i class="ring"></i>' : ""}
          </button>`;
        })
        .join(""),
    )
    .join("");

  return `<div class="board" role="grid">${squares}</div>`;
}
