---
title: '🟠 HIGH: Create shared base configs for Vite, Vitest, and TypeScript (saves ~300 lines)'
labels: build-config, high-priority, refactor, tooling
assignees: krisarmstrong
---

**Status: CLOSED (2025-11-24) — Shared base configs exist: `vite.config.base.ts`, `vitest.config.base.ts`, and `tsconfig.base.json`, consumed by all apps.**

## Priority: HIGH 🟠

**Impact:** ~300 lines of duplicated build configuration across apps

## Current State

Each app has nearly identical configurations:

| Config Type | Lines per App | Apps | Total Duplication |
| ----------- | ------------- | ---- | ----------------- |
| Vite        | 59            | 3    | ~150 lines        |
| Vitest      | ~50           | 3    | ~100 lines        |
| TSConfig    | ~45           | 2    | ~80 lines         |
| **TOTAL**   |               |      | **~330 lines**    |

Only differences: port numbers and minor app-specific settings

## Solution

Create shared base configurations that apps extend.

## Implementation

### Part 1: Shared Vite Configuration

#### Step 1: Create base Vite config

Create `vite.config.base.ts` in root:

```typescript
import { defineConfig, searchForWorkspaceRoot, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

interface AppConfig {
  /** App name for chunk naming */
  appName: string;
  /** Development server port */
  port: number;
  /** Additional vendor chunks (optional) */
  vendorChunks?: Record<string, string[]>;
}

export function createViteConfig(appConfig: AppConfig): UserConfig {
  return defineConfig({
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
      dedupe: ['react', 'react-dom', 'react-router-dom'],
    },

    optimizeDeps: {
      include: ['@krisarmstrong/web-foundation'],
      exclude: [],
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-ui': ['lucide-react', '@krisarmstrong/web-foundation'],
            'vendor-sentry': ['@sentry/react'],
            ...appConfig.vendorChunks,
          },
        },
      },
      target: 'esnext',
      chunkSizeWarningLimit: 600,
      sourcemap: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },

    server: {
      port: appConfig.port,
      fs: {
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          path.resolve(process.cwd(), '../../packages/web-foundation'),
        ],
      },
    },
  });
}
```

#### Step 2: Update app Vite configs

**Intrinsic (`apps/intrinsic/vite.config.ts`):**

```typescript
import { createViteConfig } from '../../vite.config.base';

export default createViteConfig({
  appName: 'intrinsic',
  port: 3001,
});
```

**KrisArmstrong (`apps/krisarmstrong/vite.config.ts`):**

```typescript
import { createViteConfig } from '../../vite.config.base';

export default createViteConfig({
  appName: 'krisarmstrong',
  port: 3002,
});
```

**WiFiVigilante (`apps/wifivigilante/vite.config.ts`):**

```typescript
import { createViteConfig } from '../../vite.config.base';

export default createViteConfig({
  appName: 'wifivigilante',
  port: 3000,
  vendorChunks: {
    'vendor-radix': ['@radix-ui/react-icons'],
  },
});
```

### Part 2: Shared Vitest Configuration

#### Step 1: Create base Vitest config

Create `vitest.config.base.ts` in root:

```typescript
import { defineConfig, mergeConfig, UserConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

interface TestConfig {
  /** Path to test setup file (relative to app root) */
  setupFiles?: string[];
  /** Additional coverage exclude patterns */
  coverageExclude?: string[];
}

export function createVitestConfig(testConfig: TestConfig = {}): UserConfig {
  return defineConfig({
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: testConfig.setupFiles || [],
      css: true,
      pool: 'threads',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/**',
          'dist/**',
          '**/*.config.{js,ts}',
          '**/*.d.ts',
          '**/tests/**',
          '**/__tests__/**',
          ...(testConfig.coverageExclude || []),
        ],
      },
    },
  });
}
```

#### Step 2: Update app Vitest configs

**Intrinsic (`apps/intrinsic/vitest.config.ts`):**

```typescript
import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: ['./src/__tests__/setup.ts'],
});
```

**KrisArmstrong (`apps/krisarmstrong/vitest.config.ts`):**

```typescript
import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: ['./tests/setup.ts'],
});
```

**WiFiVigilante (`apps/wifivigilante/vitest.config.ts`):**

```typescript
import { createVitestConfig } from '../../vitest.config.base';

export default createVitestConfig({
  setupFiles: ['./src/tests/setup.ts'],
});
```

### Part 3: Shared TypeScript Configuration

#### Step 1: Create base TSConfig

Create `tsconfig.base.json` in root:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

#### Step 2: Update app TSConfigs

**All apps (`apps/*/tsconfig.json`):**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "build"]
}
```

### Step 4: Install dependencies at root

```bash
npm install -D vite @vitejs/plugin-react @tailwindcss/vite vitest @vitest/coverage-v8 typescript
```

### Step 5: Test all apps

```bash
# Build all apps
npm run build --workspaces

# Test all apps
npm test --workspaces

# Verify type checking
npm run lint --workspaces
```

## Testing Checklist

- [ ] Base configs created (vite, vitest, tsconfig)
- [ ] All apps extend base configs
- [ ] All apps build successfully
- [ ] All tests pass
- [ ] Type checking works
- [ ] Dev servers start on correct ports
- [ ] HMR works in all apps
- [ ] Production builds work

## Files to Create

- `vite.config.base.ts`
- `vitest.config.base.ts`
- `tsconfig.base.json`

## Files to Update

- `apps/intrinsic/vite.config.ts` (59 → 5 lines)
- `apps/krisarmstrong/vite.config.ts` (59 → 5 lines)
- `apps/wifivigilante/vite.config.ts` (59 → 8 lines)
- `apps/intrinsic/vitest.config.ts` (~50 → 5 lines)
- `apps/krisarmstrong/vitest.config.ts` (~50 → 5 lines)
- `apps/wifivigilante/vitest.config.ts` (~50 → 5 lines)
- `apps/intrinsic/tsconfig.json` (reduce)
- `apps/krisarmstrong/tsconfig.json` (reduce)
- `apps/wifivigilante/tsconfig.json` (reduce)

## Success Criteria

- [ ] ~330 lines of configuration reduced to ~50
- [ ] Single source of truth for build config
- [ ] Easy to add new apps
- [ ] Consistent build behavior across apps
- [ ] App-specific customization still possible

## Benefits

- **Code reduction:** ~330 lines → ~50 lines + base configs
- **Consistency:** Same build/test settings across apps
- **Maintainability:** Update once, affects all apps
- **Onboarding:** New apps get best practices by default
