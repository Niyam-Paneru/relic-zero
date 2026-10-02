# Verification

Relic Zero has no runtime dependencies beyond Node.js. The package declares Node.js 20 or newer.

## Behavior suite

```bash
npm test
```

The tests cover:

- seeding exactly once;
- valid claim advancement;
- wrong and replayed invite refusal;
- invalid action refusal;
- public text normalization and bounds;
- absence of invite plaintext from public history;
- deterministic evolution derived from public touches;
- token hashing and next-token derivation.

## Syntax checks

```bash
node --check src/tokens.js
node --check src/text.js
node --check src/evolution.js
node --check src/relay.js
```

A clean verification run should complete the behavior suite with zero failures and all four syntax checks without errors.

These checks verify the in-memory public core only. They do not establish production security, persistence safety, concurrency correctness, deployment health, or audit status; see [`../SECURITY.md`](../SECURITY.md).
