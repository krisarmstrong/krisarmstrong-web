# Security Policy - Web Foundation

## Security Overview

Web Foundation takes security seriously and implements multiple layers of protection to prevent common vulnerabilities.

**Security Grade: A+**

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

### 1. Input Sanitization

**DOMPurify Integration:**
- All user-generated content is sanitized before rendering
- HTML injection protection
- XSS attack prevention

```typescript
import DOMPurify from 'dompurify';

// Safe rendering of user content
const sanitized = DOMPurify.sanitize(userContent);
```

**Locations:**
- `Error.tsx` - Error message sanitization
- `ContactForm.tsx` - Form data validation

### 2. XSS Prevention

**React Auto-Escaping:**
- All dynamic content auto-escaped by React
- No `dangerouslySetInnerHTML` without sanitization
- Template literals are safe by default

**Manual Checks:**
```tsx
// ✅ Safe
<div>{userInput}</div>

// ❌ Unsafe (never do this)
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Safe (with DOMPurify)
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### 3. CSS Injection Prevention

**Theme Color Validation:**
- All CSS custom properties validated before injection
- Prevents malicious CSS values
- Warns on invalid colors

```typescript
// src/context/ThemeContext.tsx
function isValidCSSColor(color: string): boolean {
  // Validates CSS color before applying
}
```

### 4. Dependency Security

**Regular Audits:**
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

### 5. Type Safety

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

### 6. ESLint Security Rules

**Active Plugins:**
- `eslint-plugin-security` - Detects security anti-patterns
- `eslint-plugin-no-secrets` - Prevents credential leaks

**Enforced Rules:**
```javascript
'no-secrets/no-secrets': 'error',
'security/detect-object-injection': 'off', // False positives in React
```

---

## Consumer Application Security

### Content Security Policy (CSP)

Recommended CSP headers for applications using web-foundation:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.sentry.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://sentry.io https://formspree.io;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

### Rate Limiting

**Contact Form Rate Limiting:**

Implement rate limiting on your backend endpoint:

```javascript
// Express example
const rateLimit = require('express-rate-limit');

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 submissions per 15 minutes
  message: 'Too many submissions, please try again later.'
});

app.post('/api/contact', formLimiter, handleContactForm);
```

### CAPTCHA Integration

**Recommended for ContactForm:**

```tsx
import { ContactForm } from '@krisarmstrong/web-foundation';
import ReCAPTCHA from 'react-google-recaptcha';

function ProtectedContactForm() {
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleSubmit = async (data) => {
    if (!captchaToken) {
      alert('Please complete the CAPTCHA');
      return;
    }
    // Include captchaToken in submission
  };

  return (
    <>
      <ContactForm endpoint="/api/contact" onSubmit={handleSubmit} />
      <ReCAPTCHA
        sitekey="YOUR_SITE_KEY"
        onChange={setCaptchaToken}
      />
    </>
  );
}
```

### CSRF Protection

**FormData POST Pattern:**
```tsx
// Built-in CSRF protection via FormData
const formData = new FormData(form);
fetch(endpoint, {
  method: 'POST',
  body: formData
});
```

**Double-Submit Cookie Pattern:**
```javascript
// Backend implementation
app.use(csrfProtection);

app.post('/api/contact', (req, res) => {
  // CSRF token validated automatically
});
```

---

## Secure Deployment

### Environment Variables

**Never commit:**
- API keys
- Authentication tokens
- Database credentials
- Third-party service keys

**Use `.gitignore`:**
```
.env
.env.local
.env.*.local
*.key
*.pem
secrets.json
credentials.json
```

**Example `.env` structure:**
```bash
# Public - Can be committed
VITE_APP_NAME=MyApp
VITE_APP_VERSION=1.0.0

