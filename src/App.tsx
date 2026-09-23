import React from 'react';
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import { NodeProvider } from './context/NodeContext';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { NodeConfigModal } from './components/NodeConfigModal';
import { MetricsBar } from './components/MetricsBar';
import { MempoolVisualizer } from './components/MempoolVisualizer';
import { SearchBar } from './components/SearchBar';
import { TransactionView } from './components/TransactionView';
import { AddressView } from './components/AddressView';
import { XpubView } from './components/XpubView';
import { LiquidAssetView } from './components/LiquidAssetView';
import { LiquidTransactionView } from './components/LiquidTransactionView';
import { LiquidDashboard } from './components/LiquidDashboard';
import { FeeEstimator } from './components/FeeEstimator';
import { QuotesWidget } from './components/QuotesWidget';
import { OnChainAnalytics } from './components/OnChainAnalytics';
import { ArrowLeft } from 'lucide-react';

function TxRoute(): JSX.Element | null {
  const { txid } = useParams<{ txid: string }>();
  const { network } = useNetwork();
  const { t } = useTranslation();
  if (!txid) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> {t('backToDashboard')}
        </Link>
      </div>
      {network === 'liquid' || txid.startsWith('liq_') ? (
        <LiquidTransactionView txid={txid} />
      ) : (
        <TransactionView txid={txid} />
      )}
    </div>
  );
}

function AddressRoute(): JSX.Element | null {
  const { address } = useParams<{ address: string }>();
  const { t } = useTranslation();
  if (!address) return null;
  return (
    <div className="space-y-4">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" /> {t('backToDashboard')}
      </Link>
      <AddressView address={address} />
    </div>
  );
}

function XpubRoute(): JSX.Element | null {
  const { xpub } = useParams<{ xpub: string }>();
  const { t } = useTranslation();
  if (!xpub) return null;
  return (
    <div className="space-y-4">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" /> {t('backToDashboard')}
      </Link>
      <XpubView xpub={xpub} />
    </div>
  );
}

function AssetRoute(): JSX.Element | null {
  const { assetId } = useParams<{ assetId: string }>();
  const { t } = useTranslation();
  if (!assetId) return null;
  return (
    <div className="space-y-4">
      <Link
        to="/liquid"
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" /> {t('backToLiquid')}
      </Link>
      <LiquidAssetView assetId={assetId} />
    </div>
  );
}

function DashboardPage(): JSX.Element {
  const [subTab, setSubTab] = React.useState<'mempool' | 'analytics' | 'quotes'>('mempool');
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <SearchBar />

      {/* Clean Sub-Tab Selector for Progressive Disclosure */}
      <div className="flex items-center justify-center border-b border-slate-800 pb-4">
        <div className="flex items-center p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl gap-1">
          <button
            onClick={() => setSubTab('mempool')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              subTab === 'mempool'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {t('mempoolTab')}
          </button>
          <button
            onClick={() => setSubTab('analytics')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              subTab === 'analytics'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {t('analyticsTab')}
          </button>
          <button
            onClick={() => setSubTab('quotes')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              subTab === 'quotes'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {t('quotesTab')}
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {subTab === 'mempool' && (
        <MempoolVisualizer onSelectBlock={(blk) => console.log('Selected block:', blk)} />
      )}
      {subTab === 'analytics' && (
        <OnChainAnalytics />
      )}
      {subTab === 'quotes' && (
        <QuotesWidget />
      )}
    </div>
  );
}

function MempoolPage(): JSX.Element {
  return (
    <div className="space-y-8 animate-fade-in">
      <MempoolVisualizer onSelectBlock={(blk) => console.log('Selected block:', blk)} />
      <FeeEstimator />
    </div>
  );
}

function FeesPage(): JSX.Element {
  return (
    <div className="animate-fade-in">
      <FeeEstimator />
    </div>
  );
}

function LiquidPage(): JSX.Element {
  return (
    <div className="animate-fade-in">
      <LiquidDashboard />
    </div>
  );
}

function MainLayout(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
        <MetricsBar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/mempool" element={<MempoolPage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/liquid" element={<LiquidPage />} />
          <Route path="/tx/:txid" element={<TxRoute />} />
          <Route path="/address/:address" element={<AddressRoute />} />
          <Route path="/xpub/:xpub" element={<XpubRoute />} />
          <Route path="/asset/:assetId" element={<AssetRoute />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </main>
      <NodeConfigModal />
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <NetworkProvider>
          <NodeProvider>
            <MainLayout />
          </NodeProvider>
        </NetworkProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
