# Wi-Fi Vigilante

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-green) ![Version](https://img.shields.io/badge/Version-1.3.1-blue) ![Status](https://img.shields.io/badge/Status-Active-success)

> Real-world investigations into Wi-Fi security, cybersecurity incidents, and network troubleshooting using expert tools and forensic techniques.

A comprehensive database of wireless security case studies, categorized by sector and severity, with advanced search and filtering capabilities. Built with modern web technologies and best practices.

## ✨ Features

- 📚 **Browse Case Studies** - Extensive library of real-world security investigations
- 🔍 **Advanced Search** - Full-text search across all case fields
- 🎯 **Smart Filtering** - Filter by sector, subsector, tool, tag, severity, and status
- 💾 **Turso/libSQL Data** - Live SQLite-compatible content with bundled fallback data
- 📄 **Export Capabilities** - Download cases as PDF or Markdown
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- ⚡ **PWA Ready** - Offline-capable Progressive Web App
- 🌐 **Case of the Day** - Random featured case updated daily
- ♿ **Accessible** - WCAG 2.1 compliant with ARIA labels

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22+ and npm 10+
- **Git**

### Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:krisarmstrong/wifivigilante-com.git
   cd wifivigilante-com
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` if you need live data, ratings, or admin edits:

   ```env
   VITE_APP_ENV=development
   TURSO_DATABASE_URL=libsql://your-database.turso.io
   TURSO_AUTH_TOKEN=your-turso-token
   ADMIN_API_TOKEN=change-this-long-random-admin-token
   VITE_SENTRY_DSN=https://your-dsn@sentry.io/project
   ```

   Seed Turso from the bundled case data:

   ```bash
   npm run db:seed
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 📜 Available Scripts

| Script                  | Description                               |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Start development server (localhost:3000) |
| `npm run dev:staging`   | Start dev server in staging mode          |
| `npm run build`         | Build for production                      |
| `npm run build:dev`     | Build for development                     |
| `npm run build:staging` | Build for staging                         |
| `npm run preview`       | Preview production build                  |
| `npm run test`          | Run tests with Vitest                     |
| `npm run test:ui`       | Run tests with UI                         |
| `npm run test:coverage` | Generate test coverage report             |
| `npm run lint`          | Lint code with ESLint                     |
| `npm run format`        | Format code with Prettier                 |

## 📁 Project Structure

```
wi-fi-vigilante/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ui/        # Base UI components (Button, Card, Input, etc.)
│   │   └── icons/     # Icon components
│   ├── pages/          # Route/page components
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   │   ├── validation.ts   # Input validation
│   │   ├── cache.ts        # Client-side caching
│   │   ├── rateLimit.ts    # Rate limiting
│   │   ├── errorTracking.ts # Error monitoring
│   │   └── logger.ts       # Structured logging
│   ├── types/          # TypeScript type definitions
│   ├── constants/      # App constants
│   ├── config/         # Configuration files
│   ├── data/           # Bundled public case data
│   ├── api.ts          # Local data access layer
│   └── main.tsx        # Application entry point
├── docs/               # Documentation
│   ├── architecture.md     # System architecture
│   ├── api.md              # API reference
│   ├── contributing.md     # Contribution guidelines
│   └── SUPABASE_RLS_SETUP.md # Legacy database restoration notes
├── tests/              # Test files
└── DEPLOYMENT_GUIDE.md # Deployment instructions
```

## 🛠️ Technology Stack

- **Framework:** React 19
- **Language:** TypeScript 5.9
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Data:** Bundled JSON generated from public case records
- **Routing:** React Router 7
- **Testing:** Vitest + React Testing Library
- **PWA:** Vite PWA Plugin
- **Icons:** Lucide React
- **PDF Export:** jsPDF + html2canvas

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- [**Architecture Guide**](docs/architecture.md) - System design and structure
- [**API Reference**](docs/api.md) - API functions and usage examples
- [**Turso Live Data**](docs/turso.md) - SQLite-compatible live data and admin API
- [**Contributing Guide**](docs/contributing.md) - How to contribute
- [**Deployment Guide**](DEPLOYMENT_GUIDE.md) - Deployment instructions
- [**Supabase Setup**](docs/SUPABASE_RLS_SETUP.md) - Legacy database restoration notes
- [**Testing Guide**](docs/testing.md) - Testing documentation
- [**Component Catalog**](docs/components.md) - UI component reference

## 🔧 Configuration

### Environment Variables

Only client-exposed variables need the `VITE_` prefix. Turso and admin tokens are server-only Vercel function variables.

| Variable                | Required | Description                                  |
| ----------------------- | -------- | -------------------------------------------- |
| `TURSO_DATABASE_URL`    | Yes      | Turso/libSQL database URL for live data      |
| `TURSO_AUTH_TOKEN`      | Yes      | Turso auth token for API functions           |
| `ADMIN_API_TOKEN`       | Yes      | Token required for write/admin API calls     |
| `VITE_APP_ENV`          | No       | Environment (development/staging/production) |
| `VITE_SENTRY_DSN`       | No       | Sentry error tracking DSN                    |
| `VITE_ENABLE_ANALYTICS` | No       | Enable analytics (true/false)                |

See [.env.example](.env.example) for a complete list.

### Build Modes

The app supports three build modes:

- **Development** (`dev`) - Full debugging, verbose logs
- **Staging** (`staging`) - Production-like with extra logging
- **Production** (`production`) - Optimized, minimal logging

## 🐛 Troubleshooting

### Build Errors

If the build fails:

```bash
# Clean install
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Port Already in Use

If port 3000 is busy:

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill

# Or use a different port
npm run dev -- --port 5173
```

## 🚢 Release & Publishing

Wi-Fi Vigilante follows semantic versioning. Run `npm version <bump>` (patch/minor/major) to update the package version, README badge, and `VERSION` file. The command will also create a git commit and tag—push it with `git push --follow-tags`.

For detailed steps that cover the shared UI package and the sibling portfolio site, see [`docs/publishing.md`](docs/publishing.md).

### TypeScript Errors

```bash
# Run type checking
npx tsc --noEmit

# Check for type errors in specific file
npx tsc --noEmit src/path/to/file.ts
```

### Test Failures

```bash
# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npm run test src/path/to/test.test.ts

# Clear test cache
npm run test -- --clearCache
```

## 🧪 Testing

The project uses Vitest for unit testing and React Testing Library for component testing.

```bash
# Run all tests
npm test

# Watch mode (recommended for development)
npm test -- --watch

# With UI
npm run test:ui

# Generate coverage
npm run test:coverage
```

See [docs/testing.md](docs/testing.md) for detailed testing guidelines.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

**Quick contribution steps:**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Lint code (`npm run lint`)
6. Commit (`git commit -m 'Add amazing feature'`)
7. Push (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kris Armstrong**

- GitHub: [@krisarmstrong](https://github.com/krisarmstrong)
- Website: [wi-fi-vigilante.com](https://wi-fi-vigilante.com)

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icon library
- [React Router](https://reactrouter.com/) - Declarative routing for React

## 🔒 Security

Found a security vulnerability? Please email security@wi-fi-vigilante.com instead of using the issue tracker.

## 📊 Project Stats

- **TypeScript:** 100% (migrated from JavaScript in v0.6.0)
- **Lines of Code:** ~15,000
- **Test Coverage:** Target 80%+
- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)

## 🚢 Deployment

For production deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

Supported platforms:

- Cloudflare Pages ⭐ (Recommended)
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

---

**Built with ❤️ by the Wi-Fi Vigilante team**
