import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL("./checklists.js", import.meta.url),
  "utf8",
);
const {
  checklists,
  documentIds,
  emptyProgress,
  modes,
  progressFor,
  restoreProgress,
  updateProgress,
} = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);

test("all modes have unique document IDs and explanations", () => {
  for (const mode of modes) {
    const ids = documentIds(mode);
    assert.equal(new Set(ids).size, ids.length);
    for (const group of checklists[mode].groups) {
      assert.ok(group.documents.length);
      for (const document of group.documents)
        assert.ok(document.title && document.description);
    }
  }
});

test("checkbox toggles update counts and percentage without duplicates", () => {
  const id = documentIds("buying")[0];
  const checked = updateProgress(emptyProgress(), { type: "toggle", id });
  assert.equal(progressFor(checked).completed, 1);
  assert.equal(
    progressFor(checked).percent,
    Math.round(100 / documentIds("buying").length),
  );
  assert.equal(
    progressFor(updateProgress(checked, { type: "toggle", id })).completed,
    0,
  );
  assert.deepEqual(
    updateProgress(checked, { type: "toggle", id: "unknown" }),
    checked,
  );
});

test("mark all and reset affect the current mode only", () => {
  let state = updateProgress(emptyProgress(), { type: "all" });
  assert.equal(progressFor(state).percent, 100);
  const buying = [...state.completed.buying];
  state = updateProgress(state, { type: "mode", mode: "selling" });
  assert.equal(progressFor(state).completed, 0);
  state = updateProgress(state, { type: "all" });
  state = updateProgress(state, { type: "reset" });
  assert.equal(progressFor(state).completed, 0);
  assert.deepEqual(state.completed.buying, buying);
  assert.deepEqual(state.completed.renting, []);
});

test("saved progress restores mode and independent checkbox selections", () => {
  let state = updateProgress(emptyProgress(), { type: "all" });
  state = updateProgress(state, { type: "mode", mode: "renting" });
  state = updateProgress(state, {
    type: "toggle",
    id: documentIds("renting")[0],
  });
  assert.deepEqual(restoreProgress(JSON.stringify(state)), state);
});

test("corrupt, outdated and malformed storage is handled safely", () => {
  for (const serialized of [
    null,
    "",
    "broken JSON",
    "null",
    "[]",
    '{"version":2}',
  ])
    assert.deepEqual(restoreProgress(serialized), emptyProgress());
  const id = documentIds("buying")[0];
  const restored = restoreProgress(
    JSON.stringify({
      version: 1,
      mode: "unknown",
      completed: { buying: [id, id, "unknown", true], selling: "invalid" },
    }),
  );
  assert.equal(restored.mode, "buying");
  assert.deepEqual(restored.completed.buying, [id]);
  assert.deepEqual(restored.completed.selling, []);
});
