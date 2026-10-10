import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TxSkeletonLoader, BlockTxSkeletonLoader } from './SkeletonLoader';

describe('SkeletonLoader Components', () => {
  describe('TxSkeletonLoader', () => {
    it('renders without crashing', () => {
      const { container } = render(<TxSkeletonLoader />);
      
      // Ensure the animate-pulse class is applied for the skeleton effect
      expect(container.firstChild).toHaveClass('animate-pulse');
    });
  });

  describe('BlockTxSkeletonLoader', () => {
    it('renders exactly 5 skeleton items', () => {
      const { container } = render(<BlockTxSkeletonLoader />);
      
      // Ensure the animate-pulse class is applied
      expect(container.firstChild).toHaveClass('animate-pulse');
      
      // It should render exactly 5 children inside the container
      expect(container.firstChild?.childNodes.length).toBe(5);
    });
  });
});
