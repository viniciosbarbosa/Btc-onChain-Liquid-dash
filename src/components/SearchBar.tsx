import React, { useState, FormEvent } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { useTranslation } from '../context/LanguageContext';
import { Search, Sparkles, Droplet, Layers } from 'lucide-react';

export function SearchBar(): JSX.Element {
  const { network, handleSearch } = useNetwork();
  const { t } = useTranslation();
  const [query, setQuery] = useState<string>('');

  const btcSamples = [
    { label: 'Satoshi Genesis Tx', value: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b' },
    { label: 'Endereço SegWit', value: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    { label: 'Endereço Legacy', value: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
    { label: 'XPUB Master', value: 'xpub661MyMwAqGnt3G15xUMxBxWwWK5eeZ3KHGvbUR5j62ggw8Y662n4vVvS5sT2S7h86i...' }
  ];

  const liquidSamples = [
    { label: 'Asset L-BTC', value: '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d' },
    { label: 'Asset USDt', value: 'ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258fea9806a58fbd' },
    { label: 'Endereço Confidential', value: 'lq1qq2vk5n3p3j4d9k8e7f6a5b4c3d2e1f0g9h8i7j6k5l4m3n2o1p0q' },
    { label: 'BMN Token', value: 'ab4979e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d' }
  ];

  const sampleQueries = network === 'liquid' ? liquidSamples : btcSamples;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query.trim());
    }
  };

  return (
    <div className={`border rounded-3xl p-8 mb-8 relative overflow-hidden shadow-2xl transition-all duration-300 ${
      network === 'liquid'
        ? 'bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-cyan-800/40'
        : 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border-slate-800'
    }`}>
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        network === 'liquid' ? 'bg-cyan-500/10' : 'bg-amber-500/5'
      }`} />
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        
        {/* Network Badge Header */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono mb-3 uppercase tracking-wider ${
          network === 'liquid'
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}>
          {network === 'liquid' ? (
            <>
              <Droplet className="w-3.5 h-3.5 text-cyan-400" /> Liquid Network Sidechain (.onion)
            </>
          ) : (
            <>
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Bitcoin On-Chain Blockchain (.onion)
            </>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 flex items-center justify-center gap-2">
          {network === 'liquid' ? (
            <>{t('liquidExplorerTitle')} <Sparkles className="w-5 h-5 text-cyan-400" /></>
          ) : (
            <>{t('btcExplorerTitle')} <Sparkles className="w-5 h-5 text-amber-400" /></>
          )}
        </h2>

        <p className="text-sm text-slate-300 mb-6">
          {network === 'liquid' ? t('liquidExplorerDesc') : t('btcExplorerDesc')}
        </p>

        <form onSubmit={onSubmit} className="relative mb-4">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={network === 'liquid' ? t('searchPlaceholderLiquid') : t('searchPlaceholderBtc')}
              className={`w-full pl-12 pr-32 py-4 bg-slate-950/90 border-2 rounded-2xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none shadow-inner transition-all ${
                network === 'liquid'
                  ? 'border-cyan-900/60 focus:border-cyan-400'
                  : 'border-slate-800 focus:border-amber-500'
              }`}
            />
            <Search className={`w-5 h-5 absolute left-4 ${
              network === 'liquid' ? 'text-cyan-400' : 'text-amber-400'
            }`} />

            <button
              type="submit"
              className={`absolute right-2 px-5 py-2.5 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 text-black ${
                network === 'liquid'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400'
              }`}
            >
              {t('searchBtn')}
            </button>
          </div>
        </form>

        {/* Quick Sample Queries */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-slate-500 font-sans">Exemplos rápidos:</span>
          {sampleQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(item.value);
                handleSearch(item.value);
              }}
              className={`px-2.5 py-1 rounded-lg border transition ${
                network === 'liquid'
                  ? 'bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 border-cyan-800/40 hover:border-cyan-400'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/50 hover:border-amber-500/40'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
