# API Documentation

## Overview

This document describes the API structure and interfaces for the Wi-Fi Vigilante application. The application uses Supabase as its backend, with a custom API layer providing abstraction and convenience methods.

## API Layer (api.js)

The API layer provides a clean interface between React components and the Supabase backend.

### Module Structure

```javascript
// src/api.js
import { supabase } from './supabaseClient'

export const api = {
  // Case-related methods
  getCases,
  getCaseById,
  getCaseOfTheDay,
  searchCases,

  // User-related methods
  // ... additional methods
}
```

## Supabase Client

### Configuration

```javascript
// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Environment Variables

Required in `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Data Models

### Case Model

Represents a Wi-Fi security case study.

```typescript
interface Case {
  id: string
  title: string
  description: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  date: string
  content: string
  tags: string[]
  imageUrl?: string
  createdAt: string
  updatedAt: string
}
```

### Search Result Model

```typescript
interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  relevance: number
}
```

## API Methods

### Case Management

#### getCases()

Retrieves all cases from the database.

**Signature:**
```javascript
async function getCases(): Promise<Case[]>
```

**Returns:**
- Array of case objects
- Empty array if no cases found

**Throws:**
- Error if database query fails

**Example:**
```javascript
import { api } from './api'

async function loadCases() {
  try {
    const cases = await api.getCases()
    console.log(`Loaded ${cases.length} cases`)
  } catch (error) {
    console.error('Failed to load cases:', error)
  }
}
```

#### getCaseById(id)

Retrieves a single case by its ID.

**Signature:**
```javascript
async function getCaseById(id: string): Promise<Case | null>
```

**Parameters:**
- `id` (string): Unique case identifier

**Returns:**
- Case object if found
- `null` if not found

**Throws:**
- Error if database query fails

**Example:**
```javascript
const case = await api.getCaseById('case-123')
if (case) {
  console.log('Case found:', case.title)
} else {
  console.log('Case not found')
}
```

#### getCaseOfTheDay()

Retrieves the featured case of the day.

**Signature:**
```javascript
async function getCaseOfTheDay(): Promise<Case | null>
```

**Returns:**
- Featured case object
- `null` if no case featured

**Logic:**
- Returns most recent case marked as "featured"
- Falls back to most recent case if no featured cases

**Example:**
```javascript
const featuredCase = await api.getCaseOfTheDay()
```

#### searchCases(query)

Searches cases based on query string.

**Signature:**
```javascript
async function searchCases(query: string): Promise<SearchResult[]>
```

**Parameters:**
- `query` (string): Search query string

**Returns:**
- Array of matching search results
- Results sorted by relevance

**Search Fields:**
- Title
- Description
- Content
- Tags
- Category

**Example:**
```javascript
const results = await api.searchCases('WPA2 vulnerability')
console.log(`Found ${results.length} matching cases`)
```

## React Integration

### Using API in Components

#### Basic Usage

```javascript
import { useState, useEffect } from 'react'
import { api } from '../api'

function CaseList() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCases() {
      try {
        const data = await api.getCases()
        setCases(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {cases.map(case => (
        <div key={case.id}>{case.title}</div>
      ))}
    </div>
  )
}
```

#### Using with React Router

```javascript
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../api'

function CaseDetail() {
  const { id } = useParams()
  const [case, setCase] = useState(null)

  useEffect(() => {
    api.getCaseById(id).then(setCase)
  }, [id])

  if (!case) return <div>Loading...</div>

  return (
    <div>
      <h1>{case.title}</h1>
      <p>{case.description}</p>
    </div>
  )
}
```

## Custom Hooks

### useCase Hook

Custom hook for fetching a single case.

**Definition:**
```javascript
// src/hooks/useCase.js
import { useState, useEffect } from 'react'
import { api } from '../api'

export function useCase(id) {
  const [case, setCase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    async function fetchCase() {
      try {
        setLoading(true)
        const data = await api.getCaseById(id)
        setCase(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCase()
  }, [id])

  return { case, loading, error }
}
```

**Usage:**
```javascript
function CaseDetail() {
  const { id } = useParams()
  const { case, loading, error } = useCase(id)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!case) return <div>Case not found</div>

  return <div>{case.title}</div>
}
```

### useCases Hook

Custom hook for fetching multiple cases.

**Definition:**
```javascript
// src/hooks/useCases.js
import { useState, useEffect } from 'react'
import { api } from '../api'

export function useCases() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCases() {
      try {
        const data = await api.getCases()
        setCases(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [])

  return { cases, loading, error }
}
```

