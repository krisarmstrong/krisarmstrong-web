# Contributing to Intrinsic Momentum Mindset

Thank you for your interest in contributing to the Intrinsic Momentum Mindset website!

## Development Setup

### Prerequisites
- Node.js >= 22.0.0
- npm or yarn

### Initial Setup

1. Fork and clone the repository
   ```bash
   git clone https://github.com/krisarmstrong/intrinsicmomentummindset-com.git
   cd intrinsicmomentummindset-com
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3001`

## Development Workflow

### Making Changes

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
   - Follow the existing code style
   - Write clear, descriptive commit messages
   - Add tests for new functionality
   - Update documentation as needed

3. Run tests and linting
   ```bash
   npm test
   npm run lint
   npm run build  # Ensure production build succeeds
   ```

4. Commit your changes
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

## Code Guidelines

### TypeScript
- Use TypeScript for all new code
- Avoid `any` types - use proper type definitions
- Export types for reusable interfaces
- Add JSDoc comments for complex functions

### React Components
- Use functional components with hooks
- Follow React best practices
- Ensure components are accessible (WCAG 2.1 AA)
- Support both light and dark themes via shared web-foundation
- Keep components focused and composable

### Styling
- Use Tailwind CSS utility classes
- Follow the theme system from @krisarmstrong/web-foundation
- Use CSS custom properties for theme values
- Ensure responsive design (mobile-first)

### Accessibility
- All interactive elements must be keyboard accessible
- Include proper ARIA labels and roles
- Ensure sufficient color contrast
- Test with screen readers when possible

### Security
- Never commit secrets or API keys
- Sanitize all user inputs
- Validate form data on both client and server
- Follow secure coding practices

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples
```
feat(register): add comprehensive form validation

- Added validation utility functions
- Implemented client-side validation for all form fields
- Added proper error messages and UX feedback
- Validates PayPal URLs before redirect

Closes #123
```

## Pull Request Process

1. Update the README.md or relevant documentation with details of changes
2. Add entry to CHANGELOG.md under "Unreleased"
3. Ensure all tests pass and code follows style guidelines
4. Update types and interfaces as needed
5. Request review from maintainers
6. Address review feedback promptly

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] No console.log statements in production code
- [ ] Accessibility considerations addressed
- [ ] Security implications reviewed

## Testing

### Running Tests
```bash
npm test                 # Run test suite
npm run test:coverage    # Run with coverage report
npm run test:watch       # Run in watch mode
```

### Writing Tests
- Write tests for all new features
- Aim for high coverage on critical paths
- Test edge cases and error conditions
- Use descriptive test names

## Project Structure

```
intrinsicmomentummindset-com/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components (minimal - mostly use web-foundation)
│   ├── config/          # Configuration files
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions (validation, etc.)
│   ├── __tests__/       # Test files
│   ├── App.tsx          # Root App component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variable template
├── .github/             # GitHub Actions workflows
└── package.json         # Dependencies and scripts
```

## Component Guidelines

### Using Shared Components
This project uses `@krisarmstrong/web-foundation` for shared UI components. Always prefer using components from the shared library rather than creating new ones:

- Use `Button` from web-foundation
- Use `PageShell` for layout consistency
- Use `Footer` and `Navbar` for navigation
- Use `ContactForm` for contact pages

### Creating New Components
Only create new components when:
- Functionality is specific to this site
- No suitable component exists in web-foundation
- Component is truly reusable

## Environment Variables

Required environment variables (see `.env.example`):

```env
# Contact Form
VITE_FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID

# PayPal Payment Links
VITE_PAYPAL_INTRINSIC_FOUNDATIONS=
VITE_PAYPAL_INTRINSIC_MOMENTUM=
VITE_PAYPAL_MINDSET_IMMERSION=

# Error Tracking (Optional)
VITE_SENTRY_DSN=
VITE_APP_ENV=development
```

## Questions or Need Help?

- Open an issue for bugs or feature requests
- Contact: contact@intrinsicmomentummindset.com
- Review existing issues and PRs before creating new ones

## Code of Conduct

- Be respectful and professional
- Provide constructive feedback
- Focus on the code, not the person
- Help create a welcoming environment

## License

By contributing to this project, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

**Author**: Kris Armstrong
**Last Updated**: November 2025
