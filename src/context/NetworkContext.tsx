import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { NetworkType, ActiveTabType, SearchTypeResult } from '../types';
import { detectSearchType } from '../utils/btcValidator';

interface NetworkContextType {
  network: NetworkType;
  setNetwork: (net: NetworkType) => void;
  switchNetwork: (net: NetworkType) => void;
  searchQuery: string;
  searchTarget: { query: string; type: SearchTypeResult | null } | null;
  handleSearch: (query: string, type?: any) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [network, setNetwork] = useState<NetworkType>('btc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchTarget, setSearchTarget] = useState<{ query: string; type: SearchTypeResult | null } | null>(null);

  const handleSearch = (query: string, type = null) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearchQuery(trimmed);
    const parsed = detectSearchType(trimmed);
    setSearchTarget({ query: trimmed, type: parsed });

    const isLiquidAssetHash = 
      trimmed.toLowerCase() === '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d' ||
      trimmed.toLowerCase() === 'ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258fea9806a58fbd';

    if (isLiquidAssetHash) {
      navigate(`/asset/${trimmed}`);
    } else if (parsed.type === 'xpub') {
      navigate(`/xpub/${trimmed}`);
    } else if (parsed.type === 'address') {
      navigate(`/address/${trimmed}`);
    } else {
      navigate(`/tx/${trimmed}`);
    }
  };

  const switchNetwork = (newNet: NetworkType) => {
    setNetwork(newNet);
    if (newNet === 'liquid') {
      navigate('/liquid');
    } else {
      navigate('/');
    }
  };

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
        switchNetwork,
        searchQuery,
        searchTarget,
        handleSearch
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextType {
  const context = useContext(NetworkContext);
  if (!context) throw new Error('useNetwork must be used within NetworkProvider');
  return context;
}
