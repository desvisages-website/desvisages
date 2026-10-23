# Working on Des Visages

Claude Code follows the same rules as Codex in this repository. They live in `AGENTS.md`; keep them there so both tools share one source.

@AGENTS.md

See `README.md` for the site structure and how to preview it locally.

## Every session

- Start with `git fetch` and update `main` from `origin/main`, so César's latest Codex changes are present before any edit.
- Do each task on its own `claude/...` branch cut from the updated `main`, never directly on `main`. Push the branch; the user merges it into `main`.
