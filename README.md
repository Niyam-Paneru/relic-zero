# Relic Zero

**One panda. One-use links. A global chain of tiny moral choices. What could possibly go wrong?**

Relic Zero is a small social relay experiment: one person receives one private invitation, changes the relic once, leaves one public message, and gets the next invitation to pass manually.

No accounts. No feed algorithm. No automatic messaging. No “invite 12 friends to unlock premium corruption.”

![Relic relay](docs/workflow.svg)

## The interesting part

The app looks playful, but the relay semantics are strict:

- only one active invitation exists;
- invite plaintext is not part of public history;
- the old capability is consumed before the next one is issued;
- every public touch is append-only;
- the relic state is derived by replaying that history;
- the same invite cannot win twice.

## Repo map

| Area | Responsibility |
|---|---|
| `tokens.js` | one-use capability derivation + hashing |
| `text.js` | public touch normalization |
| `evolution.js` | replay visible relic state |
| `relay.js` | consume → append → issue-next sequence |
| `test/` | replay, validation, and capability behavior |
| `docs/` | the reasoning behind the relay |

The private project adds the Three.js relic, persistence, moderation, browser UI, and stress views. This public repo keeps the one-use chain small enough to understand without opening 47 tabs.

> The panda does not know what an HMAC is. This is probably for the best.
