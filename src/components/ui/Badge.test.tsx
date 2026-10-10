import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default classes (amber)', () => {
    render(<Badge>Default</Badge>);
    // The inner span has the text, but the parent has the classes.
    // So we need to select the parent element of the text.
    const textElement = screen.getByText('Default');
    const badge = textElement.parentElement;
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'bg-amber-500/10');
  });

  it('applies variant classes correctly (e.g., emerald)', () => {
    render(<Badge variant="emerald">Emerald</Badge>);
    const textElement = screen.getByText('Emerald');
    const badge = textElement.parentElement;
    expect(badge).toHaveClass('bg-emerald-500/10', 'text-emerald-400');
  });
});
