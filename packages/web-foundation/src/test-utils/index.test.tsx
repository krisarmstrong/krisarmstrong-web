import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createLocalStorageMock,
  setupMatchMediaMock,
  setupIntersectionObserverMock,
  setupWindowMocks,
  setupBrowserMocks,
  renderWithDefaults,
  mockEnv,
  mockEnvVars,
} from './index';

beforeEach(() => {
  vi.unstubAllEnvs();
});

describe('createLocalStorageMock', () => {
  it('stores, retrieves, removes, and clears values', () => {
    const ls = createLocalStorageMock({ foo: 'bar' });
    expect(ls.getItem('foo')).toBe('bar');
    ls.setItem('baz', 'qux');
    expect(ls.getItem('baz')).toBe('qux');
    expect(ls.length).toBe(2);
    ls.removeItem('foo');
    expect(ls.getItem('foo')).toBeNull();
    ls.clear();
    expect(ls.length).toBe(0);
  });
});

describe('browser API mocks', () => {
  it('sets matchMedia mock', () => {
    setupMatchMediaMock();
    expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBe(false);
  });

  it('sets IntersectionObserver mock', () => {
    setupIntersectionObserverMock();
    const observer = new IntersectionObserver(() => undefined);
    expect(observer.takeRecords()).toEqual([]);
  });

  it('sets window scroll mocks', () => {
    setupWindowMocks();
    window.scrollTo(0, 0);
    expect(window.scrollTo).toHaveBeenCalledOnce();
  });

  it('sets all browser mocks together', () => {
    setupBrowserMocks();
    expect(typeof window.matchMedia).toBe('function');
    expect(typeof window.scrollTo).toBe('function');
  });
});

describe('renderWithDefaults', () => {
  it('renders a component', () => {
    const { getByText } = renderWithDefaults(<div>Hello</div>);
    expect(getByText('Hello')).toBeInTheDocument();
  });
});

describe('mockEnv helpers', () => {
  it('stubs a single env var', () => {
    mockEnv('TEST_KEY', '123');
    expect(process.env.TEST_KEY).toBe('123');
  });

  it('stubs multiple env vars', () => {
    mockEnvVars({ A: '1', B: '2' });
    expect(process.env.A).toBe('1');
    expect(process.env.B).toBe('2');
  });
});
