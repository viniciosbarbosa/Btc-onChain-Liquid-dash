import React, { useState, FormEvent } from 'react';
import { useNode } from '../context/NodeContext';
import { NodeConfig, TorGatewayMode } from '../types';
import { Server, Shield, CheckCircle, XCircle, RefreshCw, Radio, Globe } from 'lucide-react';
import { Modal, Button, Input } from './ui';
import { useTranslation } from '../context/LanguageContext';

export function NodeConfigModal(): JSX.Element | null {
  const { nodeConfig, updateConfig, isModalOpen, setIsModalOpen, nodeStatus, checkConnection } = useNode();
  const { t } = useTranslation();
  
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
  const isDev = import.meta.env.DEV;

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
      title={t('nodeConfigTitle')}
      subtitle={t('nodeConfigSubtitle')}
      maxWidth="2xl"
    >
      {/* Environment Mode Banner */}
      <div className={`p-3 rounded-xl mb-4 text-xs font-mono flex items-center justify-between border ${
        isDev
          ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
          : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
      }`}>
        <span>
          {isDev
            ? '⚙️ Development Mode: Prioritizing Local / Tor Node'
            : '🌐 Production Mode: Auto-Routing to 3rd-Party Public APIs (mempool.space & blockstream.info)'}
        </span>
        <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
          {isDev ? 'DEV' : 'PROD'}
        </span>
      </div>

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
          <Globe className="w-4 h-4" /> {t('tabBitcoinExplorer')}
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
          <Shield className="w-4 h-4" /> {t('tabElementsRpc')}
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
          {t('tabTorGateway')}
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
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('currentStatus')}</span>
              <p className="text-sm font-bold text-white">
                {nodeStatus === 'connected_umbrel' && t('statusUmbrel')}
                {nodeStatus === 'connected_public' && t('statusPublic')}
                {nodeStatus === 'error' && t('statusError')}
                {nodeStatus === 'checking' && t('statusChecking')}
              </p>
            </div>
          </div>

          <Button type="button" variant="ghost" size="sm" onClick={checkConnection}>
            {t('testConnection')}
          </Button>
        </div>

        {activeTab === 'umbrel' && (
          <div className="space-y-4">
            <Input
              label={t('umbrelInputLabel')}
              value={formData.umbrelApiUrl}
              onChange={(e) => setFormData({ ...formData, umbrelApiUrl: e.target.value })}
              placeholder="http://umbrel.local:3002/api"
            />

            <Input
              label={t('publicFallbackLabel')}
              value={formData.btcPublicApi}
              onChange={(e) => setFormData({ ...formData, btcPublicApi: e.target.value })}
            />
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="space-y-4">
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-xs text-cyan-200">
              <span className="font-bold">{t('elementsSavedTitle')}</span>
              <p className="mt-1 text-[11px] text-cyan-300/80">{t('elementsSavedDesc')}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('rpcHostLabel')}
                value={formData.elementsNode.rpcHost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    elementsNode: { ...formData.elementsNode, rpcHost: e.target.value }
                  })
                }
              />
              <Input
                label={t('rpcPortLabel')}
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
                label={t('rpcUserLabel')}
                value={formData.elementsNode.rpcUser}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    elementsNode: { ...formData.elementsNode, rpcUser: e.target.value }
                  })
                }
              />
              <Input
                label={t('rpcPassLabel')}
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
              <span className="font-bold">{t('torResolverTitle')}</span>
              <p className="mt-1 text-[11px] text-purple-300/80">{t('torResolverDesc')}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">{t('selectTorResolver')}</label>
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
            {t('cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {t('saveConfigBtn')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

