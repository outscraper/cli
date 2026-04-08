# Contributing

Thanks for contributing to `outscraper-cli`.

## Development Setup

Requirements:

- Node.js 18+
- npm

Install dependencies:

```bash
npm ci
```

Build the CLI:

```bash
npm run build
```

Run the built CLI locally:

```bash
node dist/index.js --help
```

## Project Structure

- `src/` - TypeScript source code
- `dist/` - compiled build output
- `templates/` - starter project templates copied by `outscraper init`
- `skills/` - bundled skills used by `outscraper setup skills`

## Development Workflow

1. Create a branch for your change.
2. Make changes in `src/`, `templates/`, or `skills` as needed.
3. Run:

```bash
npm test
npm run build
```

4. Verify the relevant CLI command manually.
5. Open a pull request with a clear summary of the change.

## Guidelines

- Prefer small, focused pull requests.
- Update `README.md` when user-facing behavior changes.
- Do not edit generated output manually unless required for verification.
- Prefer changing source files in `src/`; build output should be generated from source.
- Keep CLI error messages actionable and concrete.

## Testing

Current test coverage is minimal, so manual verification is important.

At minimum, validate:

- `outscraper --help`
- the command you changed
- `npm publish --dry-run` if packaging behavior changed

## Versioning

Use semantic versioning:

- patch for fixes and small UX improvements
- minor for new commands or new CLI capabilities
- major for breaking CLI changes
