# Relic Zero

The idea is a little strange: a person gets a secret invite, makes one public mark on a shared relic, and hands the next invite to somebody else.

The relic is a panda, because apparently I needed one more project that was difficult to explain in a single sentence.

Under the panda is a one-use capability chain written in JavaScript. This public version focuses on the rules, not the art or the interface.

## What actually happens

A claim has an action (`bless` or `corrupt`), an invite token, a name, and a message. The relay validates **everything before touching the state**. Wrong token? Replay? Bad action? Invalid text? No mutation.

For a valid claim, it:

1. Consumes the current invitation.
2. Appends a bounded public history entry.
3. Derives the next private invite with HMAC and stores its hash.
4. Returns the next invite for manual handoff.

The plain invite never goes into public history. `evolution()` replays that history to derive visible state; there isn't a second counter quietly drifting out of sync.

## The panda's rules, visually

A bad invite doesn't even get to touch the state.

```mermaid
---
config:
  flowchart:
    curve: linear
    nodeSpacing: 28
    rankSpacing: 42
---
flowchart TB
    accTitle: Validation: refuse before the first mutation
    accDescr: Decision flow for validation: refuse before the first mutation.
    A["Claim invite"] --> B{"Action valid?"}
    B -- No --> R["Reject<br/>No mutation"]
    B -- Yes --> C{"Active invite?"}
    C -- No --> R
    C -- Yes --> D{"Text valid?"}
    D -- No --> R
    D -- Yes --> E["Accept"]
    classDef input stroke-width:1.5px;
    classDef pass stroke-width:2.5px;
    classDef stop stroke-width:2px,stroke-dasharray:5 3;
    class A,B,C,D input;
    class E pass;
    class R stop;
```

A valid invite gets consumed before the next one exists. Even the panda doesn't get a replay.

```mermaid
---
config:
  flowchart:
    curve: linear
    nodeSpacing: 28
    rankSpacing: 42
---
flowchart TB
    accTitle: Advancement: consume before issuing the next invite
    accDescr: Decision flow for advancement: consume before issuing the next invite.
    E["Consume old invite<br/>Clear active hash"] --> F["Public touch<br/>Append history"]
    F --> G["Next token<br/>Derive + store hash"]
    G --> I["Private invite<br/>Return for handoff"]
    F -. On demand .-> J["Visible state<br/>Replay public history"]
    classDef input stroke-width:1.5px;
    classDef pass stroke-width:2.5px;
    class E,F,G input;
    class I,J pass;
```

Node.js 20+. Go to [relay.js](src/relay.js) for the sequence, [tokens.js](src/tokens.js) for hashing/derivation, [evolution.js](src/evolution.js) for replay, and [tests](test/) for one-use behavior.

**Not an audited security system.** This is an in-memory proof of the relay rules. A real public game would need durable atomic state, concurrency handling, rate limits, moderation, and secret management. The panda cannot do those jobs. [Security boundaries](SECURITY.md) · [verification](docs/verification.md).
