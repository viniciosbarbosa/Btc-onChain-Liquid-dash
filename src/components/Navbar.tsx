import React, { useState, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useNetwork } from '../context/NetworkContext';
import { useNode } from '../context/NodeContext';
import { BroadcastTxModal } from './BroadcastTxModal';
import { 
  Boxes, 
  Calculator, 
  Search, 
  Server, 
  Zap, 
  Droplet,
  Compass,
  Radio
} from 'lucide-react';

import { useTranslation } from '../context/LanguageContext';

export function Navbar(): JSX.Element {
  const { network, switchNetwork, handleSearch } = useNetwork();
  const { nodeStatus, setIsModalOpen } = useNode();
  const { language, toggleLanguage, t } = useTranslation();
  const [inputVal, setInputVal] = useState<string>('');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      handleSearch(inputVal.trim());
    }
  };

  const isLiquidPath = location.pathname.startsWith('/liquid') || location.pathname.startsWith('/asset');

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Network Selector */}
          <div className="flex items-center gap-6">
            <Link 
              to={isLiquidPath ? '/liquid' : '/'}
              className="flex items-center gap-3 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg transition-all duration-300 ${
                isLiquidPath
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-black shadow-cyan-500/20 group-hover:scale-105'
                  : 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-amber-500/20 group-hover:scale-105'
              }`}>
                {isLiquidPath ? '💧' : '₿'}
              </div>
              <div className="hidden sm:block text-left">
                <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  BTC DASH <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">PRO TS</span>
                </h1>
                <p className="text-[11px] text-slate-400 font-mono">On-Chain & Liquid (.onion)</p>
              </div>
            </Link>

            {/* Network Selector Pill */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                onClick={() => {
                  switchNetwork('btc');
                  navigate('/');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  !isLiquidPath
                    ? 'bg-amber-500 text-black shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {t('bitcoin')}
              </button>
              <button
                onClick={() => {
                  switchNetwork('liquid');
                  navigate('/liquid');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  isLiquidPath
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                {t('liquid')}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={onSearchSubmit} className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholderNav')}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition-all"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </form>

          {/* Actions & Language Switcher */}
          <div className="flex items-center gap-2">
            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl transition text-xs font-mono font-bold flex items-center gap-1"
              title="Switch Language / Alternar Idioma"
            >
              <span>{language === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}</span>
            </button>

            <button
              onClick={() => setIsBroadcastOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl transition text-xs font-mono font-bold"
              title="Broadcast raw signed Bitcoin transaction"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="hidden lg:inline">{t('broadcastTx')}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl transition text-xs font-mono"
            >
              <div className="relative flex items-center justify-center">
                <Server className="w-4 h-4 text-amber-400" />
                <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                  nodeStatus === 'connected_umbrel' ? 'bg-emerald-400 animate-pulse' :
                  nodeStatus === 'connected_public' ? 'bg-amber-400' : 'bg-rose-500'
                }`} />
              </div>
              <span className="hidden sm:inline text-slate-200 font-bold">
                {nodeStatus === 'connected_umbrel' ? t('ownNode') : t('nodeConfig')}
              </span>
            </button>
          </div>

        </div>
      </div>

      <BroadcastTxModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
      />
    </header>
  );
}
