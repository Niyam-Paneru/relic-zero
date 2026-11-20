# Relic Zero

Relic Zero is a game idea about passing a secret invite from one person to the next, leaving a little mark on a shared relic each time.

The relic is a panda. This is a genuine design decision that I am not going to try to justify with a product roadmap.

Under the panda is a small JavaScript **one-use capability relay**. This public repo is the invitation and state logic, not the finished game interface.

## The surprisingly strict panda

| What arrives | What the relay does |
| --- | --- |
| Wrong or reused token | Reject before touching state |
| Unknown action or invalid name/message | Reject before touching state |
| Valid token + action (**bless** or **corrupt**) + valid text | Consume invite and append a bounded public history entry |
| Accepted claim | Derive the next private invite with HMAC and store its hash |
| Public history replay | Recompute the visible evolution instead of trusting a drifting counter |

The **plain next invite** is returned for manual handoff, never written to public history. The current invite is one-use. Replay the same token and the relay refuses it.

Start at [relay.js](src/relay.js) for the mutation order, [tokens.js](src/tokens.js) for derivation, [evolution.js](src/evolution.js) for replay, and [tests](test/) for rejection and replay behavior. Node.js 20+.

## Things the panda cannot protect

This is **in-memory proof-of-rule code, not an audited security product**. A public game would still need atomic durable storage, concurrent-claim handling, moderation, rate limits, and real secret management.

As the [provenance notes](PROVENANCE.md) put it: the panda, regrettably, contributed no code review.

[Security boundaries](SECURITY.md) · [verification](docs/verification.md).
