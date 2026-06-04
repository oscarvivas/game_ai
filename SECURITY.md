# Security Guidelines — NeuroRogue

## Secrets & API Keys
- **Never** hardcode API keys, tokens, or passwords in source files.
- Use `.env` for local secrets (already in `.gitignore`).
- For deployment, use platform environment variables (Vercel, Netlify, GitHub Pages).
- If the AI module calls an external API, gate it behind an environment variable with a local fallback.

## User Input
- Sanitize any user-supplied text before rendering to the DOM (prevent XSS).
- Avoid `innerHTML`; prefer `textContent` or framework-safe rendering.

## Dependencies
- Keep dependencies minimal (per HACKATHON_SPEC constraints).
- Dependabot is configured — review its PRs promptly.
- Run `npm audit` before each deploy.

## CORS & Network
- If you add a backend/API, restrict CORS origins to your deploy domain.
- Do not expose debug or admin endpoints in production builds.

## Content Security Policy
- When deploying, add a CSP meta tag or header:
  ```html
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';">
  ```

## Reporting Vulnerabilities
If you find a security issue, open a private issue or email the maintainer directly.