**Usage:**
```javascript
function CaseOverview() {
  const { cases, loading, error } = useCases()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {cases.map(case => (
        <CaseCard key={case.id} case={case} />
      ))}
    </div>
  )
}
```

## Error Handling

### Standard Error Pattern

```javascript
try {
  const data = await api.getCases()
  // Process data
} catch (error) {
  console.error('API Error:', error)
  // Handle error appropriately
  // - Show user-friendly message
  // - Log to error tracking service
  // - Provide fallback UI
}
```

### Error Types

Common errors to handle:

1. **Network Errors**: Connection failures
2. **Authentication Errors**: Invalid credentials
3. **Not Found Errors**: Resource doesn't exist
4. **Validation Errors**: Invalid input data
5. **Server Errors**: Backend issues

### Error Component

```javascript
function ErrorMessage({ error }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded p-4">
      <h3 className="text-red-800 font-semibold">Error</h3>
      <p className="text-red-600">{error.message}</p>
    </div>
  )
}
```

## Loading States

### Loading Component

```javascript
import { Loader2 } from 'lucide-react'

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="animate-spin text-blue-500" size={48} />
    </div>
  )
}
```

### Suspense with Lazy Loading

```javascript
import { Suspense, lazy } from 'react'

const CaseDetail = lazy(() => import('./pages/CaseDetail'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CaseDetail />
    </Suspense>
  )
}
```

## Caching Strategies

### Simple In-Memory Cache

```javascript
const cache = new Map()

async function getCasesWithCache() {
  const cacheKey = 'cases'

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  const data = await api.getCases()
  cache.set(cacheKey, data)

  return data
}
```

### Time-Based Cache Invalidation

```javascript
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function getCasesWithTTL() {
  const cacheKey = 'cases'
  const cached = cache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  const data = await api.getCases()
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  })

  return data
}
```

## Real-Time Updates (Optional)

### Supabase Subscriptions

```javascript
// Subscribe to case changes
const subscription = supabase
  .from('cases')
  .on('*', payload => {
    console.log('Change received!', payload)
    // Update local state
  })
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

### React Integration

```javascript
useEffect(() => {
  const subscription = supabase
    .from('cases')
    .on('INSERT', payload => {
      setCases(prev => [...prev, payload.new])
    })
    .on('UPDATE', payload => {
      setCases(prev =>
        prev.map(c => c.id === payload.new.id ? payload.new : c)
      )
    })
    .subscribe()

  return () => subscription.unsubscribe()
}, [])
```

## API Best Practices

### 1. Error Handling

Always wrap API calls in try-catch blocks:
```javascript
try {
  const data = await api.getCases()
} catch (error) {
  console.error('Error:', error)
}
```

### 2. Loading States

Show loading indicators during API calls:
```javascript
setLoading(true)
const data = await api.getCases()
setLoading(false)
```

### 3. Cleanup

Clean up subscriptions and abort requests:
```javascript
useEffect(() => {
  const controller = new AbortController()

  fetch(url, { signal: controller.signal })
    .then(handleResponse)

  return () => controller.abort()
}, [])
```

### 4. Memoization

Memoize expensive operations:
```javascript
import { useMemo } from 'react'

const filteredCases = useMemo(() => {
  return cases.filter(c => c.category === selectedCategory)
}, [cases, selectedCategory])
```

## Testing

### Mocking API Calls

```javascript
// __mocks__/api.js
export const api = {
  getCases: jest.fn(() => Promise.resolve([])),
  getCaseById: jest.fn(() => Promise.resolve(null)),
}
```

### Testing Components

```javascript
import { render, waitFor } from '@testing-library/react'
import { api } from './api'
import CaseList from './CaseList'

jest.mock('./api')

test('loads and displays cases', async () => {
  api.getCases.mockResolvedValue([
    { id: '1', title: 'Test Case' }
  ])

  const { getByText } = render(<CaseList />)

  await waitFor(() => {
    expect(getByText('Test Case')).toBeInTheDocument()
  })
})
```

## Performance Optimization

### Debouncing Search

```javascript
import { debounce } from 'lodash'

const debouncedSearch = debounce(async (query) => {
  const results = await api.searchCases(query)
  setResults(results)
}, 300)
```

### Pagination

```javascript
async function getCases(page = 1, limit = 10) {
  const { data } = await supabase
    .from('cases')
    .select('*')
    .range((page - 1) * limit, page * limit - 1)

  return data
}
```

## Author

Kris Armstrong
