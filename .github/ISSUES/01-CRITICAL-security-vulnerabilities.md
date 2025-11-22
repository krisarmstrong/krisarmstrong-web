---
title: "🔴 CRITICAL: Fix high severity npm audit vulnerabilities in semantic-release"
labels: security, critical, dependencies
assignees: krisarmstrong
---

## Priority: CRITICAL 🔴

**Impact:** 4 high severity vulnerabilities affecting semantic-release dependency chain

## Vulnerability Details

```
glob 10.2.0 - 10.4.5 || 11.0.0 - 11.0.3
└── npm 7.21.0 - 8.5.4 || >=9.6.6
    └── @semantic-release/npm >=11.0.0
        └── semantic-release >=22.0.0-beta.1
```

**CVE:** Command injection vulnerability in glob CLI (GHSA-5j98-mcp5-4vw2)

## Files Affected
- `package.json:32` (@semantic-release/npm: ^13.1.2)
- `packages/web-foundation/package.json:98` (semantic-release: ^25.0.2)

## Action Required

1. Run security audit:
   ```bash
   npm audit --audit-level=moderate
   ```

2. Attempt automatic fix:
   ```bash
   npm audit fix --force
   ```

3. If automatic fix fails, manually downgrade semantic-release or update glob dependency

4. Test release process after fix:
   ```bash
   npm run release:dry
   ```

5. Verify CI/CD pipeline still works

## Testing Checklist
- [ ] npm audit shows 0 high severity vulnerabilities
- [ ] Semantic release dry-run succeeds
- [ ] CI/CD pipeline passes
- [ ] All apps build successfully
- [ ] Release workflow tested on test branch

## References
- https://github.com/advisories/GHSA-5j98-mcp5-4vw2
- Security policy: SECURITY.md
