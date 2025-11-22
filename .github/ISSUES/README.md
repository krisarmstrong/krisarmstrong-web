# GitHub Issues for krisarmstrong-web Monorepo

This directory contains issue templates ready to be imported into GitHub.

## How to Create These Issues

### Option 1: Using GitHub CLI (Recommended)

First, add your GitHub remote if you haven't already:

```bash
git remote add origin https://github.com/YOUR_USERNAME/krisarmstrong-web.git
```

Then create all issues at once:

```bash
# Navigate to the ISSUES directory
cd .github/ISSUES

# Create each issue
for file in *.md; do
  if [ "$file" != "README.md" ]; then
    gh issue create --body-file "$file"
  fi
done
```

### Option 2: Manual Copy-Paste

1. Go to your repository on GitHub
2. Click "Issues" → "New Issue"
3. Copy the content from each `.md` file
4. Paste into the issue body
5. Add labels manually (they're listed in the frontmatter)
6. Create the issue

### Option 3: Bulk Import Script

```bash
#!/bin/bash
# create-all-issues.sh

for file in .github/ISSUES/*.md; do
  if [ "$file" != ".github/ISSUES/README.md" ]; then
    echo "Creating issue from $file..."
    gh issue create --body-file "$file"
    sleep 1  # Rate limiting
  fi
done
```

## Issue Priority Guide

- **🔴 CRITICAL (01-03):** Fix immediately - security, broken functionality, blocking issues
- **🟠 HIGH (04-07):** Next sprint - significant improvements, code quality
- **🟡 MEDIUM (08-10):** Backlog - quality of life, consistency improvements
- **🟢 LOW (11-12):** Nice to have - polish, minor inconsistencies

## Issues Overview

| # | Priority | Title | Estimated Impact |
|---|----------|-------|------------------|
| 01 | 🔴 CRITICAL | Fix npm audit vulnerabilities | Security |
| 02 | 🔴 CRITICAL | Standardize theme system | Fixes styling bugs |
| 03 | 🔴 CRITICAL | Add security plugins to Intrinsic | Security |
| 04 | 🟠 HIGH | Create shared ESLint base config | -60 lines, consistency |
| 05 | 🟠 HIGH | Move validation utilities to web-foundation | -400 lines |
| 06 | 🟠 HIGH | Create shared build configs | -300 lines |
| 07 | 🟠 HIGH | Improve test coverage | Quality gates |
| 08 | 🟡 MEDIUM | Standardize TypeScript strictness | Type safety |
| 09 | 🟡 MEDIUM | Create shared test utilities | -130 lines |
| 10 | 🟡 MEDIUM | Restore documentation | Documentation |
| 11 | 🟢 LOW | Standardize code style | Consistency |
| 12 | 🟢 LOW | Remove social icons duplication | -40 lines |

**Total Code Reduction:** ~930 lines

## Labels to Create in GitHub

Before creating issues, ensure these labels exist:

```bash
gh label create "critical" --color "d73a4a" --description "Critical priority"
gh label create "high-priority" --color "ff6b6b" --description "High priority"
gh label create "medium-priority" --color "ffa500" --description "Medium priority"
gh label create "low-priority" --color "90ee90" --description "Low priority"
gh label create "security" --color "ee0701" --description "Security related"
gh label create "css" --color "0052cc" --description "CSS/styling issues"
gh label create "tailwind" --color "38bdf8" --description "Tailwind CSS"
gh label create "refactor" --color "fbca04" --description "Code refactoring"
gh label create "bug" --color "d73a4a" --description "Something isn't working"
gh label create "dependencies" --color "0366d6" --description "Dependency updates"
gh label create "eslint" --color "4b32c3" --description "ESLint configuration"
gh label create "testing" --color "1d76db" --description "Testing related"
gh label create "documentation" --color "0075ca" --description "Documentation"
gh label create "typescript" --color "3178c6" --description "TypeScript"
gh label create "build-config" --color "000000" --description "Build configuration"
gh label create "code-duplication" --color "fbca04" --description "Duplicate code"
gh label create "tooling" --color "d4c5f9" --description "Developer tooling"
gh label create "quality" --color "1d76db" --description "Code quality"
gh label create "ci" --color "28a745" --description "Continuous Integration"
gh label create "dx" --color "7057ff" --description "Developer Experience"
gh label create "code-style" --color "c5def5" --description "Code style/formatting"
gh label create "web-foundation" --color "ff9800" --description "Shared component library"
gh label create "intrinsic" --color "8b9a7e" --description "Intrinsic app"
```

## Recommended Order of Execution

### Week 1: Critical Security & Theme Issues
1. Issue #01 - Security vulnerabilities (CRITICAL)
2. Issue #03 - Security plugins (CRITICAL)
3. Issue #02 - Theme standardization (CRITICAL - this is your biggest pain point)

### Week 2: Code Deduplication
4. Issue #04 - ESLint standardization (HIGH)
5. Issue #05 - Validation utilities (HIGH)
6. Issue #06 - Shared build configs (HIGH)

### Week 3: Testing & Quality
7. Issue #07 - Test coverage (HIGH)
8. Issue #09 - Shared test utilities (MEDIUM)

### Week 4: Polish & Documentation
9. Issue #08 - TypeScript strictness (MEDIUM)
10. Issue #10 - Documentation (MEDIUM)
11. Issue #11 - Code style (LOW)
12. Issue #12 - Social icons (LOW)

## After Creating Issues

1. **Create milestones:**
   - "Critical Fixes" (Issues 1-3)
   - "Code Quality Sprint" (Issues 4-7)
   - "Testing & Polish" (Issues 8-12)

2. **Assign issues:**
   All issues are pre-assigned to `@me` in the templates

3. **Create project board:**
   - Todo: All new issues
   - In Progress: Issues being worked on
   - Done: Completed issues

4. **Link related issues:**
   Some issues depend on others (noted in their descriptions)

## Questions?

If you need help with any issue, refer to the comprehensive analysis report or ask for clarification.
