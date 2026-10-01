import test from "node:test";
import assert from "node:assert/strict";

import { deriveEvolution } from "../src/evolution.js";

test("evolution is replayed from public touches", () => {
  const result = deriveEvolution([
    { action: "bless" },
    { action: "bless" },
    { action: "corrupt" },
  ]);
  assert.deepEqual(result, { touches: 3, bless: 2, corrupt: 1, balance: 1 });
});

test("empty history is boring but valid", () => {
  assert.deepEqual(deriveEvolution([]), { touches: 0, bless: 0, corrupt: 0, balance: 0 });
});
