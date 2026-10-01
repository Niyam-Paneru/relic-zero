import test from "node:test";
import assert from "node:assert/strict";

import { normalizeText, validateAction } from "../src/text.js";

test("text is normalized", () => {
  assert.equal(normalizeText("  hello    panda ", 80), "hello panda");
});

test("blank text is rejected", () => {
  assert.throws(() => normalizeText("   ", 80), /invalid_text_length/);
});

test("only bless and corrupt exist", () => {
  assert.equal(validateAction("bless"), "bless");
  assert.equal(validateAction("corrupt"), "corrupt");
  assert.throws(() => validateAction("neutral"), /invalid_action/);
});
