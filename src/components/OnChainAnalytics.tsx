import React, { useState, useEffect } from 'react';
import { explorerService } from '../services/explorerService';
import { formatSatsToBTC, formatFeeRate } from '../utils/formatters';
import { 
  Zap, 
  Clock, 
  Cpu, 
  TrendingUp, 
  ShieldAlert, 
  Layers, 
  Flame, 
  Activity,
  Calculator,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export function OnChainAnalytics(): JSX.Element {
  const { t } = useTranslation();
  // Halving Stats
  const currentBlockHeight = 862410;
  const nextHalvingBlock = 1050000;
  const blocksRemaining = nextHalvingBlock - currentBlockHeight;
  const progressPercent = ((currentBlockHeight - 840000) / (1050000 - 840000)) * 100;
  
  // Mining Difficulty & Hashrate State
  const [hashrate, setHashrate] = useState<string>('685.4 EH/s');
  const [diffAdjustment, setDiffAdjustment] = useState<{ change: number; daysRemaining: number; nextDiffDate: string }>({
    change: 1.84,
    daysRemaining: 6.2,
    nextDiffDate: '26 Set 2026'
  });

  // CPFP / RBF Fee Accelerator Calculator State
  const [currentFeeRate, setCurrentFeeRate] = useState<number>(12);
  const [txVsize, setTxVsize] = useState<number>(142);
  const [targetBlock, setTargetBlock] = useState<'next' | 'halfHour' | 'hour'>('next');
  
  const recommendedRates = {
    next: 34,
    halfHour: 22,
    hour: 14
  };

  const requiredFeeRate = recommendedRates[targetBlock];
  const currentFeePaidSats = currentFeeRate * txVsize;
  const requiredFeeTotalSats = requiredFeeRate * txVsize;
  const cpfpFeeNeededSats = Math.max(0, requiredFeeTotalSats - currentFeePaidSats);

  useEffect(() => {
    async function loadMiningStats() {
      try {
        const [hashRes, diffRes] = await Promise.all([
          explorerService.getHashrate(),
          explorerService.getDiffAdj()
        ]);
        if (hashRes?.data) setHashrate(hashRes.data.hashrate || '685.4 EH/s');
        if (diffRes?.data) setDiffAdjustment(diffRes.data);
      } catch (err) {
        console.warn('Using default mining stats:', err);
      }
    }
    loadMiningStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. HALVING COUNTDOWN & MINING DIFFICULTY DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Halving Clock Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">{t('halvingCountdown')}</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              5º Halving (~2028)
            </span>
          </div>

          <div className="space-y-4 font-mono">
            <div>
              <div className="text-2xl font-black text-amber-400 flex items-baseline gap-2">
                {blocksRemaining.toLocaleString()} <span className="text-xs text-slate-400 font-normal font-sans">blocos restantes</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Subvenção atual: <span className="text-white font-bold">3.125 BTC</span> &rarr; Próxima: <span className="text-emerald-400 font-bold">1.5625 BTC</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Progresso da Época (#840,000)</span>
                <span className="text-amber-400 font-bold">{progressPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500 shadow-lg shadow-amber-500/30"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mining Hashrate & Difficulty Adjustment Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/30 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Hashrate & Ajuste de Dificuldade</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Época ~2016 Blocos
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono">
            <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-sans">Hashrate Global</span>
              <div className="text-lg font-bold text-blue-400 mt-1">{hashrate}</div>
              <span className="text-[10px] text-slate-500">Poder Computacional</span>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-sans">Estimativa de Ajuste</span>
              <div className={`text-lg font-bold mt-1 ${diffAdjustment.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {diffAdjustment.change >= 0 ? `+${diffAdjustment.change}%` : `${diffAdjustment.change}%`}
              </div>
              <span className="text-[10px] text-slate-500">Em ~{diffAdjustment.daysRemaining} dias</span>
            </div>
          </div>
        </div>

        {/* Output Types Distribution Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/30 border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Tipos de Script de Saída</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Distribuição Mempool
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Native SegWit (P2WPKH / v0)</span>
                <span className="text-purple-400 font-bold">58.4%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '58.4%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Taproot (P2TR / v1)</span>
                <span className="text-emerald-400 font-bold">24.2%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '24.2%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Legacy (P2PKH) / Nested (P2SH)</span>
                <span className="text-amber-400 font-bold">17.4%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '17.4%' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. RBF & CPFP INTERACTIVE FEE ACCELERATOR CALCULATOR */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                Acelerador de Transações Bitcoin (RBF / CPFP) <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Simulador para acelerar transações presas na Mempool utilizando Replace-By-Fee (RBF) ou Child-Pays-For-Parent (CPFP)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form Inputs */}
          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-sans font-semibold">Taxa Atual da Transação Presa (sat/vB)</label>
              <input 
                type="number" 
                value={currentFeeRate}
                onChange={(e) => setCurrentFeeRate(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white font-bold"
                min="1"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-sans font-semibold">Tamanho Virtual da Tx (vBytes / vSize)</label>
              <input 
                type="number" 
                value={txVsize}
                onChange={(e) => setTxVsize(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white font-bold"
                min="50"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-sans font-semibold">Meta de Inclusão em Bloco</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetBlock('next')}
                  className={`py-2 px-3 rounded-xl border text-center font-bold text-[11px] transition ${
                    targetBlock === 'next'
                      ? 'bg-amber-500 text-black border-amber-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Próximo Bloco (~10m)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetBlock('halfHour')}
                  className={`py-2 px-3 rounded-xl border text-center font-bold text-[11px] transition ${
                    targetBlock === 'halfHour'
                      ? 'bg-amber-500 text-black border-amber-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  ~30 min
                </button>
                <button
                  type="button"
                  onClick={() => setTargetBlock('hour')}
                  className={`py-2 px-3 rounded-xl border text-center font-bold text-[11px] transition ${
                    targetBlock === 'hour'
                      ? 'bg-amber-500 text-black border-amber-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  ~1 hora
                </button>
              </div>
            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between font-mono">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Cálculo de Aceleração Requerido</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400">Taxa Necessária</span>
                  <div className="text-xl font-bold text-amber-400 mt-0.5">{requiredFeeRate} sat/vB</div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400">Taxa Adicional RBF</span>
                  <div className="text-xl font-bold text-emerald-400 mt-0.5">{cpfpFeeNeededSats.toLocaleString()} sats</div>
                  <div className="text-[10px] text-slate-500">~{formatSatsToBTC(cpfpFeeNeededSats)} BTC</div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400">CPFP Child Fee</span>
                  <div className="text-xl font-bold text-purple-400 mt-0.5">
                    {(requiredFeeRate * 2 - currentFeeRate).toFixed(1)} sat/vB
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 leading-relaxed font-sans">
                <strong>💡 Dica do Desenvolvedor:</strong> Se a transação original foi transmitida com a flag <code>BIP-125 (RBF)</code> habilitada, você pode substituir a transação pagando apenas <strong>{cpfpFeeNeededSats.toLocaleString()} sats</strong> a mais. Se não possui RBF, crie uma transação filha (CPFP) gastando um output da transação presa!
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
