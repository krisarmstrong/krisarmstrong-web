# Contributing Guide

## Welcome

Thank you for your interest in contributing to Wi-Fi Vigilante! This guide will help you get started with contributing code, documentation, design, or content to the project.

## Code of Conduct

Please maintain professional and respectful communication in all project interactions. We aim to create a welcoming environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager
- Git for version control
- Basic understanding of React and modern JavaScript
- Familiarity with Tailwind CSS (helpful but not required)

### Setting Up Development Environment

1. Fork the repository on GitHub

2. Clone your fork:
```bash
git clone https://github.com/yourusername/wi-fi-vigilante.com.git
cd wi-fi-vigilante.com
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

5. Start development server:
```bash
npm run dev
```

6. Open browser to `http://localhost:3000`

### Environment Setup

Create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `style/` - UI/styling changes
- `refactor/` - Code refactoring
- `test/` - Test additions
- `chore/` - Maintenance tasks

### Making Changes

1. Make your changes in the appropriate files
2. Test thoroughly in the browser
3. Ensure responsive design works
4. Update documentation if needed
5. Commit with clear messages

### Commit Message Guidelines

Follow conventional commits format:
```
type(scope): brief description

Detailed explanation of changes (if needed).
Include motivation and context.

Fixes #issue_number (if applicable)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style/formatting (not UI)
- `ui`: UI/styling changes
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Test additions
- `build`: Build system changes
- `chore`: Maintenance tasks

**Examples:**
```
feat(cases): add filtering by severity

Added dropdown to filter cases by severity level.
Includes UI updates and state management.

fix(search): correct search results ordering

Fixed bug where search results were not sorted by
relevance score. Now properly orders by relevance.

Fixes #23

ui(home): improve mobile responsiveness

Updated home page layout to better handle small screens.
Adjusted grid breakpoints and spacing.
```

## Coding Standards

### JavaScript/React Style

#### Component Structure

```javascript
// Imports
import { useState, useEffect } from 'react'
import { ComponentName } from './components'

// Component definition
function MyComponent({ prop1, prop2 }) {
  // Hooks
  const [state, setState] = useState(initial)

  useEffect(() => {
    // Side effects
  }, [dependencies])

  // Event handlers
  function handleClick() {
    // Handler logic
  }

  // Render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  )
}

// Export
export default MyComponent
```

#### Naming Conventions

- **Components**: PascalCase (e.g., `CaseCard`, `SearchBar`)
- **Functions**: camelCase (e.g., `fetchCases`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files**: PascalCase for components, camelCase for utilities

#### Best Practices

1. **Functional Components**: Use function components with hooks
2. **Prop Types**: Document prop expectations
3. **Destructuring**: Destructure props and state
4. **Early Returns**: Handle edge cases early
5. **Single Responsibility**: Keep components focused

**Example:**
```javascript
function CaseCard({ case }) {
  // Early return for loading state
  if (!case) return null

  // Destructure for cleaner code
  const { title, description, severity } = case

  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      <span className={`badge-${severity}`}>{severity}</span>
    </div>
  )
}
```

### Styling Guidelines

#### Tailwind CSS Usage

1. **Utility-First**: Use Tailwind utilities
2. **Responsive Design**: Mobile-first approach
3. **Consistent Spacing**: Use Tailwind's spacing scale
4. **Custom Classes**: Only when necessary

**Example:**
```jsx
<div className="
  flex flex-col
  p-4 md:p-6
  bg-gray-800
  rounded-lg
  shadow-lg
  hover:shadow-xl
  transition-shadow
">
  <h2 className="text-xl md:text-2xl font-bold text-white">
    Title
  </h2>
  <p className="mt-2 text-gray-300">
    Description
  </p>
</div>
```

#### Color Palette

Use the defined color scheme:
- **Background**: `bg-gray-900`, `bg-gray-800`
- **Text**: `text-white`, `text-gray-300`
- **Accent**: `text-blue-400`, `bg-blue-600`
- **Error**: `text-red-400`, `bg-red-600`
- **Success**: `text-green-400`, `bg-green-600`

### File Organization

```
src/
├── components/
│   ├── common/          # Shared components
│   ├── case/           # Case-specific components
│   └── ui/             # Base UI components
├── pages/              # Route components
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── assets/             # Static assets
└── styles/             # Global styles
```

## Component Development

### Creating a New Component

1. Create file in appropriate directory
2. Define component with props
3. Add PropTypes or TypeScript types
4. Export component
5. Create story file (if using Storybook)

**Template:**
```javascript
// src/components/MyComponent.jsx
import PropTypes from 'prop-types'

