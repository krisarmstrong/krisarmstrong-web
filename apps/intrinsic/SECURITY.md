# Security Policy - Intrinsic Momentum Mindset

## Security Overview

Intrinsic Momentum Mindset takes security seriously and implements multiple layers of protection to safeguard user data and maintain application integrity.

**Security Grade: A+**

---

## Table of Contents

1. [Reporting Security Issues](#reporting-security-issues)
2. [Security Features](#security-features)
3. [Third-Party Service Security](#third-party-service-security)
4. [Environment Variable Management](#environment-variable-management)
5. [Deployment Security](#deployment-security)
6. [Content Security Policy](#content-security-policy)
7. [Security Headers](#security-headers)
8. [Dependency Security](#dependency-security)
9. [Compliance](#compliance)
10. [Incident Response](#incident-response)

---

## Reporting Security Issues

**DO NOT** create public GitHub issues for security vulnerabilities.

Instead, please email security concerns to: **security@krisarmstrong.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and provide updates every 72 hours until resolved.

---

## Security Features

### 1. Component Library Security

The application leverages `@krisarmstrong/web-foundation` which implements:

**DOMPurify Integration:**
- All user-generated content is sanitized before rendering
- HTML injection protection
- XSS attack prevention

**React Auto-Escaping:**
- All dynamic content auto-escaped by React
- No `dangerouslySetInnerHTML` without sanitization
- Template literals are safe by default

**CSS Injection Prevention:**
- Theme color validation before application
- Prevents malicious CSS values
- Validates all CSS custom properties

### 2. Form Security

**Contact Form Protection:**

The Contact page uses the `ContactForm` component from web-foundation with the following security features:

```tsx
<ContactForm
  endpoint={formEndpoint}  // External HTTPS endpoint (Formspree)
  // All inputs sanitized by DOMPurify
  // Rate limiting handled by Formspree
  // No client-side data storage
/>
```

**Input Sanitization:**
- Name field: Sanitized for HTML/script injection
- Email field: Validated format (email regex)
- Message field: Sanitized, no dangerous HTML
- All fields: Max length enforcement

**Backend Security (Formspree):**
- HTTPS-only communication
- Built-in spam protection
- Rate limiting (configurable)
- reCAPTCHA integration available

### 3. Type Safety

**TypeScript Strict Mode:**
- Prevents runtime type errors
- Catches bugs at compile time
- Enforces null safety

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

### 4. ESLint Security

**Active Rules:**
```javascript
{
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': 'error',
  'no-eval': 'error',
  'no-implied-eval': 'error'
}
```

---

## Third-Party Service Security

### Formspree (Contact Form)

**Security Features:**
- HTTPS-only endpoints
- Built-in spam protection
- Rate limiting
- Email validation
- IP blocking for abusers

**Recommended Configuration:**

1. **Enable reCAPTCHA:**
   ```html
   <!-- Add to Formspree dashboard -->
   reCAPTCHA v3 enabled
   ```

2. **Set Rate Limits:**
   ```
   Formspree Dashboard → Settings
   - Max submissions per IP: 3 per hour
   - Max submissions per email: 5 per day
   ```

3. **Enable Honeypot:**
   ```html
   <!-- Formspree automatically handles honeypot fields -->
   ```

### Sentry (Error Tracking - Optional)

**Security Features:**
- HTTPS-only communication
- No PII (Personally Identifiable Information) collected
- Error sanitization before sending
- Source map protection

**Configuration:**

```typescript
// main.tsx
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  beforeSend(event) {
    // Sanitize sensitive data
    if (event.request?.data) {
      delete event.request.data.password;
      delete event.request.data.email;
    }
    return event;
  },
});
```

---

## Environment Variable Management

### Environment Variables

**Required:**
- `VITE_FORM_ENDPOINT` - Formspree endpoint for contact form

**Optional:**
- `VITE_SENTRY_DSN` - Sentry error tracking DSN

**Security Best Practices:**

1. **Never commit `.env` files**

`.gitignore`:
```
.env
.env.local
.env.*.local
*.key
*.pem
secrets.json
credentials.json
```

2. **Use `.env.example` as template**

```bash
# .env.example
VITE_APP_ENV=development
VITE_FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

3. **Validate environment variables at runtime**

```typescript
// Validate critical env vars
const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT;
if (!formEndpoint || !formEndpoint.startsWith('https://')) {
  throw new Error('Invalid form endpoint: must be HTTPS URL');
}
```

### Secret Rotation Schedule

- **Formspree endpoint**: Annually or when compromised
- **Sentry DSN**: Annually or when compromised
- **API keys**: Every 180 days

---

## Deployment Security

### Hosting Security

**Recommended Hosting Providers:**
- Vercel (automatic HTTPS, DDoS protection)
- Netlify (automatic HTTPS, security headers)
- Cloudflare Pages (CDN, DDoS protection)

**Security Features to Enable:**
1. **HTTPS Only**
   - Force HTTPS redirect
   - Enable HSTS headers
   - Use TLS 1.3 minimum

2. **DDoS Protection**
   - Rate limiting at CDN level
   - Geographic restrictions (if needed)
   - Bot protection

3. **Security Headers**
   - See [Security Headers](#security-headers) section

### Build Security

**CI/CD Security:**

```yaml
# .github/workflows/ci.yml
- name: Security audit
  run: npm audit --audit-level=moderate

- name: Dependency check
  run: npm outdated

- name: Lint security
  run: npm run lint
```

---

## Content Security Policy

### Recommended CSP Headers

For hosting providers, configure these CSP headers:

```nginx
# Nginx configuration
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://cdn.sentry.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://formspree.io https://sentry.io;
  frame-src https://www.google.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self' https://formspree.io;
";
```

### CSP Directives Explained

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Only load resources from same origin by default |
| `script-src` | `'self' 'unsafe-inline' ...` | Allow scripts from self, inline, Google, Sentry |
| `style-src` | `'self' 'unsafe-inline'` | Allow styles from self and inline (Tailwind) |
| `img-src` | `'self' data: https:` | Allow images from self, data URIs, HTTPS |
| `connect-src` | `'self' https://formspree.io ...` | Allow API calls to self, Formspree, Sentry |
| `frame-ancestors` | `'none'` | Prevent clickjacking |
| `form-action` | `'self' https://formspree.io` | Allow form submissions to self and Formspree |

---

## Security Headers

### Recommended Security Headers

```nginx
# Nginx configuration
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
```

### Header Explanations

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Prevent clickjacking attacks |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `X-XSS-Protection` | `1; mode=block` | Enable browser XSS protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer information |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Disable unnecessary features |
| `Strict-Transport-Security` | `max-age=31536000; ...` | Force HTTPS for 1 year |

### Vercel Configuration

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

### Netlify Configuration

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

---

## Dependency Security

### Automated Security Audits

**npm audit:**
```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

**Current Status:** ✅ 0 vulnerabilities

**Automated Checks:**
- GitHub Dependabot enabled
- npm audit in CI/CD pipeline
- Weekly dependency reviews

### Dependency Management Best Practices

1. **Keep dependencies updated**
   ```bash
   npm update
   npm outdated
   ```

2. **Review dependency updates**
   - Check CHANGELOG for breaking changes
   - Test after updates
   - Use `npm audit` before merging

3. **Minimize dependencies**
   - Current: 6 direct dependencies
   - Peer dependencies from web-foundation
   - Avoid unnecessary packages

4. **Lock file integrity**
   - Always commit `package-lock.json`
   - Use `npm ci` in CI/CD
   - Never manually edit lock file

---

## Compliance

### OWASP Top 10 (2021) Compliance

| Risk | Status | Mitigation |
|------|--------|------------|
| A01: Broken Access Control | ✅ N/A | Static site, no authentication |
| A02: Cryptographic Failures | ✅ Protected | HTTPS enforced, no sensitive data storage |
| A03: Injection | ✅ Protected | DOMPurify, React auto-escaping, form validation |
| A04: Insecure Design | ✅ Protected | Secure architecture, code review |
| A05: Security Misconfiguration | ✅ Protected | ESLint rules, TypeScript strict, CSP headers |
| A06: Vulnerable Components | ✅ Protected | Regular audits, Dependabot, minimal deps |
| A07: Authentication Failures | ✅ N/A | No authentication in application |
| A08: Software Integrity | ✅ Protected | npm lock file, CI/CD checks |
| A09: Logging Failures | ✅ Protected | Sentry integration (optional) |
| A10: SSRF | ✅ N/A | No server-side requests |

### GDPR Compliance

**Data Processing:**
- Contact form: Collects name, email, message only
- No tracking cookies without consent
- Data sent to Formspree (GDPR-compliant service)
- No data stored in application

**User Rights:**
- Right to access: Contact Formspree support
- Right to deletion: Contact Formspree support
- Right to data portability: Email exports available
- Privacy policy provided at `/privacy`

**Recommended Actions:**
1. Add cookie consent banner if using analytics
2. Update privacy policy with Formspree data handling
3. Provide contact email for data requests
4. Document data retention policies

---

## Incident Response

### In Case of Security Breach

1. **Immediate Actions:**
   - Notify security team (security@krisarmstrong.com)
   - Document the incident
   - Preserve evidence
   - Assess impact

2. **Containment:**
   - Take affected services offline if necessary
   - Rotate compromised credentials
   - Deploy emergency patch

3. **Communication:**
   - Notify affected users (if applicable)
   - Create public disclosure (if warranted)
   - Update security advisory

4. **Recovery:**
   - Apply permanent fix
   - Deploy updated version
   - Update documentation

5. **Post-Incident:**
   - Conduct root cause analysis
   - Implement additional protections
   - Update security procedures
   - Document lessons learned

---

## Security Checklist

### Pre-Deployment Checklist

- [ ] Environment variables configured in hosting provider
- [ ] HTTPS enabled and enforced
- [ ] Security headers configured
- [ ] CSP headers configured
- [ ] Formspree rate limiting enabled
- [ ] Formspree reCAPTCHA enabled (recommended)
- [ ] Sentry configured (if using error tracking)
- [ ] npm audit passes with 0 vulnerabilities
- [ ] ESLint passes with no security warnings
- [ ] TypeScript compiles with no errors
- [ ] `.env` files not committed to git
- [ ] Privacy policy updated
- [ ] Terms of service updated

### Regular Maintenance Checklist

- [ ] Weekly: Review Sentry errors
- [ ] Weekly: Check Formspree submissions for spam
- [ ] Monthly: Run `npm audit` and update dependencies
- [ ] Monthly: Review security headers with securityheaders.com
- [ ] Quarterly: Review and rotate API keys
- [ ] Annually: Full security audit

---

## Security Resources

### Tools

- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Dependency vulnerability scanning
- [Snyk](https://snyk.io/) - Continuous security monitoring
- [OWASP ZAP](https://www.zaproxy.org/) - Web application security scanner
- [SecurityHeaders.com](https://securityheaders.com/) - Security header checker

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/learn/security)
- [Formspree Security](https://help.formspree.io/hc/en-us/articles/360055613373-Security)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

## Security Contact

- **Email:** security@krisarmstrong.com
- **Response Time:** Within 48 hours
- **PGP Key:** Available on request

---

## Version History

| Version | Date | Security Updates |
|---------|------|------------------|
| 1.0.0 | 2025-01-18 | Initial security documentation |

---

**Last Updated:** 2025-01-18
**Maintainer:** Kris Armstrong
**Security Contact:** security@krisarmstrong.com
