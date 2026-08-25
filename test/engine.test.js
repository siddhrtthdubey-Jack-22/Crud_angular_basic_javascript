import { test } from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { choosePersonaMove, evaluatePosition } from "../src/engine.js";
import { assistantToChessPersona, getPersona, listPersonas, PERSONAS } from "../src/personas.js";

test("personas are unique and playable", () => {
  const ids = new Set(PERSONAS.map((p) => p.id));
  assert.equal(ids.size, PERSONAS.length);
  for (const persona of PERSONAS) {
    assert.ok(persona.depth >= 1);
    assert.ok(persona.errorRate >= 0 && persona.errorRate < 1);
  }
});

test("starting position is roughly equal", () => {
  const chess = new Chess();
  const sage = getPersona("sage");
  const score = evaluatePosition(chess, sage);
  assert.ok(Math.abs(score) < 50);
});

test("engine returns a legal move from the start", () => {
  const chess = new Chess();
  const move = choosePersonaMove(chess.fen(), getPersona("nova"), () => 0);
  assert.ok(move);
  assert.doesNotThrow(() => chess.move(move));
});

test("engine prefers capturing a hanging queen when not randomizing", () => {
  const fen = "4k3/8/8/8/8/8/4q3/4K3 w - - 0 1";
  const move = choosePersonaMove(fen, getPersona("ghost"), () => 0);
  assert.equal(move.from, "e1");
  assert.equal(move.to, "e2");
});

test("studio assistants become playable chess personas", () => {
  const chessPersona = assistantToChessPersona({
    id: "p-chessverse",
    name: "ChessVerse.AI",
    role: "Chess opponent and coach",
    tone: "Playful",
    description: "House chess persona.",
    systemPrompt: "You are ChessVerse.AI.",
    color: "#d4af5a",
  });
  assert.equal(chessPersona.name, "ChessVerse.AI");
  assert.equal(chessPersona.depth, 1);
  assert.ok(chessPersona.errorRate > 0);
  assert.ok(listPersonas().some((persona) => persona.id === "chessverse-ai"));
});
