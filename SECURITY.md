# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our monorepo seriously. If you discover a security vulnerability, please follow these steps:

### 1. **DO NOT** Disclose Publicly

Please do not create public GitHub issues for security vulnerabilities. This helps protect users while we work on a fix.

### 2. Report Privately

Send your vulnerability report to: **security@krisarmstrong.com**

Include the following information:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes (if available)
- Your contact information

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies by severity
  - Critical: 1-3 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-60 days

### 4. Disclosure Process

1. We will acknowledge receipt of your vulnerability report
2. We will confirm the vulnerability and determine its severity
3. We will develop and test a fix
4. We will release the fix and credit you (if desired)
5. We will publicly disclose the vulnerability after users have had time to update

## Security Best Practices for Contributors

### Code Security

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive data
- Follow the principle of least privilege
- Validate and sanitize all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization

### Dependency Security

- Keep dependencies up to date
- Review security advisories regularly
- Use `npm audit` before committing
- Avoid dependencies with known vulnerabilities

### CI/CD Security

- All PRs must pass security checks
- Automated security scans run on every commit
- Pre-commit hooks enforce security linting
- Secrets are managed via GitHub Secrets

## Automated Security Tools

This project uses several automated security tools:

- **npm audit**: Scans for vulnerable dependencies
- **audit-ci**: Fails CI builds on moderate+ vulnerabilities
- **eslint-plugin-security**: Detects security anti-patterns
- **eslint-plugin-no-secrets**: Prevents secret leakage
- **Dependabot**: Automated dependency updates
- **CodeQL**: Static code analysis (GitHub Security)

## Content Security Policy (CSP)

### Current Strategy

All apps use Content Security Policy headers to mitigate XSS and injection attacks:

```
default-src 'self';
script-src 'self' 'unsafe-inline' blob:;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' [app-specific APIs];
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
```

### Why 'unsafe-inline' is Acceptable

**Current Risk: LOW** - These are static sites with controlled inline scripts.

1. **Minimal Inline Scripts**: Only critical theme initialization (5 lines)
2. **No User-Generated Content**: All content is developer-controlled
3. **No eval() or Dynamic Code**: Scripts are static and reviewed
4. **Static Sites**: Apps are built at compile-time, not runtime

### CSP Directives Explained

- `script-src 'self' 'unsafe-inline'` - Allows app scripts + minimal theme init
- `style-src 'self' 'unsafe-inline'` - Allows Tailwind + component styles
- `blob:` - Only needed for development HMR (Vite hot module replacement)
- `object-src 'none'` - Blocks Flash/Java plugins
- `frame-ancestors 'none'` - Prevents clickjacking

### Future Improvements

If stronger CSP is needed, implement nonce-based CSP:

```typescript
// vite.config.ts
const nonce = crypto.randomBytes(16).toString('base64');
// Inject nonce into scripts and CSP header
```

**Trade-offs:**

- ✅ Eliminates 'unsafe-inline'
- ❌ Adds build complexity
- ❌ Requires dynamic nonce generation
- ❌ Minimal security benefit for static sites

### Monitoring

CSP violations can be monitored via `report-uri` directive in production.

## Security-Related NPM Scripts

```bash
# Run security audit
npm run audit:security

# Run audit with CI-friendly output
npm run audit:ci

# Fix automatically patchable vulnerabilities
npm audit fix
```

## Vulnerability Severity Levels

### Critical

- Remote code execution
- Authentication bypass
- Data exposure of sensitive information

### High

- SQL injection
- Cross-site scripting (XSS)
- Privilege escalation

### Medium

- Denial of service
- Information disclosure
- Cross-site request forgery (CSRF)

### Low

- Minor information leakage
- Issues requiring user interaction

## Security Updates

Security updates will be released as patch versions (x.x.X) and will be communicated via:

- GitHub Security Advisories
- Release notes
- Email to security contacts (if registered)

## Questions?

If you have questions about this security policy, please contact: **security@krisarmstrong.com**

---

**Last Updated**: November 2025
