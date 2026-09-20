import React, { useState, FormEvent } from 'react';
import { useNode } from '../context/NodeContext';
import { NodeConfig, TorGatewayMode } from '../types';
import { Server, Shield, CheckCircle, XCircle, RefreshCw, Radio, Globe } from 'lucide-react';
import { Modal, Button, Input, Badge } from './ui';

export function NodeConfigModal(): JSX.Element | null {
  const { nodeConfig, updateConfig, isModalOpen, setIsModalOpen, nodeStatus, checkConnection } = useNode();
  
  const [formData, setFormData] = useState<NodeConfig>({
    torGatewayMode: nodeConfig.torGatewayMode || 'onion.ly',
    localTorProxyUrl: nodeConfig.localTorProxyUrl || 'http://localhost:9050',
    umbrelApiUrl: nodeConfig.umbrelApiUrl || 'http://umbrel.local:3002/api',
    btcPublicApi: nodeConfig.btcPublicApi || 'https://mempool.space/api',
    liquidPublicApi: nodeConfig.liquidPublicApi || 'https://blockstream.info/liquid/api',
    elementsNode: {
      p2pHost: nodeConfig.elementsNode?.p2pHost || 'your-liquid-p2p-node.onion',
      p2pPort: nodeConfig.elementsNode?.p2pPort || 18332,
      rpcHost: nodeConfig.elementsNode?.rpcHost || 'your-liquid-rpc-node.onion',
      rpcPort: nodeConfig.elementsNode?.rpcPort || 7041,
      rpcUser: nodeConfig.elementsNode?.rpcUser || 'elements',
      rpcPass: nodeConfig.elementsNode?.rpcPass || 'YOUR_ELEMENTS_RPC_PASSWORD',
      electrumHost: nodeConfig.elementsNode?.electrumHost || 'your-liquid-electrum-node.onion',
      electrumPort: nodeConfig.elementsNode?.electrumPort || 50001
    }
  });

  const [activeTab, setActiveTab] = useState<'umbrel' | 'elements' | 'tor'>('umbrel');

  if (!isModalOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    setIsModalOpen(false);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      icon={<Server className="w-5 h-5 text-amber-400" />}
      title="Configuração do Nó Tor (.onion) & Gateway"
      subtitle="Ambiente Profissional com suporte a Tor Gateway e credenciais .onion"
      maxWidth="2xl"
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 -mt-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('umbrel')}
          className={`py-2.5 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'umbrel'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" /> BitcoinExplorer (.onion)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('elements')}
          className={`py-2.5 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'elements'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" /> Elements Core RPC (Liquid)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tor')}
          className={`py-2.5 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'tor'
              ? 'border-purple-400 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🧅 Tor Gateway Resolver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status Indicator */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-3">
            {nodeStatus === 'connected_umbrel' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
            {nodeStatus === 'connected_public' && <Radio className="w-5 h-5 text-amber-400 animate-pulse" />}
            {nodeStatus === 'error' && <XCircle className="w-5 h-5 text-rose-500" />}
            {nodeStatus === 'checking' && <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />}

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status Atual:</span>
              <p className="text-sm font-bold text-white">
                {nodeStatus === 'connected_umbrel' && 'Conectado ao Nó Próprio (.onion API)'}
                {nodeStatus === 'connected_public' && 'Conectado às APIs Públicas (Fallback)'}
                {nodeStatus === 'error' && 'Erro de Conexão com o Endpoint'}
                {nodeStatus === 'checking' && 'Verificando conectividade...'}
              </p>
            </div>
          </div>

          <Button type="button" variant="ghost" size="sm" onClick={checkConnection}>
            Testar Conexão
          </Button>
        </div>

        {activeTab === 'umbrel' && (
          <div className="space-y-4">
            <Input
              label="URL/Host da API BitcoinExplorer (.onion ou Local)"
              value={formData.umbrelApiUrl}
              onChange={(e) => setFormData({ ...formData, umbrelApiUrl: e.target.value })}
              placeholder="http://umbrel.local:3002/api"
            />

            <Input
              label="Fallback Público (Mempool.space API)"
              value={formData.btcPublicApi}
              onChange={(e) => setFormData({ ...formData, btcPublicApi: e.target.value })}
            />
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="space-y-4">
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-xs text-cyan-200">
              <span className="font-bold">Credenciais salvas do nó Elements Core (.onion):</span>
              <p className="mt-1 text-[11px] text-cyan-300/80">Comunicação direta com o nó Liquid RPC fornecido pelo usuário.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Host RPC (.onion)"
                value={formData.elementsNode.rpcHost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    elementsNode: { ...formData.elementsNode, rpcHost: e.target.value }
                  })
                }
              />
              <Input
                label="Porta RPC"
                type="number"
                value={formData.elementsNode.rpcPort}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    elementsNode: { ...formData.elementsNode, rpcPort: parseInt(e.target.value, 10) || 7041 }
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="RPC Username"
                value={formData.elementsNode.rpcUser}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    elementsNode: { ...formData.elementsNode, rpcUser: e.target.value }
                  })
                }
              />
              <Input
                label="RPC Password"
                type="password"
                value={formData.elementsNode.rpcPass}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    elementsNode: { ...formData.elementsNode, rpcPass: e.target.value }
                  })
                }
              />
            </div>
          </div>
        )}

        {activeTab === 'tor' && (
          <div className="space-y-4">
            <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl text-xs text-purple-200">
              <span className="font-bold">Modo de Resolução Tor Gateway (.onion):</span>
              <p className="mt-1 text-[11px] text-purple-300/80">Permite que o navegador web resolva domínios `.onion` nativamente sem necessidade de plugin adicional.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Selecione o Resolver Tor:</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'onion.ly', name: 'Onion.ly Gateway' },
                  { id: 'onion.pet', name: 'Onion.pet Gateway' },
                  { id: 'direct', name: 'SOCKS5 Local (Direct)' }
                ].map((gateway) => (
                  <button
                    type="button"
                    key={gateway.id}
                    onClick={() => setFormData({ ...formData, torGatewayMode: gateway.id as TorGatewayMode })}
                    className={`p-3 rounded-xl border text-xs font-mono font-bold transition text-center ${
                      formData.torGatewayMode === gateway.id
                        ? 'border-purple-400 bg-purple-500/10 text-purple-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {gateway.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Salvar Configurações TS
          </Button>
        </div>
      </form>
    </Modal>
  );
}

