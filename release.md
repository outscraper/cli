# Release Process

This document describes how to publish `outscraper-cli` to npm.

## Before Releasing

Make sure:

- `README.md` is up to date
- `package.json` version is correct
- `npm test` passes
- `npm run build` passes
- `npm publish --dry-run` passes

## Version Bump

Choose the appropriate version bump:

```bash
npm version patch
```

or

```bash
npm version minor
```

or

```bash
npm version major
```

This updates `package.json` and creates a git tag like `v0.1.1`.

## Push Changes

Push the branch and tags:

```bash
git push origin main --follow-tags
```

If you release from another branch, replace `main` with the correct branch.

## GitHub Release

Create a GitHub Release for the pushed tag.

Expected tag format:

- `v0.1.0`
- `v0.1.1`
- `v0.2.0`

The configured GitHub Actions workflow publishes to npm on `release.published`.

## npm Requirements

The repository must have:

- a valid `NPM_TOKEN` GitHub secret
- permission to publish the `outscraper-cli` package

## Local Verification

Useful commands before releasing:

```bash
npm ci
npm test
npm run build
npm pack --dry-run
npm publish --dry-run
```

## Notes on Packaging

The npm package is intentionally limited to runtime files:

- `dist/`
- `templates/`
- `skills/`
- `README.md`
- `LICENSE`

Source files in `src/` are not required in the published package.
