import React, { useState, useEffect } from 'react';
import { explorerService } from '../services/explorerService';
import { MempoolFees } from '../types';
import { formatUSD } from '../utils/formatters';
import { Calculator } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export function FeeEstimator(): JSX.Element {
  const { t } = useTranslation();
  const [feeRates, setFeeRates] = useState<MempoolFees>({
    fastestFee: 18,
    halfHourFee: 12,
    hourFee: 8,
    minimumFee: 3
  });

  const [txType, setTxType] = useState<string>('native_segwit');
  const [inputsCount, setInputsCount] = useState<number>(1);
  const [outputsCount, setOutputsCount] = useState<number>(2);
  const [btcPrice, setBtcPrice] = useState<number>(65420);

  useEffect(() => {
    async function loadFees() {
      try {
        const [feeRes, priceRes] = await Promise.all([
          explorerService.getMempoolFees(),
          explorerService.getPrice()
        ]);
        if (feeRes?.data) {
          setFeeRates(feeRes.data);
        }
        if (priceRes?.data?.USD) {
          setBtcPrice(priceRes.data.USD);
        }
      } catch (err) {
        console.error('Error fetching fees:', err);
      }
    }
    loadFees();
  }, []);

  const calculateVSize = (): number => {
    let overhead = 10.5;
    let inputVSize = 68;
    let outputVSize = 31;

    if (txType === 'legacy') {
      overhead = 10;
      inputVSize = 148;
      outputVSize = 34;
    } else if (txType === 'nested_segwit') {
      overhead = 10;
      inputVSize = 91;
      outputVSize = 32;
    } else if (txType === 'taproot') {
      overhead = 10.5;
      inputVSize = 57.5;
      outputVSize = 43;
    }

    return Math.ceil(overhead + (inputsCount * inputVSize) + (outputsCount * outputVSize));
  };

  const vSize = calculateVSize();
  const calculateFeeSats = (rate: number): number => vSize * rate;
  const calculateFeeUSD = (sats: number): number => (sats / 100000000) * btcPrice;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{t('feeEstimatorTitle')}</h2>
          <p className="text-xs text-slate-400">{t('feeEstimatorSubtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Tipo de Endereço / Script
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'native_segwit', label: 'Native SegWit', sub: 'bc1q...' },
                { id: 'taproot', label: 'Taproot', sub: 'bc1p...' },
                { id: 'nested_segwit', label: 'Nested SegWit', sub: '3...' },
                { id: 'legacy', label: 'Legacy', sub: '1...' }
              ].map((typeItem) => (
                <button
                  key={typeItem.id}
                  onClick={() => setTxType(typeItem.id)}
                  className={`p-3 rounded-xl border text-left transition ${
                    txType === typeItem.id
                      ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs">{typeItem.label}</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">{typeItem.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('inputsHeader')}</label>
              <input
                type="number"
                min="1"
                max="20"
                value={inputsCount}
                onChange={(e) => setInputsCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('outputsHeader')}</label>
              <input
                type="number"
                min="1"
                max="20"
                value={outputsCount}
                onChange={(e) => setOutputsCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs">
            <span className="text-slate-400">{t('txVbytesLabel')}</span>
            <span className="text-amber-400 font-bold text-base">{vSize} vB</span>
          </div>
        </div>

        {/* Priority Targets */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Estimativa de Custos por Alvo de Confirmação
          </label>

          {[
            { title: t('fastestFeeCard'), rate: feeRates.fastestFee, color: 'border-red-500/40 bg-red-500/5 text-red-400' },
            { title: t('halfHourFeeCard'), rate: feeRates.halfHourFee, color: 'border-amber-500/40 bg-amber-500/5 text-amber-400' },
            { title: t('hourFeeCard'), rate: feeRates.hourFee, color: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-400' },
            { title: t('minimumFeeCard'), rate: feeRates.minimumFee, color: 'border-blue-500/40 bg-blue-500/5 text-blue-400' }
          ].map((target, idx) => {
            const feeSats = calculateFeeSats(target.rate);
            const feeUsd = calculateFeeUSD(feeSats);

            return (
              <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between font-mono ${target.color}`}>
                <div>
                  <div className="text-xs font-bold text-white mb-0.5">{target.title}</div>
                  <div className="text-xs">{target.rate} sat/vB</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-white">{feeSats.toLocaleString()} sats</div>
                  <div className="text-[11px] text-slate-400">{formatUSD(feeUsd)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
