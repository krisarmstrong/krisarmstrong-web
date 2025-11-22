# Secret Rotation Guide

This document outlines the process for rotating secrets and API keys across the project ecosystem.

## Overview

Regular secret rotation is a critical security practice that limits the window of opportunity for compromised credentials. This project implements automated reminders and provides clear procedures for manual rotation.

## Secrets Inventory

### Web Foundation

- **NPM Token** (`NPM_TOKEN`)
  - Purpose: Publishing packages to npm registry
  - Rotation Frequency: Every 90 days
  - Location: GitHub repository secrets
  - Impact: Publishing workflow will fail

### Consuming Projects

- **Formspree Endpoint** (`VITE_FORMSPREE_ENDPOINT`)
  - Purpose: Contact form submissions
  - Rotation Frequency: As needed (security incident)
  - Location: `.env` files (not committed)
  - Impact: Contact forms will fail to submit

- **Analytics Keys** (Google Analytics, Plausible)
  - Purpose: User analytics tracking
  - Rotation Frequency: Annually or on security incident
  - Location: Environment variables
  - Impact: Analytics data collection stops

## Rotation Procedures

### NPM Token

#### Prerequisites

- Access to npm account
- Repository admin access for GitHub secrets

#### Steps

1. **Generate New Token**

   ```bash
   npm login
   npm token create --type=publish
   ```

2. **Update GitHub Secret**
   - Go to repository Settings → Secrets and variables → Actions
   - Update `NPM_TOKEN` with new value

3. **Test Publishing Workflow**
   - Create a test release or manually trigger publish workflow
   - Verify successful publication

4. **Revoke Old Token**

   ```bash
   npm token list
   npm token revoke <old-token-id>
   ```

5. **Document Rotation**
   - Record rotation date in internal tracking system
   - Update next rotation reminder

### Formspree Endpoint

#### Prerequisites

- Access to Formspree account
- Access to project environment variables

#### Steps

1. **Create New Formspree Form**
   - Log in to Formspree dashboard
   - Create new form or regenerate endpoint
   - Copy new endpoint URL

2. **Update Environment Variables**
   For each project (krisarmstrong-org, wifivigilante-com):

   ```bash
   # Update .env file
   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/new-endpoint
   ```

3. **Update Deployment Platforms**
   If deployed (e.g., Vercel, Netlify):
   - Update environment variables in platform dashboard
   - Trigger new deployment

4. **Test Contact Forms**
   - Visit each site's contact page
   - Submit test form
   - Verify submission in Formspree dashboard

5. **Deactivate Old Form**
   - Mark old form as inactive in Formspree
   - Monitor for any failed submissions

### Analytics Keys

#### Google Analytics

1. Go to Google Analytics Admin
2. Data Streams → Select stream → Configure measurement ID
3. Generate new measurement ID if needed
4. Update `GA_MEASUREMENT_ID` in environment variables
5. Deploy and test tracking

#### Plausible Analytics

1. Log in to Plausible dashboard
2. Site Settings → rotate API key if needed
3. Update environment variables
4. Deploy and verify tracking

## Automated Monitoring

### Secret Scanning

- **Gitleaks** runs on every push and PR
- Scans for accidentally committed secrets
- Blocks merges if secrets detected

### Rotation Reminders

- Quarterly reminders via GitHub Actions
- Creates issues for upcoming rotations
- Tracks last rotation dates

## Emergency Rotation

If a secret is compromised:

1. **Immediate Actions**
   - Revoke compromised secret immediately
   - Generate new secret
   - Update all locations (GitHub, environment variables, deployment platforms)
   - Deploy changes immediately

2. **Investigation**
   - Review access logs for unauthorized use
   - Determine scope of compromise
   - Identify how secret was exposed

3. **Communication**
   - Notify team of compromise
   - Document incident
   - Update rotation procedures if needed

4. **Prevention**
   - Review code for secret exposure
   - Update gitignore patterns
   - Add pre-commit hooks if needed

## Best Practices

### Storage

- ✅ **DO**: Store secrets in GitHub Secrets
- ✅ **DO**: Use environment variables
- ✅ **DO**: Use `.env` files (add to `.gitignore`)
- ❌ **DON'T**: Commit secrets to version control
- ❌ **DON'T**: Share secrets in Slack/email
- ❌ **DON'T**: Hard-code secrets in source code

### Access Control

- Limit secret access to necessary team members
- Use separate secrets for dev/staging/production
- Implement least-privilege access

### Audit Trail

- Document all rotations with date and operator
- Maintain log of rotation history
- Review access patterns periodically

## Tools & Resources

### Secret Management Tools

- **GitHub Secrets**: Built-in encrypted storage
- **Doppler**: Secret management platform
- **AWS Secrets Manager**: Cloud-based secret storage
- **HashiCorp Vault**: Self-hosted secret management

### Scanning Tools

- **Gitleaks**: Secret scanning (currently implemented)
- **TruffleHog**: Git history secret scanner
- **git-secrets**: Pre-commit hook for secrets

### Automation

- **Dependabot**: Automated dependency updates
- **GitHub Actions**: Rotation reminders and workflows
- **Renovate**: Alternative to Dependabot

## Troubleshooting

### Publishing Fails After Rotation

- Verify new NPM token has publish permissions
- Check token hasn't expired
- Ensure GitHub secret name is exactly `NPM_TOKEN`

### Contact Forms Not Working

- Verify Formspree endpoint in `.env` file
- Check deployment platform has updated env vars
- Test endpoint directly with curl
- Review Formspree dashboard for errors

### Analytics Not Tracking

- Verify measurement ID is correct
- Check browser console for errors
- Ensure analytics script is loaded
- Test with analytics debugger

## Rotation Schedule

| Secret              | Frequency | Last Rotated | Next Due | Owner           |
| ------------------- | --------- | ------------ | -------- | --------------- |
| NPM_TOKEN           | 90 days   | -            | -        | Project Admin   |
| Formspree Endpoints | As needed | -            | -        | Site Owners     |
| GA Measurement IDs  | 365 days  | -            | -        | Analytics Admin |

## Contact

For questions about secret rotation:

- Open an issue with label `security`
- Contact repository administrators
- Review GitHub Security documentation

## References

- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [NPM Token Management](https://docs.npmjs.com/about-access-tokens)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
