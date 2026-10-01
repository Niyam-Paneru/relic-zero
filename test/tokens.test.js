import test from "node:test";
import assert from "node:assert/strict";

import { nextToken, sha256 } from "../src/tokens.js";

test("same input hashes the same way", () => {
  assert.equal(sha256("panda"), sha256("panda"));
});

test("next token changes with sequence", () => {
  const a = nextToken("development-secret", 1, "abc");
  const b = nextToken("development-secret", 2, "abc");
  assert.notEqual(a, b);
});

test("next token changes with previous capability", () => {
  const a = nextToken("development-secret", 1, "abc");
  const b = nextToken("development-secret", 1, "xyz");
  assert.notEqual(a, b);
});
