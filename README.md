# Relic Zero

Someone gets a secret invite, makes one mark on a shared relic, and passes the next invite to someone else.

The relic is a panda. The panda has lore, a reputation, and absolutely no qualifications to be your password manager.

Underneath is a small JavaScript **one-use capability relay**. The public repo is the invitation and state logic, not the finished game interface.

## A panda with boundaries

| What arrives | What the relay does |
| --- | --- |
| Wrong or reused token | Reject before touching state |
| Unknown action or invalid name/message | Reject before touching state |
| Valid token + action (**bless** or **corrupt**) + valid text | Consume invite and append a bounded public history entry |
| Accepted claim | Derive the next private invite with HMAC and store its hash |
| Public history replay | Recompute the visible evolution instead of trusting a drifting counter |

The **plain next invite** is returned for manual handoff, never written to public history. The current invite is one-use; trying again doesn't earn a second panda blessing.

Start at [relay.js](src/relay.js) for the mutation order, [tokens.js](src/tokens.js) for derivation, [evolution.js](src/evolution.js) for replay, and [tests](test/) for rejection and replay behavior. Node.js 20+.

## Things the panda cannot protect

This is **in-memory proof-of-rule code, not an audited security product**. A public game would still need atomic durable storage, concurrent-claim handling, moderation, rate limits, and real secret management. A cute mascot does not fix a race condition.

[Security boundaries](SECURITY.md) · [verification](docs/verification.md). I am aware the README contains more access-control policy than panda drawings. The panda is disappointed too.
