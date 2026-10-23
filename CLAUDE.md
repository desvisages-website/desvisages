# Working on Des Visages

Claude Code follows the same rules as Codex in this repository. They live in `AGENTS.md`; keep them there so both tools share one source.

@AGENTS.md

See `README.md` for the site structure and how to preview it locally.

## Every session

- Start with `git fetch` and update `main` from `origin/main`, so César's latest Codex changes are present before any edit.
- Do each task on its own `claude/...` branch cut from the updated `main`, never directly on `main`. Push the branch and show the change in the local preview.
- When Jorge says "publícalo", publish it without asking again: `git fetch`, merge the task branch into `main` (resolve conflicts with César's changes, never force-push), push `main`, then check that www.desvisages.net shows the change. GitHub Pages deploys `main` automatically. Without "publícalo", leave the branch unmerged.
