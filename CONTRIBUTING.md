# Contributing to Kris Armstrong Web

Thank you for your interest in contributing! This document provides guidelines and workflows for contributing to this project.

## Development Workflow

### Getting Started

```bash
# Clone the repository
git clone <your-repo-url>
cd krisarmstrong-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

**Format:** `type(scope): subject`

**Types:**

- `feat`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump)
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

**Examples:**

```bash
git commit -m "feat(navbar): add dark mode toggle"
git commit -m "fix(button): resolve click handler issue"
git commit -m "docs: update README with new examples"
```

**Breaking Changes:**

```bash
git commit -m "feat(api)!: redesign authentication flow

BREAKING CHANGE: Auth tokens now require bearer prefix"
```

### Git Hooks

This project uses Husky for automated Git hooks:

#### Pre-commit

- Runs `lint-staged` to:
  - Lint and format TypeScript/JavaScript files
  - Format JSON, Markdown, YAML files
  - Run security audit on package.json changes

#### Commit-msg

- Validates commit message format
- Ensures conventional commit compliance

#### Pre-push

- Runs full build
- Runs all tests
- Ensures code quality before pushing

### Branch Strategy

- `main/master` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Pull Request Process

1. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests for new features
   - Update documentation

3. **Commit with conventional commits**

   ```bash
   git commit -m "feat: add new feature"
   ```

4. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Describe your changes
   - Link related issues
   - Ensure CI passes

### Code Quality Standards

#### Linting

```bash
# Check linting
npm run lint

# Auto-fix issues
npm run lint:fix
```

#### Formatting

```bash
# Check formatting
npm run format:check

# Auto-format
npm run format
```

#### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch --workspace=<workspace>

# Run tests with coverage
npm run test:coverage --workspace=<workspace>
```

#### Security

```bash
# Run security audit
npm run audit:security

# Run CI security check
npm run audit:ci
```

### Automated Release Process

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and releases.

**How it works:**

1. Merge to `main/master` triggers release workflow
2. Analyzes commit messages since last release
3. Determines version bump (major.minor.patch)
4. Generates CHANGELOG.md
5. Creates Git tag
6. Publishes GitHub release

**Version Bumps:**

- `fix:` → Patch (1.0.0 → 1.0.1)
- `feat:` → Minor (1.0.0 → 1.1.0)
- `BREAKING CHANGE:` → Major (1.0.0 → 2.0.0)

### CI/CD Pipeline

#### On Push/PR

- Linting
- Tests (Node 18.x, 20.x, 22.x)
- Build verification
- Security audit
- Commit message validation (PRs only)

#### On Merge to Main

- Full test suite
- Production build
- Automated release
- Changelog update
- GitHub release creation

#### Weekly

- CodeQL security scanning
- Dependency vulnerability checks

### Testing Guidelines

- Write tests for all new features
- Maintain >80% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

```typescript
describe('Component', () => {
  it('should render correctly', () => {
    // Arrange
    const props = { ... };

    // Act
    render(<Component {...props} />);

    // Assert
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

### Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Update CHANGELOG.md via conventional commits
- Add examples for new features

### Need Help?

- Check existing issues and PRs
- Read the README.md
- Ask questions in issues
- Review test files for examples

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on what's best for the project
- Show empathy towards others

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