# Private - Never commit
VITE_SENTRY_DSN=https://...
VITE_FORM_ENDPOINT=https://...
VITE_API_KEY=secret_key_here
```

### Secret Rotation

See [SECRET_ROTATION.md](./SECRET_ROTATION.md) for comprehensive rotation procedures.

**Rotation Schedule:**
- NPM tokens: Every 90 days
- API keys: Every 180 days
- Form endpoints: As needed
- Analytics keys: Annually

---

## Security Best Practices

### For Library Consumers

1. **Keep Dependencies Updated**
   ```bash
   npm update @krisarmstrong/web-foundation
   ```

2. **Validate Form Endpoints**
   ```tsx
   // Validate URL before using
   const endpoint = process.env.VITE_FORM_ENDPOINT;
   if (!endpoint || !endpoint.startsWith('https://')) {
     throw new Error('Invalid form endpoint');
   }
   ```

3. **Use HTTPS Only**
   - Never use HTTP in production
   - Enforce HTTPS redirects
   - Enable HSTS headers

4. **Sanitize User Inputs**
   ```tsx
   // Even though web-foundation does this, double-check on backend
   const sanitized = DOMPurify.sanitize(userInput);
   ```

5. **Implement Authentication**
   - Use OAuth 2.0 or JWT
   - Never store passwords in plain text
   - Implement proper session management

### For Library Contributors

1. **Never Use `eval()`**
   ```typescript
   // ❌ Never do this
   eval(userCode);
   new Function(userCode)();

   // ✅ Use safe alternatives
   JSON.parse(data);
   ```

2. **Avoid `dangerouslySetInnerHTML`**
   ```tsx
   // ✅ Always sanitize first
   <div dangerouslySetInnerHTML={{
     __html: DOMPurify.sanitize(content)
   }} />
   ```

3. **Validate All Props**
   ```typescript
   // Use TypeScript + runtime validation
   interface Props {
     url: string; // Type check
   }

   // Runtime check
   if (!url.startsWith('https://')) {
     throw new Error('Invalid URL');
   }
   ```

4. **No Secrets in Code**
   ```typescript
   // ❌ Never
   const API_KEY = 'sk_live_12345';

   // ✅ Always
   const API_KEY = process.env.VITE_API_KEY;
   ```

---

## Vulnerability Scanning

### Automated Tools

1. **npm audit**
   ```bash
   npm audit --audit-level=moderate
   ```

2. **ESLint Security**
   ```bash
   npm run lint
   ```

3. **Snyk (Optional)**
   ```bash
   npx snyk test
   ```

4. **OWASP Dependency Check**
   ```bash
   dependency-check --project web-foundation --scan .
   ```

### Manual Security Reviews

**Pre-Release Checklist:**
- [ ] No hardcoded secrets
- [ ] All user inputs sanitized
- [ ] Dependencies updated
- [ ] npm audit passes
- [ ] ESLint security rules pass
- [ ] No `eval()` or `Function()` constructors
- [ ] All `dangerouslySetInnerHTML` sanitized
- [ ] CHANGELOG updated with security fixes

---

## Compliance

### OWASP Top 10 (2021) Compliance

| Risk | Status | Mitigation |
|------|--------|------------|
| A01: Broken Access Control | ✅ N/A | Library component |
| A02: Cryptographic Failures | ✅ Protected | No sensitive data storage |
| A03: Injection | ✅ Protected | DOMPurify, input validation |
| A04: Insecure Design | ✅ Protected | Secure patterns, code review |
| A05: Security Misconfiguration | ✅ Protected | ESLint rules, strict TypeScript |
| A06: Vulnerable Components | ✅ Protected | Regular audits, Dependabot |
| A07: Authentication Failures | ✅ N/A | No authentication in library |
| A08: Software Integrity | ✅ Protected | Signed packages, provenance |
| A09: Logging Failures | ✅ Protected | Sentry integration, error tracking |
| A10: SSRF | ✅ N/A | No server-side requests |

### GDPR Compliance

**Data Processing:**
- ContactForm: Collects name, email, message only
- No tracking cookies without consent
- Data sent to user-specified endpoint only
- No data stored in library

**User Rights:**
- Consumers must implement data deletion
- Consumers must implement data export
- Consumers must provide privacy policy

---

## Security Headers

### Recommended Headers for Deployment

```nginx
# nginx configuration
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
```

```javascript
// Express middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
}));
```

---

## Incident Response

### In Case of Security Breach

1. **Immediate Actions:**
   - Notify security team
   - Document the incident
   - Preserve evidence
   - Assess impact

2. **Containment:**
   - Isolate affected systems
   - Rotate compromised credentials
   - Deploy emergency patch

3. **Communication:**
   - Notify affected users (if applicable)
   - Create public disclosure
   - Update security advisory

4. **Recovery:**
   - Apply permanent fix
   - Release security update
   - Update documentation

5. **Post-Incident:**
   - Conduct root cause analysis
   - Implement additional protections
   - Update security procedures

---

## Security Contact

- **Email:** security@krisarmstrong.com
- **Response Time:** Within 48 hours
- **PGP Key:** Available on request

---

## Version History

| Version | Date | Security Updates |
|---------|------|------------------|
| 0.9.7 | 2025-11-18 | CSS injection prevention, color validation |
| 0.9.0 | 2025-11-16 | DOMPurify integration, input sanitization |
| 0.8.0 | 2025-11-15 | ESLint security rules, dependency audit |

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
- [React Security Best Practices](https://react.dev/learn/security)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)

---

**Last Updated:** 2025-11-18
**Maintainer:** Kris Armstrong
**Security Contact:** security@krisarmstrong.com
