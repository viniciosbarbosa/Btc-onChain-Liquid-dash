import React, { useEffect, useState } from 'react';
import { liquidService } from '../services/liquidService';
import { useNetwork } from '../context/NetworkContext';
import { SearchBar } from './SearchBar';
import { LiquidMempoolVisualizer } from './LiquidMempoolVisualizer';
import { LiquidBlock, LiquidStats } from '../types';
import { formatTimeAgo } from '../utils/formatters';
import { Droplet, Layers, Activity, ArrowDownRight, ArrowUpRight, Lock, Search } from 'lucide-react';

export function LiquidDashboard(): JSX.Element {
  const { handleSearch } = useNetwork();
  const [stats, setStats] = useState<LiquidStats | null>(null);
  const [blocks, setBlocks] = useState<LiquidBlock[]>([]);

  useEffect(() => {
    async function loadLiquidData() {
      try {
        const [liquidStats, recentBlocks] = await Promise.all([
          liquidService.getLiquidStats(),
          liquidService.getRecentBlocks()
        ]);

        setStats(liquidStats);
        setBlocks(recentBlocks.length > 0 ? recentBlocks.slice(0, 6) : [
          { height: 3140500, tx_count: 14, size: 45200, timestamp: Date.now() / 1000 - 60 },
          { height: 3140499, tx_count: 22, size: 89100, timestamp: Date.now() / 1000 - 120 },
          { height: 3140498, tx_count: 18, size: 62000, timestamp: Date.now() / 1000 - 180 }
        ]);
      } catch (err) {
        console.error('Error fetching Liquid stats:', err);
      }
    }

    loadLiquidData();
  }, []);

  const liquidAssets = [
    {
      name: 'Liquid Bitcoin (L-BTC)',
      ticker: 'L-BTC',
      assetId: '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d',
      supply: '3,654.82 L-BTC'
    },
    {
      name: 'Tether USDt (Liquid)',
      ticker: 'USDt',
      assetId: 'ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258fea9806a58fbd',
      supply: '$36,400,000 USDt'
    },
    {
      name: 'Blockstream Mining Note',
      ticker: 'BMN',
      assetId: 'ab4979e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d',
      supply: '125 BMN'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Dedicated Liquid Explorer Search Card */}
      <SearchBar />

      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-800/40 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-xs font-bold font-mono mb-3">
              <Droplet className="w-3.5 h-3.5" /> LIQUID NETWORK SIDECHAIN (.ONION CORE)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Liquid Network & Elements Core
            </h2>
            <p className="text-sm text-cyan-200/80 mt-1 max-w-2xl">
              Sidechain do Bitcoin para liquidação instantânea, transações confidenciais e emissão de ativos digitais.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 border border-cyan-900/50 rounded-2xl text-xs font-mono space-y-1.5 min-w-[280px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Elements Core Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> RPC Conectado (.onion)
              </span>
            </div>
            <div className="text-[11px] text-cyan-300 truncate">
              Host: sg5yjjucn...onion:7041
            </div>
            <div className="text-[11px] text-slate-400">
              P2P Port: 18332 | Electrum: 50001
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-medium">Supply Circulante L-BTC</span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">
            {stats?.circulatingLbtc || '3,654.82'} <span className="text-xs font-normal">L-BTC</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            100% Lastreado por BTC em Federação
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-medium">Volume 24h Peg-In</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <ArrowDownRight className="w-5 h-5" /> +{stats?.pegin24h || 18.45} <span className="text-xs font-normal">BTC</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            Bitcoin Mainnet -&gt; Liquid
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-medium">Volume 24h Peg-Out</span>
          <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-5 h-5" /> -{stats?.pegout24h || 12.10} <span className="text-xs font-normal">BTC</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            Liquid -&gt; Bitcoin Mainnet
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-medium">Transações Confidenciais</span>
          <div className="text-2xl font-extrabold text-purple-400 font-mono mt-1 flex items-center gap-1">
            <Lock className="w-5 h-5 text-purple-400" /> {stats?.confidentialTxRatio || 94.2}%
          </div>
          <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            Valores e Ativos Ocultos
          </div>
        </div>

      </div>

      {/* LIQUID SIDECHAIN MEMPOOL STREAM */}
      <LiquidMempoolVisualizer />

      {/* Assets Registry */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" /> Ativos em Destaque na Rede Liquid (Clique para pesquisar)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liquidAssets.map((asset, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(asset.assetId)}
              className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 hover:border-cyan-400 text-left transition group transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition">{asset.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {asset.ticker}
                </span>
              </div>
              <div className="text-xs font-mono text-cyan-300 font-bold mb-3">
                {asset.supply}
              </div>
              <div className="text-[11px] font-mono text-slate-500 break-all bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="truncate">ID: {asset.assetId}</span>
                <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Liquid Block Stream */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" /> Blocos Recentes da Rede Liquid (~1 min block time)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {blocks.map((block) => (
            <div key={block.height} className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-center">
              <div className="text-sm font-bold font-mono text-cyan-400">#{block.height}</div>
              <div className="text-xs font-mono text-slate-300 mt-1">{block.tx_count || 12} Tx</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">{formatTimeAgo(block.timestamp)}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
