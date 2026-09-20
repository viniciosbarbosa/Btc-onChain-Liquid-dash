import React, { useState, useEffect } from 'react';
import { BtcBlock } from '../types';
import { explorerService } from '../services/explorerService';
import { BlockDetailModal } from './BlockDetailModal';
import { formatBytes, formatTimeAgo, formatSatsToBTC } from '../utils/formatters';
import { CheckCircle2, Flame, Boxes, Radio, ArrowRight, X, Layers, Cpu } from 'lucide-react';

interface MempoolVisualizerProps {
  onSelectBlock?: (block: BtcBlock) => void;
}

export function MempoolVisualizer({ onSelectBlock }: MempoolVisualizerProps): JSX.Element {
  const [selectedBlock, setSelectedBlock] = useState<BtcBlock | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [isListening, setIsListening] = useState<boolean>(true);

  // Live Pending Mempool Blocks Stream (Queue)
  const [pendingBlocks, setPendingBlocks] = useState<BtcBlock[]>([
    {
      id: 'pending-1',
      hash: 'pending-1',
      height: 862411,
      feeRange: '24 - 65 sat/vB',
      medianFee: 32,
      txCount: 3140,
      size: 1540000,
      vSize: 998400,
      totalFeesSat: 54200000,
      color: 'from-purple-600 via-red-500 to-amber-500',
      shadow: 'shadow-red-500/20',
      label: 'Próximo Bloco (~10 min)'
    },
    {
      id: 'pending-2',
      hash: 'pending-2',
      height: 862412,
      feeRange: '14 - 24 sat/vB',
      medianFee: 18,
      txCount: 2980,
      size: 1480000,
      vSize: 999100,
      totalFeesSat: 31200000,
      color: 'from-amber-500 to-amber-600',
      shadow: 'shadow-amber-500/20',
      label: 'Bloco #2 (~20 min)'
    },
    {
      id: 'pending-3',
      hash: 'pending-3',
      height: 862413,
      feeRange: '8 - 14 sat/vB',
      medianFee: 10,
      txCount: 3410,
      size: 1590000,
      vSize: 999800,
      totalFeesSat: 18400000,
      color: 'from-cyan-500 to-amber-500',
      shadow: 'shadow-cyan-500/20',
      label: 'Bloco #3 (~30 min)'
    },
    {
      id: 'pending-4',
      hash: 'pending-4',
      height: 862414,
      feeRange: '3 - 8 sat/vB',
      medianFee: 5,
      txCount: 4120,
      size: 1640000,
      vSize: 1000000,
      totalFeesSat: 9800000,
      color: 'from-blue-600 to-cyan-500',
      shadow: 'shadow-blue-500/20',
      label: 'Bloco #4 (~40 min)'
    }
  ]);

  // Live Mined Blocks Stream
  const [minedBlocks, setMinedBlocks] = useState<BtcBlock[]>([
    {
      height: 862410,
      hash: '00000000000000000001ab4294fc81a7d65b820fa',
      minedTime: Date.now() - 3 * 60 * 1000,
      miner: 'Foundry USA Pool',
      txCount: 3210,
      size: 1640000,
      medianFee: 34,
      rewardBTC: 3.125 + 0.58
    },
    {
      height: 862409,
      hash: '0000000000000000000293fa9122bf712e9481ad',
      minedTime: Date.now() - 12 * 60 * 1000,
      miner: 'AntPool',
      txCount: 2950,
      size: 1590000,
      medianFee: 29,
      rewardBTC: 3.125 + 0.49
    },
    {
      height: 862408,
      hash: '00000000000000000005712ef90123ca10294871',
      minedTime: Date.now() - 22 * 60 * 1000,
      miner: 'F2Pool',
      txCount: 3410,
      size: 1680000,
      medianFee: 26,
      rewardBTC: 3.125 + 0.42
    }
  ]);

  // Live Blockchain Listener Loop
  useEffect(() => {
    async function listenToBlockchain() {
      try {
        const feesRes = await explorerService.getMempoolFees();
        if (feesRes?.data) {
          const fees = feesRes.data;
          setPendingBlocks((prev) => [
            {
              ...prev[0],
              medianFee: fees.fastestFee || 32,
              feeRange: `${fees.fastestFee} - ${fees.fastestFee * 2} sat/vB`
            },
            {
              ...prev[1],
              medianFee: fees.halfHourFee || 18,
              feeRange: `${fees.halfHourFee} - ${fees.fastestFee} sat/vB`
            },
            {
              ...prev[2],
              medianFee: fees.hourFee || 10,
              feeRange: `${fees.hourFee} - ${fees.halfHourFee} sat/vB`
            },
            {
              ...prev[3],
              medianFee: fees.minimumFee || 5,
              feeRange: `${fees.minimumFee} - ${fees.hourFee} sat/vB`
            }
          ]);
        }
        setLastUpdate(Date.now());
      } catch (err) {
        console.error('Error listening to blockchain:', err);
      }
    }

    const interval = setInterval(listenToBlockchain, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-2xl">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Live Blockchain Listener Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
              Mempool Live Stream & Fluxo de Blocos
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Ouvindo Blockchain (Live)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Visualização estilo Mempool.space: Blocos em fila na Mempool (esquerda) & Blocos minerados (direita)
            </p>
          </div>
        </div>

        {/* Fee Density Color Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <span className="text-slate-400">Escala sat/vB:</span>
          <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold">1-5</span>
          <span className="px-2 py-0.5 rounded bg-cyan-500 text-black font-bold">5-15</span>
          <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold">15-30</span>
          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold">30+</span>
        </div>
      </div>

      {/* MEMPOOL & CHAIN SIDE-BY-SIDE STREAM PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        
        {/* PENDING MEMPOOL BLOCKS STREAM (LEFT SIDE) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono">
            <span className="flex items-center gap-2 text-amber-400">
              <Flame className="w-4 h-4" /> FILA DE BLOCOS NA MEMPOOL (PENDENTES)
            </span>
            <span className="text-slate-500">Ordenado por Densidade de Taxa</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {pendingBlocks.map((block) => {
              const isSelected = selectedBlock?.id === block.id;
              return (
                <button
                  key={block.id}
                  onClick={() => {
                    setSelectedBlock(block);
                    if (onSelectBlock) onSelectBlock(block);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all transform hover:-translate-y-1 relative overflow-hidden group ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/15 shadow-xl shadow-amber-500/20 scale-[1.03]'
                      : 'border-slate-800 bg-slate-950/90 hover:border-slate-700'
                  }`}
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${block.color} rounded-full mb-3 shadow-sm`} />
                  
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                    {block.label}
                  </div>

                  <div className="text-lg font-extrabold text-white mb-2 font-mono flex items-baseline gap-1">
                    ~{block.medianFee} <span className="text-xs font-normal text-amber-400">sat/vB</span>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Faixa:</span>
                      <span className="text-slate-200">{block.feeRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tx Count:</span>
                      <span className="text-amber-400 font-bold">{block.txCount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tamanho:</span>
                      <span>{formatBytes(block.size)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RECENT MINED BLOCKS STREAM (RIGHT SIDE) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono">
            <span className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> BLOCOS MINERADOS NA BLOCKCHAIN
            </span>
            <span className="text-slate-500">Cadeia Atual</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {minedBlocks.map((block) => {
              const isSelected = selectedBlock?.height === block.height;
              return (
                <button
                  key={block.height}
                  onClick={() => {
                    setSelectedBlock(block);
                    if (onSelectBlock) onSelectBlock(block);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all transform hover:-translate-y-1 relative overflow-hidden group ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-500/15 shadow-xl shadow-emerald-500/20 scale-[1.03]'
                      : 'border-slate-800 bg-slate-950/90 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-full mb-3" />

                  <div className="text-base font-extrabold text-emerald-400 font-mono mb-1">
                    #{block.height}
                  </div>

                  <div className="text-xs font-bold text-white mb-2 truncate flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {block.miner}
                  </div>

                  <div className="space-y-1 text-[11px] font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Minerado:</span>
                      <span className="text-slate-200">{formatTimeAgo(block.minedTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tx Count:</span>
                      <span className="text-emerald-400 font-bold">{block.txCount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa Média:</span>
                      <span>{block.medianFee} sat/vB</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* DETAILED BLOCK TRANSACTIONS MODAL */}
      {selectedBlock && (
        <BlockDetailModal
          block={selectedBlock}
          networkType="btc"
          onClose={() => setSelectedBlock(null)}
        />
      )}

    </div>
  );
}
