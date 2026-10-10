import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRightLeft, Zap } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { explorerService } from '../services/explorerService';
import { Modal } from './ui/Modal';

interface SatsConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SatsConverterModal({ isOpen, onClose }: SatsConverterModalProps): JSX.Element | null {
  const { t } = useTranslation();

  // Prices
  const [btcPriceUsd, setBtcPriceUsd] = useState<number>(65000);
  const [btcPriceBrl, setBtcPriceBrl] = useState<number>(350000);
  const [btcPriceEur, setBtcPriceEur] = useState<number>(60000);

  // Active Tool Tab: 'converter' | 'rbf'
  const [activeTab, setActiveTab] = useState<'converter' | 'rbf'>('converter');

  // Converter inputs
  const [sats, setSats] = useState<string>('100000');
  const [btc, setBtc] = useState<string>('0.001');
  const [usd, setUsd] = useState<string>('');
  const [brl, setBrl] = useState<string>('');
  const [eur, setEur] = useState<string>('');

  // RBF Simulator inputs
  const [vsize, setVsize] = useState<number>(141);
  const [currentFeeRate, setCurrentFeeRate] = useState<number>(5);
  const [targetFeeRate, setTargetFeeRate] = useState<number>(25);

  useEffect(() => {
    if (isOpen) {
      explorerService.getPrice()
        .then((res) => {
          const data = res?.data as any;
          if (data && data.USD) {
            const usdVal = data.USD.last || 65000;
            const brlVal = data.BRL?.last || (usdVal * 5.4);
            const eurVal = data.EUR?.last || (usdVal * 0.92);
            setBtcPriceUsd(usdVal);
            setBtcPriceBrl(brlVal);
            setBtcPriceEur(eurVal);
            updateFromSats('100000', usdVal, brlVal, eurVal);
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  const updateFromSats = (val: string, usdP = btcPriceUsd, brlP = btcPriceBrl, eurP = btcPriceEur) => {
    setSats(val);
    const num = parseFloat(val) || 0;
    const btcVal = num / 100000000;
    setBtc(btcVal > 0 ? btcVal.toFixed(8) : '0');
    setUsd((btcVal * usdP).toFixed(2));
    setBrl((btcVal * brlP).toFixed(2));
    setEur((btcVal * eurP).toFixed(2));
  };

  const updateFromBtc = (val: string) => {
    setBtc(val);
    const num = parseFloat(val) || 0;
    const satVal = Math.round(num * 100000000);
    setSats(satVal.toString());
    setUsd((num * btcPriceUsd).toFixed(2));
    setBrl((num * btcPriceBrl).toFixed(2));
    setEur((num * btcPriceEur).toFixed(2));
  };

  const updateFromUsd = (val: string) => {
    setUsd(val);
    const num = parseFloat(val) || 0;
    const btcVal = num / btcPriceUsd;
    setBtc(btcVal.toFixed(8));
    setSats(Math.round(btcVal * 100000000).toString());
    setBrl((btcVal * btcPriceBrl).toFixed(2));
    setEur((btcVal * btcPriceEur).toFixed(2));
  };

  // RBF Calculations
  const currentTotalFeeSats = vsize * currentFeeRate;
  const targetTotalFeeSats = vsize * targetFeeRate;
  const additionalSatsNeeded = Math.max(0, targetTotalFeeSats - currentTotalFeeSats);
  const additionalUsdNeeded = ((additionalSatsNeeded / 100000000) * btcPriceUsd).toFixed(2);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={<Calculator className="w-5 h-5 text-amber-400" />}
      title={t('satsConverterTitle')}
      subtitle={t('satsConverterSubtitle')}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950 p-2 gap-2 rounded-2xl">
          <button
            onClick={() => setActiveTab('converter')}
            className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'converter'
                ? 'bg-amber-500 text-black shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            {t('converterTab')}
          </button>
          <button
            onClick={() => setActiveTab('rbf')}
            className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'rbf'
                ? 'bg-amber-500 text-black shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {t('rbfSimulatorTab')}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'converter' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Satoshis (sats)</label>
                <input
                  type="number"
                  value={sats}
                  onChange={(e) => updateFromSats(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-mono text-amber-400 font-extrabold focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Bitcoin (BTC)</label>
                <input
                  type="number"
                  step="0.00000001"
                  value={btc}
                  onChange={(e) => updateFromBtc(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-mono text-white font-extrabold focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Dólar (USD $)</label>
                <input
                  type="number"
                  value={usd}
                  onChange={(e) => updateFromUsd(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-mono text-emerald-400 font-extrabold focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Real (BRL R$)</label>
                <input
                  type="number"
                  value={brl}
                  readOnly
                  className="w-full p-3 bg-slate-950 border border-slate-800/60 rounded-2xl text-sm font-mono text-cyan-400 font-extrabold"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Ref: 1 BTC = ${btcPriceUsd.toLocaleString()} USD</span>
              <span>R$ {btcPriceBrl.toLocaleString()} BRL</span>
            </div>
          </div>
        )}

        {activeTab === 'rbf' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Tamanho (vB)</label>
                <input
                  type="number"
                  value={vsize}
                  onChange={(e) => setVsize(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Taxa Atual (sat/vB)</label>
                <input
                  type="number"
                  value={currentFeeRate}
                  onChange={(e) => setCurrentFeeRate(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-amber-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Nova Taxa (sat/vB)</label>
                <input
                  type="number"
                  value={targetFeeRate}
                  onChange={(e) => setTargetFeeRate(Math.max(currentFeeRate + 1, parseInt(e.target.value) || 0))}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 font-bold"
                />
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>Taxa Atual Paga:</span>
                <span className="font-bold">{currentTotalFeeSats.toLocaleString()} sats</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Nova Taxa Estimada:</span>
                <span className="font-bold text-emerald-400">{targetTotalFeeSats.toLocaleString()} sats</span>
              </div>
              <div className="flex items-center justify-between border-t border-amber-500/20 pt-2 text-amber-300 font-extrabold text-sm">
                <span>Adicional RBF/CPFP Necessário:</span>
                <span>+{additionalSatsNeeded.toLocaleString()} sats (~${additionalUsdNeeded} USD)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
