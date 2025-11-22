# Architecture

## Overview

Wi-Fi Vigilante is a modern web application built with React, Vite, and Tailwind CSS. The application serves as an educational platform for Wi-Fi security awareness, featuring case studies, interactive content, and a responsive design optimized for both desktop and mobile devices.

## Technology Stack

### Core Technologies
- **React 18.2**: UI library with hooks and modern features
- **Vite 6.3**: Fast build tool and development server
- **React Router DOM 6.14**: Client-side routing
- **Tailwind CSS 3.4**: Utility-first CSS framework

### Supporting Libraries
- **Supabase**: Backend-as-a-Service for database and authentication
- **Lucide React**: Icon library
- **React Icons**: Additional icon components
- **jsPDF**: PDF generation capabilities
- **Radix UI**: Accessible component primitives

## System Architecture

### Application Structure

```
wi-fi-vigilante.com/
├── src/                      # Source code
│   ├── main.jsx             # Application entry point
│   ├── Layout.jsx           # Main layout component
│   ├── index.css            # Global styles & Tailwind imports
│   ├── api.js               # API integration layer
│   ├── supabaseClient.js    # Supabase configuration
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route-level page components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── assets/             # Static assets
├── public/                  # Public static files
├── docs/                    # Documentation
├── scripts/                 # Build/deployment scripts
├── tools/                   # Development tools
└── [config files]          # Vite, Tailwind, PostCSS configs
```

## Component Architecture

### Hierarchical Structure

```
App (RouterProvider)
  |
  └─ Layout
      |
      ├─ Header/Navigation
      ├─ Main Content (Outlet)
      |   |
      |   ├─ Home
      |   ├─ CaseOverview
      |   ├─ CaseDetail
      |   ├─ CaseOfTheDay
      |   ├─ Search
      |   └─ About
      |
      └─ Footer
```

### Component Categories

#### 1. Layout Components
- **Layout.jsx**: Master layout wrapper
- Provides consistent header, navigation, and footer
- Manages responsive breakpoints

#### 2. Page Components
Located in `src/pages/`:
- **Home.jsx**: Landing page
- **CaseOverview.jsx**: Case list/grid view
- **CaseDetail.jsx**: Individual case details
- **CaseOfTheDay.jsx**: Featured case showcase
- **Search.jsx**: Search functionality
- **About.jsx**: About/info page
- **ErrorPage.jsx**: 404 and error handling

#### 3. Reusable Components
Located in `src/components/`:
- UI primitives
- Form components
- Card components
- Interactive elements

#### 4. Custom Hooks
Located in `src/hooks/`:
- Data fetching hooks
- State management hooks
- Utility hooks

#### 5. Utility Functions
Located in `src/utils/`:
- Data transformations
- Formatting functions
- Helper utilities

## Data Flow

### Data Architecture

```
Supabase Backend
    |
    v
API Layer (api.js)
    |
    v
React Components
    |
    +---> State Management (useState, useContext)
    |
    +---> UI Rendering
    |
    v
User Interface
```

### State Management

The application uses React's built-in state management:
- **useState**: Component-local state
- **useContext**: Shared state across components
- **React Router**: URL-based state

### Data Fetching Pattern

```javascript
// Typical data fetching in a page component
useEffect(() => {
  async function fetchData() {
    const data = await api.getCases();
    setData(data);
  }
  fetchData();
}, []);
```

## Routing Architecture

### Client-Side Routing

Using React Router v6 with lazy loading:

```javascript
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Suspense><Home /></Suspense> },
      { path: 'cases', element: <Suspense><CaseOverview /></Suspense> },
      { path: 'cases/:id', element: <Suspense><CaseDetail /></Suspense> },
      // ... more routes
    ],
  },
]);
```

### Route Structure

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page |
| `/cases` | CaseOverview | Case list |
| `/cases/:id` | CaseDetail | Individual case |
| `/case-of-the-day` | CaseOfTheDay | Featured case |
| `/search` | Search | Search interface |
| `/about` | About | About page |

## Performance Optimizations

### Code Splitting

