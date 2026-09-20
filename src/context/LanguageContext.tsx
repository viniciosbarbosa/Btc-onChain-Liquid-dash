import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'pt' | 'en';

export const translations = {
  pt: {
    // Navbar
    bitcoin: 'Bitcoin',
    liquid: 'Liquid',
    broadcastTx: 'Transmitir Tx Assinada',
    nodeConfig: 'Nó Config',
    ownNode: 'Nó Próprio (.onion)',
    searchPlaceholderNav: 'Busca por TxID, Bloco, Endereço, XPUB...',
    
    // SearchBar
    btcExplorerTitle: 'Explorador Bitcoin (On-Chain)',
    liquidExplorerTitle: 'Explorador Liquid Network',
    btcExplorerDesc: 'Consulte Transações (TxID), Blocos da Blockchain, Endereços Bitcoin (bc1q/bc1p/1A1z), XPUBs ou Mempool em tempo real.',
    liquidExplorerDesc: 'Consulte Transações Confidenciais (TxID), Blocos da Federação, Endereços Liquid (lq1...), Ativos (L-BTC/USDt) e Proofs.',
    searchPlaceholderBtc: 'Cole um TxID Bitcoin, Hash de Bloco, Endereço (bc1q/bc1p/1A1z...) ou XPUB...',
    searchPlaceholderLiquid: 'Cole um TxID Liquid, Asset ID (L-BTC/USDt), Endereço (lq1...) ou Blinding Key...',
    searchBtn: 'Pesquisar',
    quickSamples: 'Exemplos rápidos:',
    
    // Broadcast Modal
    broadcastModalTitle: 'Transmitir Transação Assinada (Push Raw Tx)',
    broadcastModalSubtitle: 'Envie uma transação Bitcoin assinada em formato Hexadecimal para a Mempool da rede',
    hexLabel: 'Transação Assinada em Hex (Raw Signed Tx Hex):',
    hexPlaceholder: 'Cole aqui o Hex da sua transação assinada (ex: 02000000000101...)...',
    hexSize: 'Tamanho Hex:',
    virtualSize: 'Tamanho Virtual:',
    txType: 'Tipo de Tx:',
    cancel: 'Cancelar',
    broadcastAction: 'Transmitir para a Rede Bitcoin',
    broadcasting: 'Transmitindo para a Mempool...',
    successTitle: 'Transação Transmitida com Sucesso!',
    successSubtitle: 'Sua transação assinada foi aceita e propagada para os nós da rede Bitcoin Mempool.',
    txidGenerated: 'Hash da Transação (TxID Gerado):',
    close: 'Fechar',
    viewInExplorer: 'Ver Transação no Explorador',
    hexError: 'Por favor insira um Hex válido de uma transação Bitcoin assinada (mínimo 100 caracteres hexadecimais).',

    // Mempool
    mempoolTitle: 'Mempool Live Stream & Fluxo de Blocos',
    mempoolSubtitle: 'Visualização estilo Mempool.space: Blocos em fila na Mempool (esquerda) & Blocos minerados (direita)',
    listeningLive: 'Ouvindo Blockchain (Live)',
    pendingQueue: 'FILA DE BLOCOS NA MEMPOOL (PENDENTES)',
    minedBlocks: 'BLOCOS MINERADOS NA BLOCKCHAIN',
    nextBlock: 'Próximo Bloco (~10 min)',
    feeScale: 'Escala sat/vB:',
    confirmedInBlock: 'Confirmada (Bloco',

    // Dashboard Tabs
    mempoolTab: '⚡ Fluxo Mempool Live',
    analyticsTab: '📊 Analytics & Halving Clock',
    quotesTab: '💡 Cotações & Insights'
  },
  en: {
    // Navbar
    bitcoin: 'Bitcoin',
    liquid: 'Liquid',
    broadcastTx: 'Broadcast Signed Tx',
    nodeConfig: 'Node Config',
    ownNode: 'Own Node (.onion)',
    searchPlaceholderNav: 'Search TxID, Block, Address, XPUB...',
    
    // SearchBar
    btcExplorerTitle: 'Bitcoin Explorer (On-Chain)',
    liquidExplorerTitle: 'Liquid Network Explorer',
    btcExplorerDesc: 'Explore Transactions (TxID), Blockchain Blocks, Bitcoin Addresses (bc1q/bc1p/1A1z), XPUBs or real-time Mempool.',
    liquidExplorerDesc: 'Explore Confidential Transactions (TxID), Federation Blocks, Liquid Addresses (lq1...), Assets (L-BTC/USDt) and Proofs.',
    searchPlaceholderBtc: 'Paste a Bitcoin TxID, Block Hash, Address (bc1q/bc1p/1A1z...) or XPUB...',
    searchPlaceholderLiquid: 'Paste a Liquid TxID, Asset ID (L-BTC/USDt), Address (lq1...) or Blinding Key...',
    searchBtn: 'Search',
    quickSamples: 'Quick samples:',
    
    // Broadcast Modal
    broadcastModalTitle: 'Broadcast Signed Transaction (Push Raw Tx)',
    broadcastModalSubtitle: 'Push a raw signed Bitcoin transaction in Hexadecimal format directly to the network Mempool',
    hexLabel: 'Raw Signed Transaction Hex:',
    hexPlaceholder: 'Paste signed transaction Hex code here (e.g., 02000000000101...)...',
    hexSize: 'Hex Length:',
    virtualSize: 'Virtual Size:',
    txType: 'Tx Type:',
    cancel: 'Cancel',
    broadcastAction: 'Broadcast to Bitcoin Network',
    broadcasting: 'Broadcasting to Mempool...',
    successTitle: 'Transaction Broadcasted Successfully!',
    successSubtitle: 'Your signed transaction was accepted and propagated across Bitcoin network Mempool nodes.',
    txidGenerated: 'Transaction Hash (Generated TxID):',
    close: 'Close',
    viewInExplorer: 'View Transaction in Explorer',
    hexError: 'Please enter a valid Hex string of a signed Bitcoin transaction (at least 100 hex characters).',

    // Mempool
    mempoolTitle: 'Mempool Live Stream & Block Pipeline',
    mempoolSubtitle: 'Mempool.space style pipeline: Pending Mempool block queue (left) & Mined blocks (right)',
    listeningLive: 'Listening to Blockchain (Live)',
    pendingQueue: 'MEMPOOL BLOCK QUEUE (PENDING)',
    minedBlocks: 'MINED BLOCKS ON BLOCKCHAIN',
    nextBlock: 'Next Block (~10 min)',
    feeScale: 'sat/vB Scale:',
    confirmedInBlock: 'Confirmed (Block',

    // Dashboard Tabs
    mempoolTab: '⚡ Live Mempool Stream',
    analyticsTab: '📊 Analytics & Halving Clock',
    quotesTab: '💡 Quotes & Insights'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['pt']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('btc_dash_lang');
    return (saved === 'en' || saved === 'pt') ? saved : 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('btc_dash_lang', lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'pt' ? 'en' : 'pt';
    setLanguage(nextLang);
  };

  const t = (key: keyof typeof translations['pt']): string => {
    return translations[language][key] || translations['pt'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
}
