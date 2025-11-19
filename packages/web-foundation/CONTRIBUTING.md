# Contributing to @krisarmstrong/web-foundation

Thank you for your interest in contributing to the Web Foundation framework!

## Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/krisarmstrong/web-foundation.git
   cd web-foundation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development mode:
   ```bash
   npm run dev
   ```

4. Make your changes in the `src/` directory

5. Build to verify:
   ```bash
   npm run build
   ```

## Project Structure

```
web-foundation/
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # Base UI components (Button, Card, etc.)
│   │   └── *.tsx      # Layout & feature components
│   ├── hooks/         # React hooks
│   ├── context/       # React context providers
│   ├── themes/        # Theme configurations for each site
│   ├── constants/     # Shared constants
│   ├── utils/         # Utility functions
│   ├── types.ts       # TypeScript type definitions
│   ├── tokens.ts      # Design tokens
│   └── index.ts       # Main export file
├── dist/              # Build output (generated)
└── package.json
```

## Supported Sites

This framework provides shared components for:
- **wifivigilante.com** - WiFi security & pentesting (emerald/blue theme)
- **krisarmstrong.org** - Personal portfolio (violet/blue theme)
- **intrinsicmomentummindset.com** - Coaching services (sage/gold theme)

## Component Guidelines

### Accessibility First
- All components **must** be accessible (WCAG 2.1 AA minimum)
- Include proper ARIA attributes
- Support keyboard navigation
- Test with screen readers
- Provide skip links where appropriate

### Theme Support
- Components should accept optional `theme` prop ('dark' | 'light')
- Use `themeTokens` for colors, not hardcoded values
- Support both ThemeProvider context and prop-based theming
- Test components in both light and dark modes

### TypeScript
- Use TypeScript for all new code
- Export types for all component props
- Add JSDoc comments to public APIs
- Use strict type checking

### Styling
- Use Tailwind CSS classes
- Inline styles only for theme-specific colors
- No hardcoded colors - use theme tokens
- Follow existing component patterns

## Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Write your code**:
   - Follow existing code style
   - Add JSDoc comments
   - Ensure accessibility

3. **Build and test**:
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

## Commit Message Format

Follow [Conventional Commits](https://conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add StarRating component
fix: correct aria-label in Button loading state
docs: update README with ContactForm examples
refactor: extract shared theme utilities
```

## Pull Request Process

1. **Update documentation**:
   - Add component to README's "Available components" section
   - Add usage examples
   - Update CHANGELOG.md under "Unreleased"

2. **Ensure quality**:
   - Code builds without errors
   - No TypeScript errors
   - Follows existing patterns

3. **Submit PR**:
   - Clear description of changes
   - Reference any related issues
   - Screenshots for UI changes

## Adding New Components

When adding a new component:

1. **Create the component file**:
   ```tsx
   // src/components/YourComponent.tsx
   import type { ReactNode } from 'react';

   export interface YourComponentProps {
     /** Description of prop */
     propName: string;
     /** Optional theme override */
     theme?: 'dark' | 'light';
   }

   /**
    * YourComponent - Brief description
    *
    * @example
    * ```tsx
    * <YourComponent propName="value" />
    * ```
    */
   export function YourComponent({ propName, theme = 'dark' }: YourComponentProps) {
     // Implementation
   }
   ```

2. **Export from index.ts**:
   ```typescript
   export { YourComponent } from './components/YourComponent';
   export type { YourComponentProps } from './components/YourComponent';
   ```

3. **Add to README**:
   - List in "Available components" section
   - Add usage example

4. **Update CHANGELOG.md**:
   - Add entry under "Unreleased" section

## Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Prefer arrow functions
- Use destructuring where appropriate

## Questions or Issues?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Tag @krisarmstrong for urgent matters

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
