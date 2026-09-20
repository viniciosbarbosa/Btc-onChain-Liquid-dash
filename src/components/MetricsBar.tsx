import React, { useEffect, useState } from 'react';
import { explorerService } from '../services/explorerService';
import { formatUSD, formatBRL, calculateMoscowTime, formatNumber } from '../utils/formatters';
import { DollarSign, Flame, Cpu, Clock, Activity } from 'lucide-react';

interface MetricsState {
  priceUSD: number;
  priceBRL: number;
  fees: { fastestFee: number; halfHourFee: number; hourFee: number; minimumFee: number };
  mempoolCount: number;
  hashrate: string;
  diffAdj: string;
  halvingBlocks: number;
}

export function MetricsBar(): JSX.Element {
  const [metrics, setMetrics] = useState<MetricsState>({
    priceUSD: 65420,
    priceBRL: 360000,
    fees: { fastestFee: 18, halfHourFee: 12, hourFee: 8, minimumFee: 3 },
    mempoolCount: 145200,
    hashrate: '645.2 EH/s',
    diffAdj: '+1.4%',
    halvingBlocks: 184500
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [priceData, feeData, mempoolData] = await Promise.allSettled([
          explorerService.getPrice(),
          explorerService.getMempoolFees(),
          explorerService.getMempoolCount()
        ]);

        const newMetrics = { ...metrics };

        if (priceData.status === 'fulfilled' && priceData.value?.data) {
          const p = priceData.value.data;
          newMetrics.priceUSD = p.USD || p.usd || 65420;
          newMetrics.priceBRL = p.BRL || p.brl || newMetrics.priceUSD * 5.5;
        }

        if (feeData.status === 'fulfilled' && feeData.value?.data) {
          const f = feeData.value.data;
          newMetrics.fees = {
            fastestFee: f.fastestFee || 18,
            halfHourFee: f.halfHourFee || 12,
            hourFee: f.hourFee || 8,
            minimumFee: f.minimumFee || 3
          };
        }

        if (mempoolData.status === 'fulfilled' && mempoolData.value?.data) {
          newMetrics.mempoolCount = typeof mempoolData.value.data === 'number' 
            ? mempoolData.value.data 
            : mempoolData.value.data?.count || 145200;
        }

        setMetrics(newMetrics);
      } catch (err) {
        console.error('Error fetching metrics bar:', err);
      }
    }

    loadData();
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, []);

  const moscowTime = calculateMoscowTime(metrics.priceUSD);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
      
      {/* Price & Moscow Time */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-amber-500/40 transition duration-300">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Preço BTC</span>
          <DollarSign className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-xl font-extrabold text-white tracking-tight">
          {formatUSD(metrics.priceUSD)}
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
          <span>{formatBRL(metrics.priceBRL)}</span>
          <span className="text-amber-400 font-bold">{moscowTime} sats/$</span>
        </div>
      </div>

      {/* Fees (Sat/vB) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-amber-500/40 transition duration-300">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Taxas Recomendadas</span>
          <Flame className="w-4 h-4 text-orange-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-amber-400">{metrics.fees.fastestFee}</span>
          <span className="text-xs text-slate-400 font-mono">sat/vB (High)</span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
          <span>Med: {metrics.fees.halfHourFee} sat/vB</span>
          <span>Low: {metrics.fees.hourFee} sat/vB</span>
        </div>
      </div>

      {/* Mempool Depth */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-amber-500/40 transition duration-300">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Mempool Pendente</span>
          <Activity className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-xl font-extrabold text-white tracking-tight">
          {formatNumber(metrics.mempoolCount)}
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
          <span>Tx em Fila</span>
          <span className="text-emerald-400 font-semibold">Ativa</span>
        </div>
      </div>

      {/* Network Hashrate */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-amber-500/40 transition duration-300">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Hashrate Estimado</span>
          <Cpu className="w-4 h-4 text-purple-400" />
        </div>
        <div className="text-xl font-extrabold text-white tracking-tight">
          {metrics.hashrate}
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
          <span>Ajuste Dificuldade:</span>
          <span className="text-emerald-400 font-semibold">{metrics.diffAdj}</span>
        </div>
      </div>

      {/* Halving Countdown */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-amber-500/40 transition duration-300 col-span-2 md:col-span-4 lg:col-span-1">
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
          <span>Próximo Halving</span>
          <Clock className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-xl font-extrabold text-white tracking-tight">
          ~2028
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
          <span>Recompensa Bloco:</span>
          <span className="text-amber-400 font-bold">3.125 BTC</span>
        </div>
      </div>

    </div>
  );
}
