import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NodeConfig } from '../types';
import { getNodeConfig, saveNodeConfig } from '../config/apiEndpoints';
import { explorerService } from '../services/explorerService';

export type NodeConnectionStatus = 'connected_umbrel' | 'connected_public' | 'checking' | 'error';

interface NodeContextType {
  nodeConfig: NodeConfig;
  nodeStatus: NodeConnectionStatus;
  nodeDetails: { name: string; tip?: any } | null;
  updateConfig: (config: NodeConfig) => void;
  checkConnection: () => Promise<void>;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const NodeContext = createContext<NodeContextType | undefined>(undefined);

export function NodeProvider({ children }: { children: ReactNode }) {
  const [nodeConfig, setNodeConfig] = useState<NodeConfig>(getNodeConfig());
  const [nodeStatus, setNodeStatus] = useState<NodeConnectionStatus>('checking');
  const [nodeDetails, setNodeDetails] = useState<{ name: string; tip?: any } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const checkConnection = async () => {
    setNodeStatus('checking');
    try {
      const tipRes = await explorerService.getTip();
      if (tipRes.source === 'umbrel') {
        setNodeStatus('connected_umbrel');
        setNodeDetails({ name: 'Nó Próprio (.onion / Umbrel API)', tip: tipRes.data });
      } else {
        setNodeStatus('connected_public');
        setNodeDetails({ name: 'Public APIs (Fallback)', tip: tipRes.data });
      }
    } catch (e) {
      setNodeStatus('error');
      setNodeDetails(null);
    }
  };

  useEffect(() => {
    checkConnection();
  }, [nodeConfig]);

  const updateConfig = (newConfig: NodeConfig) => {
    setNodeConfig(newConfig);
    saveNodeConfig(newConfig);
    checkConnection();
  };

  return (
    <NodeContext.Provider
      value={{
        nodeConfig,
        nodeStatus,
        nodeDetails,
        updateConfig,
        checkConnection,
        isModalOpen,
        setIsModalOpen
      }}
    >
      {children}
    </NodeContext.Provider>
  );
}

export function useNode(): NodeContextType {
  const context = useContext(NodeContext);
  if (!context) throw new Error('useNode must be used within NodeProvider');
  return context;
}
