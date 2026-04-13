# Outscraper CLI

Command-line interface for the [Outscraper](https://outscraper.com/) Business Data API. Search business records, inspect async request status, manage your API key, export results, set up AI-agent integrations, and scaffold starter projects from one CLI.

## Why Outscraper CLI

- Search and retrieve Outscraper business data from your terminal
- Authenticate once and reuse your API key across commands
- Poll async requests and export results as JSON, pretty JSON, or CSV
- Install Outscraper skills and MCP integrations for AI coding agents
- Bootstrap local projects with ready-to-run starter templates
- Works well for lead generation, local SEO research, location intelligence, and business data workflows

## What You Can Do

- `outscraper businesses list` to search businesses with structured filters or pass a raw API query with `--query`
- `outscraper businesses get` to fetch a single business by ID
- `outscraper businesses status` to check async request results
- `outscraper status` or `outscraper balance` to inspect account balance and billing status
- `outscraper login`, `logout`, `config`, and `env` to manage authentication
- `outscraper setup skills` and `outscraper setup mcp` to connect Outscraper to AI agents and editor tooling
- `outscraper init` to install, authenticate, set up integrations, and scaffold a starter template

## Installation

```bash
npm install -g outscraper-cli
```

Or use the local project during development:

```bash
npm install
npm run build
node dist/index.js --help
```

## Quick Start

Authenticate and save your API key:

```bash
outscraper login
```

Search businesses:

```bash
outscraper businesses list --country US --cities "New York" --types "restaurant" --wait
```

Raw API query passthrough:

```bash
outscraper businesses list --query "restaurants in New York"
```

Note: `--query` is sent to the Outscraper API as-is. For the most reliable results, prefer structured filters.

Search with structured filters:

```bash
outscraper businesses list --country US --cities "New York" --types "restaurant" --limit 25 --wait --csv
```

Fetch a single business:

```bash
outscraper businesses get 0x808fbae5987442ef:0xa822d31a98c92c62
```

Check a request later:

```bash
outscraper businesses status <request-id>
```

Check account status and balance:

```bash
outscraper status
outscraper balance --json
```

## Core Commands

### Businesses Search

Use a raw API query:

```bash
outscraper businesses list --query "coffee shops in San Francisco" --wait
```

Best for reliability: prefer structured filters when possible.

Use structured business filters:

```bash
outscraper businesses list \
  --country US \
  --states California \
  --cities "San Francisco" \
  --types "coffee shop" \
  --has-website \
  --has-phone \
  --limit 50 \
  --wait
```

Common filters:

- `--country`
- `--states`
- `--cities`
- `--counties`
- `--postal-codes`
- `--name`
- `--types`
- `--ignore-types`
- `--rating`
- `--reviews`
- `--has-website`
- `--has-phone`
- `--verified`
- `--business-statuses`
- `--os-ids`
- `--filters-file`

Output options:

- `--json`
- `--pretty`
- `--csv`
- `--output <path>`

Async request options:

- `--wait`
- `--poll-interval <seconds>`
- `--timeout <seconds>`
- `--flat`

### Business Details

```bash
outscraper businesses get <business-id> --pretty
```

### Request Status

```bash
outscraper businesses status <request-id> --pretty
```

### Authentication and Config

```bash
outscraper login
outscraper config
outscraper view-config
outscraper logout
outscraper env
```

You can also pass credentials per command:

```bash
outscraper --api-key YOUR_KEY businesses list --query "dentists in Chicago"
outscraper --api-url https://api.outscraper.cloud businesses status <request-id>
```

## AI Agent Setup

Install Outscraper skills into supported coding agents:

```bash
outscraper setup skills
```

Install for one detected agent only:

```bash
outscraper setup skills --agent codex --global
```

Notes:

- `--agent <agent>` scopes installation to a single detected agent
- `--global` installs into user-level agent directories
- without `--global`, native local install targets agent config folders in the current project when available

Install the official Outscraper MCP server into editors and agents:

```bash
outscraper setup mcp
```

Install for a specific agent:

```bash
outscraper setup mcp --agent codex --global
```

This uses `add-mcp` to install the published `outscraper-mcp` package and inject `OUTSCRAPER_API_KEY` into the agent config. MCP install supports any agent that `add-mcp` supports (run `npx add-mcp list-agents` to see all).

Equivalent direct install command:

```bash
npx add-mcp -y "npx -y outscraper-mcp" --name outscraper --env "OUTSCRAPER_API_KEY=<your-key>"
```

Run the full guided setup:

```bash
outscraper init
```

Non-interactive setup:

```bash
outscraper init --yes
```

## Starter Templates

The CLI can scaffold starter projects from the bundled templates:

- `businesses-basic`
- `businesses-csv`

Example:

```bash
outscraper init
```

Or after selecting a template, run the generated example project locally to start working with the Outscraper Business Data API right away.

## Authentication

This CLI stores `OUTSCRAPER_API_KEY` locally in the user config directory and can also write it into a project `.env` file.

Supported auth flows:

- saved local credentials
- `OUTSCRAPER_API_KEY` environment variable
- `--api-key` per command

Optional API endpoint override:

- `OUTSCRAPER_API_URL`
- `--api-url`

## Business Data API Coverage

The current CLI is built around these Outscraper endpoints:

- `POST /businesses`
- `GET /businesses/{business_id}`
- `GET /requests/{requestId}`
- `GET /profile/balance`

## MCP Server

The official MCP server lives in a separate repository:

- [outscraper/outscraper-mcp-server](https://github.com/outscraper/outscraper-mcp-server)

Published npm package:

- `outscraper-mcp`

## Use Cases

- business lead generation
- local business discovery
- sales prospecting
- directory enrichment workflows
- market research
- location-based business intelligence
- AI-agent access to Outscraper data

## Development

```bash
npm install
npm run build
npm test
```

Entry point:

- `src/index.ts`

Build output:

- `dist/`

## Requirements

- Node.js 18+

## Project Status

Early-stage CLI focused on Outscraper business search, authentication, agent setup, and starter templates.
