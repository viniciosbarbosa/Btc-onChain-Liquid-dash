import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip Component', () => {
  it('renders the trigger element', () => {
    render(
      <Tooltip text="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip content on mouse enter and hides on mouse leave', () => {
    render(
      <Tooltip text="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    
    // Initially not visible
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
    
    // Mouse enter
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    // Now it should be visible
    const tooltip = screen.getByText('Tooltip content');
    expect(tooltip).toBeInTheDocument();
    
    // Mouse leave
    fireEvent.mouseLeave(trigger);
    
    // Should be hidden again
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });
});
