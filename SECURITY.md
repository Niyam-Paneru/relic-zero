# Security boundary

This repository is an experimental public core, **not a formally audited security protocol** and not a claim of production security.

It contains no production secret, live invitation token, database, moderation console, analytics identity, deployment credential, or private UI/persistence implementation.

What this slice demonstrates:
- invite plaintext is not written into public history;
- the active capability is represented by a hash;
- a consumed capability is rejected on replay;
- the old capability is consumed before the next one is issued;
- public action/text inputs are bounded before mutation.

A production implementation would additionally need atomic persistence/transactions, concurrency handling, secure secret storage and rotation, rate limiting, abuse controls, durable audit/monitoring, and recovery behavior appropriate to its threat model.
