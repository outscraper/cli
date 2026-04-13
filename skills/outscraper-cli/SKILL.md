---
name: Outscraper CLI
description: Use the Outscraper CLI to authenticate, query Outscraper businesses, install skills and MCP, sync env vars, and scaffold starter projects.
---

# Outscraper CLI

Use this skill when you need to:

- authenticate with `outscraper login`
- inspect auth and config with `outscraper view-config`
- query the Businesses API with `outscraper businesses list`
- fetch a single business with `outscraper businesses get <businessId>`
- fetch async results with `outscraper businesses status <requestId>`
- install skills with `outscraper setup skills`
- install the official Outscraper MCP server with `outscraper setup mcp`
- write `OUTSCRAPER_API_KEY` to a local `.env` file with `outscraper env`
- scaffold a starter project with `outscraper init`

## Notes

- `outscraper businesses list` now requires either `--query` or at least one filter.
- Prefer structured filters like `--country`, `--cities`, `--types`, `--name`, or `--os-ids`.
- Natural-language `--query` can work, but the Outscraper API may reject some prompts that cannot be parsed cleanly.
- Use `--wait` to poll async request results automatically.
- Use `--json`, `--pretty`, or `--csv` depending on the output you need.
- `outscraper setup skills --agent <agent>` installs only for the requested detected agent.
- `outscraper setup skills --global` targets user-level agent directories.
- Native local install without `--global` targets agent config folders in the current project when they exist.
- `outscraper setup mcp` installs the published `outscraper-mcp` server into editors and agents using `add-mcp`.
- MCP install supports any agent that `add-mcp` supports (run `npx add-mcp list-agents` to see all).
- `outscraper setup mcp --agent <agent> --global` scopes MCP installation to one agent.

## Examples

```bash
outscraper login
outscraper env --overwrite
outscraper businesses list --country US --cities "New York" --types "restaurant,cafe" --limit 10 --wait --pretty
outscraper businesses get "0x808fbae5987442ef:0xa822d31a98c92c62" --pretty
outscraper businesses status "<request-id>" --json
outscraper setup skills --agent codex --global
outscraper setup mcp --agent codex --global
outscraper init businesses-basic
```
