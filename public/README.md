# public/

The `public/` directory holds static files that are served as-is without
being processed by Vite's build pipeline.

## Contents

Place these files here:

- `favicon.svg` / `favicon.ico` — App favicon (referenced in `index.html`)
- `robots.txt` — Search engine directives
- `manifest.json` — PWA manifest (if Progressive Web App support is added)
- Large static assets that don't need hashing

## Key Difference from `src/assets/`

| Directory | Processed by Vite? | Import Method |
|-----------|-------------------|---------------|
| `src/assets/` | ✅ Yes (hashed, optimized) | `import` or `@/assets/` |
| `public/` | ❌ No (served directly) | `/filename.ext` (root-relative) |

Reference `public/` files with absolute root paths: `/favicon.svg`
