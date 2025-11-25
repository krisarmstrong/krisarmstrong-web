# Development Guidelines

- Follow git hygiene: small, focused commits with clear messages; keep branches short-lived; ensure CI/CD passes linting, type checks, tests, and security scans before merging.
- Build against the current stack (React 19.2, Tailwind CSS 4.x) and follow their latest recommended patterns and APIs.
- Track all work in GitHub issues; document fixes and enhancements, and close issues promptly once verified.
- Keep CSS consistent: rely on shared design tokens and Tailwind utilities, avoid one-off styles, and align with the established design system.
- Eliminate duplicate code by extracting shared components, hooks, and utilities; prefer reuse over copy/paste.
- Deliver principal-level quality: readable code, clear docs where needed, thorough tests, and proactive refactoring to prevent tech debt.
- After changes, clear cache, run npm lint, npm test, rebuild and restart all sites/services to validate deployments and catch integration issues early.
- If there are any issues do a proper fix NO hacks ever
- Always fix Criticial and High Defects
- Always fix Security issues
