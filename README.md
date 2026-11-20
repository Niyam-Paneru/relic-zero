# Relic Zero

One person gets a secret invitation, leaves a mark on a shared relic, and passes the next invitation along.

The relic is a panda. I could have chosen a sensible object, but then we wouldn't be here.

Under the panda is a JavaScript **one-use capability relay**: accept one invite, make one public mark, create the next private invite. The actual game interface isn't part of this repository. For now, the panda is more of a backend engineer than a game character.

## The panda has rules

| What arrives | What the relay does |
| --- | --- |
| Wrong or reused token | Reject before touching state |
| Unknown action or invalid name/message | Reject before touching state |
| Valid token + action (**bless** or **corrupt**) + valid text | Consume invite and append a bounded public history entry |
| Accepted claim | Derive the next private invite with HMAC and store its hash |
| Public history replay | Recompute the visible evolution instead of trusting a drifting counter |

The **plain next invite** is returned for manual handoff, never written to public history. Replay an invitation and the relay refuses it. The panda has very little to say about second chances.

Start at [relay.js](src/relay.js) for the mutation order, [tokens.js](src/tokens.js) for derivation, [evolution.js](src/evolution.js) for replay, and [tests](test/) for rejection and replay behavior. Node.js 20+.

## Things the panda cannot protect

This is **in-memory proof-of-rule code, not an audited security product**. A public game would still need atomic durable storage, concurrent-claim handling, moderation, rate limits, and real secret management.

As the [provenance notes](PROVENANCE.md) put it: the panda, regrettably, contributed no code review.

[Security boundaries](SECURITY.md) · [verification](docs/verification.md).