- **Lazy Loading**: All page components are lazy-loaded
- **Route-based splitting**: Automatic code splitting by route
- **Dynamic imports**: React.lazy() for on-demand loading

### Loading Strategy

```javascript
<Suspense fallback={<PageLoadingFallback />}>
  <PageComponent />
</Suspense>
```

### Build Optimizations

- **Tree shaking**: Unused code elimination
- **Minification**: Code compression
- **Asset optimization**: Image and CSS optimization
- **Caching**: Long-term cache headers

## Styling Architecture

### Tailwind CSS Configuration

- **Utility-first approach**: Compose styles from utility classes
- **Custom configuration**: tailwind.config.js
- **JIT mode**: Just-In-Time compilation
- **PurgeCSS**: Unused style removal in production

### Style Organization

1. **Global Styles**: index.css
   - Tailwind directives
   - Custom global styles
   - CSS variables

2. **Component Styles**: Inline Tailwind classes
   ```jsx
   <div className="flex flex-col items-center p-4 bg-gray-800">
   ```

3. **Theme Configuration**: tailwind.config.js
   - Custom colors
   - Breakpoints
   - Spacing scale

## API Integration

### Supabase Client

Configuration in `supabaseClient.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
```

### API Layer (api.js)

Abstraction layer for data operations:
- Case management
- User data
- Search functionality
- Content retrieval

## Build Process

### Development Build

```bash
npm run dev
```

- Fast HMR (Hot Module Replacement)
- Source maps enabled
- Development server on localhost:3000

### Production Build

```bash
npm run build
```

- Code minification
- Asset optimization
- Tree shaking
- Bundle analysis

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── [hash].js      # JavaScript bundles
│   ├── [hash].css     # Stylesheets
│   └── [images]       # Optimized images
└── [other static files]
```

## Deployment Architecture

### Deployment Targets

- **Cloudflare Pages**: Recommended deployment platform
- **GitHub Pages**: Alternative static hosting
- **Vercel**: Alternative with serverless functions

### Deployment Process

1. Build production bundle
2. Upload to hosting platform
3. Configure custom domain
4. Set up CDN caching
5. Configure SSL/TLS

## Security Considerations

### Frontend Security

- **Environment Variables**: Sensitive data in .env
- **API Keys**: Client-safe keys only
- **Input Validation**: Client-side validation
- **XSS Prevention**: React's built-in protections

### Backend Security (Supabase)

- **Row-level security**: Database access control
- **Authentication**: User authentication
- **API Security**: Rate limiting and access control

## Responsive Design

### Breakpoints

Following Tailwind's default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach

Default styles target mobile, with progressive enhancement:
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
```

## Error Handling

### Error Boundaries

- **ErrorPage.jsx**: Catches routing errors
- **Fallback UI**: User-friendly error messages
- **Error Recovery**: Navigation to safe routes

### Loading States

- **Suspense**: Async component loading
- **Loading Indicators**: Spinner components
- **Skeleton Screens**: Content placeholders

## Testing Strategy

### Testing Layers

1. **Unit Tests**: Component logic
2. **Integration Tests**: Component interactions
3. **E2E Tests**: Full user workflows

### Testing Tools (Recommended)

- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing

## Future Enhancements

### Planned Features

1. **Progressive Web App**: Offline support
2. **Server-Side Rendering**: Improved SEO and performance
3. **Real-time Updates**: WebSocket integration
4. **Advanced Analytics**: User behavior tracking

### Scalability Considerations

- **Component Library**: Shared component system
- **State Management**: Redux or Zustand for complex state
- **API Gateway**: Centralized API management
- **Micro-frontends**: Modular architecture

## Development Workflow

### Local Development

1. Clone repository
2. Install dependencies: `npm install`
3. Configure environment: `.env`
4. Start dev server: `npm run dev`
5. Access at `http://localhost:3000`

### Hot Module Replacement

Vite provides instant feedback:
- Save file
- Browser updates automatically
- State preserved where possible

## Browser Support

### Target Browsers

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Polyfills

Vite includes necessary polyfills for modern JavaScript features.

## Author

Kris Armstrong
