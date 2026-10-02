# Relic Zero

**A one-use capability relay for a playful social experiment.**

One participant receives one private invite, changes the relic once, leaves one public touch, and gets exactly one next invite to pass manually. The public core is small on purpose: its proof is the capability lifecycle, replay rejection, and event-derived state.

![Relic Zero capability lifecycle](docs/workflow.svg)

## Relay contract

`Relay.claim()` follows this order:

1. Validate the requested action (`bless` or `corrupt`).
2. Hash the supplied invite and compare it with the one active invite hash.
3. Normalize and bound the public actor/message text.
4. Consume the old capability by clearing the active hash.
5. Append one public touch: `sequence`, `actor`, `action`, `message`.
6. Derive exactly one next token with HMAC from the secret, sequence, and consumed capability hash.
7. Store only the next token's hash as active state and return the plaintext token for manual handoff.

A wrong or replayed token is rejected before mutation. Invalid action/text is also rejected before capability consumption. `publicHistory()` returns only public touches; invite plaintext is not part of that history.

Visible relic state is not stored as a second mutable truth. `evolution()` derives it on demand by replaying the append-only public touches.

## Verify it

```bash
npm test
node --check src/tokens.js
node --check src/text.js
node --check src/evolution.js
node --check src/relay.js
```

The behavior suite is intentionally easy to inspect:

- [`test/relay.test.js`](test/relay.test.js) — seed-once, valid claim, replay rejection, wrong-token rejection, next-token chain, normalization, public-history privacy, and evolution.
- [`test/tokens.test.js`](test/tokens.test.js) — hashing and next-token derivation.
- [`test/text.test.js`](test/text.test.js) — bounded public text/action validation.
- [`test/evolution.test.js`](test/evolution.test.js) — deterministic state replay.

## Review map

| File | What to inspect |
|---|---|
| [`src/relay.js`](src/relay.js) | validate → verify → normalize → consume → append → issue-next ordering |
| [`src/tokens.js`](src/tokens.js) | SHA-256 storage hash + HMAC-derived next capability |
| [`src/text.js`](src/text.js) | action and public-text bounds |
| [`src/evolution.js`](src/evolution.js) | state derived from append-only history |
| [`docs/invariants.md`](docs/invariants.md) | properties refactors must preserve |
| [`docs/failure-modes.md`](docs/failure-modes.md) | replay, wrong-token, leak, and divergence failures |
| [`SECURITY.md`](SECURITY.md) | what this public slice does and does not claim |
| [`PROVENANCE.md`](PROVENANCE.md) | what stayed public vs. private |

## Scope

This repository is an **experimental public core**, not a formally audited security protocol and not the full Relic Zero application. It demonstrates the relay semantics in memory. The private project contains persistence, moderation, rendering/UI, analytics, and deployment-specific code that is intentionally not exposed here.

Production use would require additional controls around atomic persistence, secret handling, rate limiting, concurrency, abuse/moderation, and operational recovery; see [`SECURITY.md`](SECURITY.md).

The panda is the premise. The one-use chain is the proof.
