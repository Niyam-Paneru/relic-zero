# Security boundary

This public repo contains no production secret, live invitation token, database, moderation console, analytics identity, or deployment credential.

Capability plaintext should not be persisted in public history. Production persistence should protect the active capability hash, rate-limit claims, validate public text, and make state transitions atomic.

The playful UI does not make replay protection optional.
