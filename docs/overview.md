# Design overview

Relic Zero is intentionally a tiny social chain.

One participant receives one private capability. They use it once, add one public touch, and receive the next private capability to pass manually.

The public state is event-sourced:

- public touches are append-only;
- the visible relic state is derived by replay;
- invitation plaintext is not part of the public history;
- the active invitation is represented by its hash;
- consuming the old capability happens before the next one is issued.

The private project adds persistence, moderation, rendering, and UI. This repo keeps the relay contract small enough to inspect in one sitting.
