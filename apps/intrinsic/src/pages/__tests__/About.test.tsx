/**
 * @fileoverview Tests for About page component
 * Tests component structure and exports
 */

import { describe, it, expect } from 'vitest';
import About from '../About';

describe('About', () => {
  it('is a function component', () => {
    expect(typeof About).toBe('function');
  });

  it('exports a valid React component', () => {
    const component = About();
    expect(component).toBeTruthy();
    expect(component.type).toBeTruthy();
  });

  it('renders sections with expected structure', () => {
    const component = About();
    expect(component.props.children).toBeTruthy();
  });
});