function MyComponent({ title, children }) {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  )
}

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default MyComponent
```

### Reusable Components

Focus on creating reusable, composable components:

```javascript
// Button component
function Button({ variant = 'primary', size = 'md', children, ...props }) {
  const baseClasses = 'rounded font-semibold transition-colors'

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50'
  }

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

## Testing Guidelines

### Testing Strategy

1. **Unit Tests**: Test individual components
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user flows

### Writing Tests

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CaseCard from './CaseCard'

describe('CaseCard', () => {
  it('renders case information', () => {
    const case = {
      id: '1',
      title: 'Test Case',
      description: 'Test description'
    }

    render(<CaseCard case={case} />)

    expect(screen.getByText('Test Case')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    const case = { id: '1', title: 'Test' }

    render(<CaseCard case={case} onClick={handleClick} />)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledWith('1')
  })
})
```

### Running Tests

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Documentation

### Code Documentation

```javascript
/**
 * Fetches a case by its ID.
 *
 * @param {string} id - The case ID
 * @returns {Promise<Case|null>} The case object or null if not found
 * @throws {Error} If the API request fails
 *
 * @example
 * const case = await getCaseById('case-123')
 */
async function getCaseById(id) {
  // Implementation
}
```

### README Updates

Update README.md when:
- Adding new features
- Changing setup process
- Updating dependencies
- Modifying API

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Responsive design tested
- [ ] Browser compatibility verified
- [ ] No console errors or warnings
- [ ] Accessibility checked

### Submitting a PR

1. Push your branch:
```bash
git push origin feature/your-feature-name
```

2. Create Pull Request on GitHub

3. Fill out PR template:
   - **Description**: What does this PR do?
   - **Screenshots**: UI changes (desktop and mobile)
   - **Testing**: How was it tested?
   - **Breaking Changes**: Any API changes?

4. Request review from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] UI improvement
- [ ] Documentation update
- [ ] Refactoring

## Screenshots
### Desktop
[Screenshot]

### Mobile
[Screenshot]

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on mobile
- [ ] All tests pass

## Checklist
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design works
```

## Design Contributions

### UI/UX Improvements

When contributing design:
1. Follow existing design system
2. Maintain consistent spacing
3. Ensure accessibility
4. Test on multiple devices
5. Provide design rationale

### Accessibility Guidelines

- Use semantic HTML
- Provide alt text for images
- Ensure keyboard navigation
- Maintain color contrast (WCAG AA)
- Test with screen readers

```jsx
// Good accessibility
<button
  aria-label="Close dialog"
  onClick={handleClose}
>
  <CloseIcon aria-hidden="true" />
</button>

<img
  src={imageUrl}
  alt="Wi-Fi router showing security vulnerability"
/>
```

## Content Contributions

### Adding Case Studies

1. Create case in Supabase
2. Follow case template
3. Include relevant images
4. Add appropriate tags
5. Verify severity level

### Case Template

```javascript
{
  title: "Case Title",
  description: "Brief 2-3 sentence description",
  category: "vulnerability|misconfiguration|attack",
  severity: "low|medium|high|critical",
  content: "Full case study content in markdown",
  tags: ["tag1", "tag2"],
  imageUrl: "url-to-image"
}
```

## Resources

### Learning Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Supabase Documentation](https://supabase.com/docs)

### Tools

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Vite DevTools](https://github.com/vitejs/vite-plugin-react)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Getting Help

### Ask Questions

- Open an issue with `question` label
- Check existing issues and documentation
- Join community discussions

### Report Bugs

Use the bug report template:
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120
- OS: macOS 14
- Device: Desktop/Mobile
- Screen size: 1920x1080

## Console Errors
[Paste console errors]

## Screenshots
[Add screenshots]
```

## Recognition

Contributors are recognized:
- In project README
- In release notes
- On GitHub contributors page

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Questions?

Feel free to:
- Open an issue with the `question` label
- Check the `/docs` directory
- Review existing PRs and issues

## Thank You

Your contributions help make Wi-Fi Vigilante a valuable educational resource for the security community. Thank you for your time and effort!

## Author

Kris Armstrong
