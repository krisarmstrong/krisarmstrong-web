# Kris Armstrong Web - Monorepo Setup Guide

Complete guide for setting up local development and deploying to Vercel.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Initial Setup](#initial-setup)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Testing](#testing)
- [Building](#building)
- [Deployment to Vercel](#deployment-to-vercel)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 22.0.0 ([Download](https://nodejs.org/))
- **npm** >= 10.0.0 (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

Verify your installations:

```bash
node --version  # Should be >= 22.0.0
npm --version   # Should be >= 10.0.0
git --version
```

## Project Structure

This is a monorepo using npm workspaces:

```
krisarmstrong-web/
├── apps/
│   └── intrinsic/              # Intrinsic Momentum Mindset website
├── packages/
│   └── web-foundation/         # Shared component library
├── package.json                # Root package.json with workspace config
└── README.md
```

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd krisarmstrong-web
```

### 2. Install Dependencies

Install all dependencies for the entire monorepo:

```bash
npm install
```

This will install dependencies for:

- Root project
- `@krisarmstrong/web-foundation` package
- `intrinsic` app

### 3. Set Up Environment Variables

#### Intrinsic App

Create `.env` file in `apps/intrinsic/`:

```bash
cd apps/intrinsic
cp .env.example .env
```

Edit `apps/intrinsic/.env` and add your configuration:

```env
# Application Environment
VITE_APP_ENV=development

# Sentry Error Tracking (Optional)
# Get your DSN from https://sentry.io
VITE_SENTRY_DSN=https://your-actual-dsn@sentry.io/your-project-id

# Formspree Contact Form
# Get your endpoint from https://formspree.io
VITE_FORM_ENDPOINT=https://formspree.io/f/your-form-id

# PayPal Payment Links
# Create payment buttons at https://www.paypal.com/buttons
VITE_PAYPAL_INTRINSIC_FOUNDATIONS=https://www.paypal.com/your-button-url-1
VITE_PAYPAL_INTRINSIC_MOMENTUM=https://www.paypal.com/your-button-url-2
VITE_PAYPAL_MINDSET_IMMERSION=https://www.paypal.com/your-button-url-3
```

## Development

### Run All Apps in Development Mode

From the root directory:

```bash
npm run dev
```

This starts all apps in parallel.

### Run Specific App

```bash
cd apps/intrinsic
npm run dev
```

The intrinsic app will be available at `http://localhost:3001/`

### Build Shared Package

When you make changes to `packages/web-foundation`, rebuild it:

```bash
cd packages/web-foundation
npm run build
```

The consuming apps will automatically pick up the changes via HMR.

## Testing

### Run All Tests

From the root directory:

```bash
npm test
```

### Run Tests for Specific Package

```bash
cd apps/intrinsic
npm test
```

### Run Tests with UI

```bash
cd apps/intrinsic
npm run test:ui
```

### Generate Coverage Report

```bash
cd apps/intrinsic
npm run test:coverage
```

## Building

### Build All Projects

From the root directory:

```bash
npm run build
```

### Build Specific App

```bash
cd apps/intrinsic
npm run build
```

Build output will be in `apps/intrinsic/dist/`

### Preview Production Build

```bash
cd apps/intrinsic
npm run preview
```

## Deployment to Vercel

### Prerequisites

1. Install Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

### Deploy Intrinsic App

#### Option 1: Using Vercel CLI (Manual)

1. Navigate to the app directory:

   ```bash
   cd apps/intrinsic
   ```

2. Deploy to preview:

   ```bash
   vercel
   ```

3. Deploy to production:
   ```bash
   vercel --prod
   ```

#### Option 2: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/intrinsic`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file:
     - `VITE_APP_ENV=production`
     - `VITE_SENTRY_DSN`
     - `VITE_FORM_ENDPOINT`
     - `VITE_PAYPAL_INTRINSIC_FOUNDATIONS`
     - `VITE_PAYPAL_INTRINSIC_MOMENTUM`
     - `VITE_PAYPAL_MINDSET_IMMERSION`

6. Click "Deploy"

### Continuous Deployment

Once connected to Git:

- Every push to `main` branch triggers a production deployment
- Every push to other branches triggers a preview deployment
- Pull requests get automatic preview deployments

### vercel.json Configuration

Create `apps/intrinsic/vercel.json` for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Troubleshooting

### Port Already in Use

If port 3001 is already in use:

```bash
# Kill the process using the port (Mac/Linux)
lsof -ti:3001 | xargs kill -9

# Or change the port in vite.config.ts
```

### Changes to Shared Package Not Reflecting

1. Rebuild the package:

   ```bash
   cd packages/web-foundation
   npm run build
   ```

2. Clear Vite cache:
   ```bash
   cd apps/intrinsic
   rm -rf node_modules/.vite
   npm run dev
   ```

### Build Fails on Vercel

1. Check Node.js version matches (>= 22.0.0)
2. Verify all environment variables are set in Vercel dashboard
3. Check build logs for specific errors
4. Ensure `Root Directory` is set to `apps/intrinsic`

### Module Resolution Issues

If you see "Cannot find module" errors:

```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules apps/*/package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json
npm install
```

### TypeScript Errors

```bash
# Regenerate type declarations
cd packages/web-foundation
npm run build
```

## Additional Commands

### Linting

```bash
npm run lint              # Check all packages
npm run lint:fix          # Fix linting issues
```

### Formatting

```bash
npm run format            # Format all files
npm run format:check      # Check formatting
```

### Security Audit

```bash
npm run audit:security    # Check for vulnerabilities
```

## Getting Help

If you encounter issues:

1. Check this guide's [Troubleshooting](#troubleshooting) section
2. Review error messages carefully
3. Check package-specific README files
4. Ensure all prerequisites are installed correctly

## Related Documentation

- **[README.md](./README.md)** - Project overview and architecture
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines and workflow
- **[apps/intrinsic/README.md](./apps/intrinsic/README.md)** - Intrinsic app documentation
- **[apps/intrinsic/DESIGN_GUIDE.md](./apps/intrinsic/DESIGN_GUIDE.md)** - Design system
- **[packages/web-foundation/README.md](./packages/web-foundation/README.md)** - Component library docs
- **[packages/web-foundation/API.md](./packages/web-foundation/API.md)** - Component API reference

## Next Steps

- Review the [README.md](./README.md) for architecture overview
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
- Set up your IDE with recommended extensions (ESLint, Prettier, Tailwind CSS IntelliSense)
- Explore individual package documentation for specific details
