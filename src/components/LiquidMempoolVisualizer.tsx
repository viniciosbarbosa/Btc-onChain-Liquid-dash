import React, { useState, useEffect } from 'react';
import { LiquidBlock, BtcBlock } from '../types';
import { liquidService } from '../services/liquidService';
import { BlockDetailModal } from './BlockDetailModal';
import { formatBytes, formatTimeAgo } from '../utils/formatters';
import { Droplet, Flame, CheckCircle2, ShieldCheck, Lock, Activity, Layers } from 'lucide-react';

interface LiquidMempoolVisualizerProps {
  onSelectBlock?: (block: any) => void;
}

export function LiquidMempoolVisualizer({ onSelectBlock }: LiquidMempoolVisualizerProps): JSX.Element {
  const [selectedBlock, setSelectedBlock] = useState<any | null>(null);

  const pendingLiquidBlocks = [
    {
      id: 'liquid-pending-1',
      label: 'Próximo Bloco Liquid (~1 min)',
      medianFee: 0.1,
      confidentialTxCount: 18,
      peginCount: 2,
      pegoutCount: 1,
      size: 48200,
      color: 'from-cyan-500 via-blue-600 to-indigo-600',
      assetBreakdown: '12 L-BTC, 5 USDt, 1 BMN'
    },
    {
      id: 'liquid-pending-2',
      label: 'Bloco Liquid #2 (~2 min)',
      medianFee: 0.1,
      confidentialTxCount: 14,
      peginCount: 1,
      pegoutCount: 0,
      size: 32100,
      color: 'from-blue-600 to-cyan-500',
      assetBreakdown: '10 L-BTC, 4 USDt'
    }
  ];

  const [minedBlocks, setMinedBlocks] = useState<LiquidBlock[]>([
    { height: 3140502, tx_count: 24, size: 68400, timestamp: Date.now() / 1000 - 45 },
    { height: 3140501, tx_count: 19, size: 52100, timestamp: Date.now() / 1000 - 105 },
    { height: 3140500, tx_count: 31, size: 94200, timestamp: Date.now() / 1000 - 165 },
    { height: 3140499, tx_count: 16, size: 41000, timestamp: Date.now() / 1000 - 225 }
  ]);

  useEffect(() => {
    async function loadBlocks() {
      try {
        const blocks = await liquidService.getRecentBlocks();
        if (blocks && blocks.length > 0) {
          setMinedBlocks(blocks.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching Liquid blocks:', err);
      }
    }
    loadBlocks();
  }, []);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              Liquid Sidechain Mempool & Blocos
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                ~1 min Block Target
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Visualizador de blocos confidenciais na fila da Sidechain (esquerda) e blocos minerados pela Federação (direita)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <span className="text-slate-400">Federação Liquid:</span>
          <span className="text-cyan-400 font-bold">15 Nós Ativos</span>
        </div>
      </div>

      {/* Side-by-Side Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PENDING LIQUID QUEUE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono">
            <span className="flex items-center gap-2 text-cyan-400">
              <Flame className="w-4 h-4" /> FILA DE BLOCOS LIQUID (PENDENTES)
            </span>
            <span className="text-slate-500">Confidential Transactions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pendingLiquidBlocks.map((block) => (
              <button
                key={block.id}
                onClick={() => {
                  setSelectedBlock(block);
                  if (onSelectBlock) onSelectBlock(block);
                }}
                className={`p-4 rounded-2xl border text-left transition-all transform hover:-translate-y-1 relative overflow-hidden group ${
                  selectedBlock?.id === block.id
                    ? 'border-cyan-400 bg-cyan-500/15 shadow-xl shadow-cyan-500/20 scale-[1.03]'
                    : 'border-slate-800 bg-slate-950/90 hover:border-slate-700'
                }`}
              >
                <div className={`h-2 w-full bg-gradient-to-r ${block.color} rounded-full mb-3 shadow-sm`} />
                
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                  {block.label}
                </div>

                <div className="text-base font-extrabold text-cyan-300 mb-2 font-mono flex items-center gap-1">
                  <Lock className="w-4 h-4 text-purple-400" /> {block.confidentialTxCount} Tx Confidenciais
                </div>

                <div className="space-y-1 text-[11px] font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Ativos:</span>
                    <span className="text-cyan-400 font-bold">{block.assetBreakdown}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peg-Ins / Peg-Outs:</span>
                    <span className="text-slate-200">+{block.peginCount} / -{block.pegoutCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tamanho:</span>
                    <span>{formatBytes(block.size)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RECENT LIQUID BLOCKS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono">
            <span className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> BLOCOS CONFIRMADOS NA SIDECHAIN
            </span>
            <span className="text-slate-500">Federação Elements</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {minedBlocks.map((block) => (
              <button
                key={block.height}
                onClick={() => {
                  setSelectedBlock(block);
                  if (onSelectBlock) onSelectBlock(block);
                }}
                className={`p-4 rounded-2xl border text-left transition-all transform hover:-translate-y-1 relative overflow-hidden group ${
                  selectedBlock?.height === block.height
                    ? 'border-cyan-400 bg-cyan-500/15 shadow-xl shadow-cyan-500/20 scale-[1.03]'
                    : 'border-slate-800 bg-slate-950/90 hover:border-cyan-500/30'
                }`}
              >
                <div className="h-2 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-full mb-3" />

                <div className="text-base font-extrabold text-cyan-400 font-mono mb-1">
                  #{block.height}
                </div>

                <div className="space-y-1 text-[11px] font-mono text-slate-400 mt-2">
                  <div className="flex justify-between">
                    <span>Tempo:</span>
                    <span className="text-slate-200">{formatTimeAgo(block.timestamp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tx Count:</span>
                    <span className="text-cyan-300 font-bold">{block.tx_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tamanho:</span>
                    <span>{formatBytes(block.size)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* DETAILED LIQUID BLOCK TRANSACTIONS MODAL */}
      {selectedBlock && (
        <BlockDetailModal
          block={selectedBlock}
          networkType="liquid"
          onClose={() => setSelectedBlock(null)}
        />
      )}
    </div>
  );
}
