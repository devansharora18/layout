---
name: snap
description: Only trigger this when the CURRENT message literally starts with "/snap ". Never carry over from a previous turn. Never infer from tone, frustration, or urgency. Do NOT apply snap to a message that lacks the slash prefix, even if the previous message was a snap.
---

# /snap

## Trigger (strict)

- **ONLY** when the **current user message** starts with the literal characters `/snap` (slash + snap + space or end-of-line). Check the current prompt, not conversation history.
- `snap`, `Snap`, `please snap`, or a message that merely *mentions* snap does **NOT** trigger this skill.
- Historical fact: a prior message used `/snap` does NOT authorize snap on the next message. Each message is evaluated independently.

## What it does

`/snap <task>` means: stop asking, just finish it — for this message only.

When triggered, suspend the normal workflow rules for **that single task**:

- **No step-by-step splitting.** Don't break the task into 5-10% chunks. Do the whole thing in this turn.
- **No pausing for approval between changes.** Make every change needed, end to end, without checking in mid-way.
- **No waterfall/agile mode-switching ceremony.** Just build.
- Ask **at most one** blocking clarifying question, and only if the task is truly ambiguous (e.g. which of two unrelated features). Otherwise make the reasonable call yourself and note the assumption at the end — don't ask to confirm it first.

## Scope & expiry (non-sticky)

This is a **scoped, one-time, one-message override**. It expires automatically:

- After the snap task is completed, the agent **MUST** revert to the default incremental/approval workflow in `AGENTS.md` for the very next message.
- Do **NOT** remain in snap mode. Do **NOT** apply snap rules to the next prompt unless that next prompt also independently starts with `/snap`.
- Never ask "should I stay in snap mode?" — the answer is always no; snap never persists.
- If the next message lacks `/snap`, treat it as a normal agile step: one small change, then stop and ask for approval.

## What does NOT get suspended

Snapping past process, not standards. Everything else in the repo's skills still applies at full strength:

- Code quality, security practices, file-size guidance, folder structure — unchanged.
- No shortcuts on auth, validation, or anything in the `backend` security section.
- Still no AI-slop code or filler comments — speed isn't an excuse for sloppy output.

## After a snap

- Give one tight summary of everything that changed (not a step-by-step play-by-play — this isn't a commit log, it's a "here's what's different now").
- Flag anything you weren't fully sure about instead of burying it.

## Example

```
/snap add rate limiting to the login and signup endpoints
```
→ AI implements it fully (middleware/dependency, config, tests if the project has a test setup) in one pass, then reports back what was added — no "step 1/4, shall I continue?".