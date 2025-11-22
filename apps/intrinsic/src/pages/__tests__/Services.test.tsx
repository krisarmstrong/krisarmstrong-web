/**
 * @fileoverview Tests for Services page component
 * Tests component structure and exports
 */

import { describe, it, expect, vi } from 'vitest';
import Services from '../Services';

// Mock React Router
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('Services', () => {
  it('is a function component', () => {
    expect(typeof Services).toBe('function');
  });

  it('exports a valid React component', () => {
    const component = Services();
    expect(component).toBeTruthy();
    expect(component.type).toBeTruthy();
  });

  it('renders sections with expected structure', () => {
    const component = Services();
    expect(component.props.children).toBeTruthy();
  });
});
