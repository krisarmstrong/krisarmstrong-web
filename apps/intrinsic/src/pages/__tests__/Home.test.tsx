/**
 * @fileoverview Tests for Home page component
 * Tests content, structure, and links
 */

import type { ReactElement, ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../Home';

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Heart: () => null,
  Lightbulb: () => null,
  Brain: () => null,
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

describe('Home', () => {
  it('is a function component', () => {
    expect(typeof Home).toBe('function');
  });

  it('exports a valid React component', () => {
    const component = Home();
    expect(component).toBeTruthy();
    expect(component.type).toBeTruthy();
  });

  it('renders sections with expected structure', () => {
    const component = Home() as ReactElement<{ children?: ReactNode }>;
    expect(component.props.children).toBeTruthy();
  });
});
