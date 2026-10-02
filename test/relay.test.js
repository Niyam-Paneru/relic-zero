import test from "node:test";
import assert from "node:assert/strict";

import { Relay } from "../src/relay.js";

test("seed works exactly once", () => {
  const relay = new Relay({ secret: "development-secret" });
  const invite = relay.seed();
  assert.ok(invite.length > 20);
  assert.throws(() => relay.seed(), /relay_already_seeded/);
});

test("valid invite can be claimed", () => {
  const relay = new Relay({ secret: "development-secret" });
  const invite = relay.seed();
  const result = relay.claim(invite, {
    actor: "Ada",
    action: "bless",
    message: "hello",
  });
  assert.equal(result.publicTouch.sequence, 1);
  assert.equal(result.publicTouch.action, "bless");
  assert.ok(result.nextInvite);
});

test("same invite cannot be replayed", () => {
  const relay = new Relay({ secret: "development-secret" });
  const invite = relay.seed();
  relay.claim(invite, { actor: "Ada", action: "bless", message: "first" });
  assert.throws(
    () => relay.claim(invite, { actor: "Eve", action: "corrupt", message: "again" }),
    /invite_invalid_or_already_used/
  );
});

test("wrong invite is rejected", () => {
  const relay = new Relay({ secret: "development-secret" });
  relay.seed();
  assert.throws(
    () => relay.claim("not-the-token", { actor: "Ada", action: "bless", message: "hello" }),
    /invite_invalid_or_already_used/
  );
});

test("next invite advances chain", () => {
  const relay = new Relay({ secret: "development-secret" });
  const first = relay.seed();
  const one = relay.claim(first, { actor: "A", action: "bless", message: "one" });
  const two = relay.claim(one.nextInvite, { actor: "B", action: "corrupt", message: "two" });
  assert.equal(two.publicTouch.sequence, 2);
});

test("action is bounded", () => {
  const relay = new Relay({ secret: "development-secret" });
  const invite = relay.seed();
  assert.throws(
    () => relay.claim(invite, { actor: "A", action: "maybe", message: "hmm" }),
    /invalid_action/
  );
});

test("invalid input fails before consuming the active invite", () => {
  const relay = new Relay({ secret: "development-secret" });
  const invite = relay.seed();

  assert.throws(
    () => relay.claim(invite, { actor: "A", action: "maybe", message: "bad action" }),
    /invalid_action/
  );
  assert.throws(
    () => relay.claim(invite, { actor: "A", action: "bless", message: "x".repeat(81) }),
    /invalid_text_length/
  );

  const result = relay.claim(invite, {
    actor: "Ada",
    action: "bless",
    message: "still valid",
  });
  assert.equal(result.publicTouch.sequence, 1);
});

test("public text is normalized", () => {
  const relay = new Relay({ secret: "development-secret" });
  const invite = relay.seed();
  const result = relay.claim(invite, {
    actor: "  Ada   Lovelace ",
    action: "bless",
    message: "  hello    panda  ",
  });
  assert.equal(result.publicTouch.actor, "Ada Lovelace");
  assert.equal(result.publicTouch.message, "hello panda");
});

test("public history contains no invite token", () => {
  const relay = new Relay({ secret: "development-secret" });
  const invite = relay.seed();
  const result = relay.claim(invite, {
    actor: "Ada",
    action: "bless",
    message: "hello",
  });
  const serialized = JSON.stringify(relay.publicHistory());
  assert.equal(serialized.includes(invite), false);
  assert.equal(serialized.includes(result.nextInvite), false);
});

test("evolution replays bless and corrupt counts", () => {
  const relay = new Relay({ secret: "development-secret" });
  let invite = relay.seed();
  invite = relay.claim(invite, { actor: "A", action: "bless", message: "one" }).nextInvite;
  invite = relay.claim(invite, { actor: "B", action: "bless", message: "two" }).nextInvite;
  relay.claim(invite, { actor: "C", action: "corrupt", message: "three" });
  assert.deepEqual(relay.evolution(), { touches: 3, bless: 2, corrupt: 1, balance: 1 });
});
