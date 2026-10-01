# Failure modes

## Invite replay
The same capability is submitted twice. Response: reject after first consumption.

## Wrong invite
A token does not hash to the active capability. Response: reject without changing state.

## Public history leaks the private capability
An invite appears in an event record. Response: history stores only public touch data.

## Two sources of truth diverge
A stored counter disagrees with the event history. Response: derive visible state by replaying touches.

## Invalid public action
A participant submits something other than bless/corrupt. Response: reject before mutation.

## Automatic forwarding appears
The system starts messaging the next participant itself. Response: keep handoff manual; custody is part of the experiment.
