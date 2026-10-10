import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WatchlistItem {
  id: string;
  type: 'address' | 'tx' | 'xpub' | 'asset';
  label: string;
  addedAt: number;
}

interface WatchlistContextType {
  items: WatchlistItem[];
  addItem: (item: Omit<WatchlistItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (item: Omit<WatchlistItem, 'addedAt'>) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }): JSX.Element {
  const [items, setItems] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('btc_dash_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('btc_dash_watchlist', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save watchlist:', e);
    }
  }, [items]);

  const addItem = (item: Omit<WatchlistItem, 'addedAt'>) => {
    setItems((prev) => {
      if (prev.some((i) => i.id.toLowerCase() === item.id.toLowerCase())) return prev;
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id.toLowerCase() !== id.toLowerCase()));
  };

  const isBookmarked = (id: string): boolean => {
    return items.some((i) => i.id.toLowerCase() === id.toLowerCase());
  };

  const toggleBookmark = (item: Omit<WatchlistItem, 'addedAt'>) => {
    if (isBookmarked(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  return (
    <WatchlistContext.Provider value={{ items, addItem, removeItem, isBookmarked, toggleBookmark }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist(): WatchlistContextType {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used within WatchlistProvider');
  return context;
}
