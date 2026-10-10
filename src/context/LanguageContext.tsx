import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'pt' | 'en';

export const translations = {
  pt: {
    // Navbar & Navigation
    bitcoin: 'Bitcoin',
    liquid: 'Liquid',
    broadcastTx: 'Transmitir Tx Assinada',
    nodeConfig: 'Nó Config',
    ownNode: 'Nó Próprio (.onion)',
    publicNode: 'API Pública (Mempool.space)',
    searchPlaceholderNav: 'Busca por TxID, Bloco, Endereço, XPUB...',
    switchLang: 'Alternar Idioma',
    backToDashboard: 'Voltar ao Dashboard',
    backToLiquid: 'Voltar ao Painel Liquid',
    
    // SearchBar
    btcExplorerTitle: 'Explorador Bitcoin (On-Chain)',
    liquidExplorerTitle: 'Explorador Liquid Network',
    btcExplorerDesc: 'Consulte Transações (TxID), Blocos da Blockchain, Endereços Bitcoin (bc1q/bc1p/1A1z), XPUBs ou Mempool em tempo real.',
    liquidExplorerDesc: 'Consulte Transações Confidenciais (TxID), Blocos da Federação, Endereços Liquid (lq1...), Ativos (L-BTC/USDt) e Proofs.',
    searchPlaceholderBtc: 'Cole um TxID Bitcoin, Hash de Bloco, Endereço (bc1q/bc1p/1A1z...) ou XPUB...',
    searchPlaceholderLiquid: 'Cole um TxID Liquid, Asset ID (L-BTC/USDt), Endereço (lq1...) ou Blinding Key...',
    searchBtn: 'Pesquisar',
    quickSamples: 'Exemplos rápidos:',

    // Dashboard Tabs
    mempoolTab: '⚡ Fluxo Mempool Live',
    chartsTab: '📈 Gráficos On-Chain',
    analyticsTab: '📊 Halving & Dificuldade',
    quotesTab: '💡 Cotações & Insights',

    // MetricsBar
    btcPrice: 'Preço BTC',
    recommendedFees: 'Taxas Recomendadas',
    mempoolPending: 'Mempool Pendente',
    estimatedHashrate: 'Hashrate Estimado',
    nextHalving: 'Próximo Halving',
    highPriority: 'Alta Prioridade',
    medPriority: 'Média Prioridade',
    lowPriority: 'Baixa Prioridade',
    queuedTxs: 'Tx em Fila',
    activeMempool: 'Ativa',
    diffAdjLabel: 'Ajuste Dificuldade:',
    blockRewardLabel: 'Recompensa Bloco:',
    
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

    // NodeConfig Modal
    nodeConfigTitle: 'Configuração do Nó Tor (.onion) & Gateway',
    nodeConfigSubtitle: 'Ambiente Profissional com suporte a Tor Gateway e credenciais .onion',
    tabBitcoinExplorer: 'BitcoinExplorer (.onion)',
    tabElementsRpc: 'Elements Core RPC (Liquid)',
    tabTorGateway: '🧅 Tor Gateway Resolver',
    currentStatus: 'Status Atual:',
    statusUmbrel: 'Conectado ao Nó Próprio (.onion API)',
    statusPublic: 'Conectado às APIs Públicas de Terceiros (Fallback)',
    statusError: 'Erro de Conexão com o Endpoint',
    statusChecking: 'Verificando conectividade...',
    testConnection: 'Testar Conexão',
    saveConfigBtn: 'Salvar Configurações TS',
    umbrelInputLabel: 'URL/Host da API BitcoinExplorer (.onion ou Local)',
    publicFallbackLabel: 'Fallback Público (Mempool.space API)',
    elementsSavedTitle: 'Credenciais salvas do nó Elements Core (.onion):',
    elementsSavedDesc: 'Comunicação direta com o nó Liquid RPC fornecido pelo usuário.',
    rpcHostLabel: 'Host RPC (.onion)',
    rpcPortLabel: 'Porta RPC',
    rpcUserLabel: 'RPC Username',
    rpcPassLabel: 'RPC Password',
    torResolverTitle: 'Modo de Resolução Tor Gateway (.onion):',
    torResolverDesc: 'Permite que o navegador web resolva domínios `.onion` nativamente sem necessidade de plugin adicional.',
    selectTorResolver: 'Selecione o Resolver Tor:',

    // Mempool
    mempoolTitle: 'Mempool Live Stream & Fluxo de Blocos',
    mempoolSubtitle: 'Visualização estilo Mempool.space: Blocos em fila na Mempool (esquerda) & Blocos minerados (direita)',
    listeningLive: 'Ouvindo Blockchain (Live)',
    pendingQueue: 'FILA DE BLOCOS NA MEMPOOL (PENDENTES)',
    minedBlocks: 'BLOCOS MINERADOS NA BLOCKCHAIN',
    nextBlock: 'Próximo Bloco (~10 min)',
    feeScale: 'Escala sat/vB:',
    confirmedInBlock: 'Confirmada (Bloco',

    // FeeEstimator
    feeEstimatorTitle: 'Calculadora & Estimador de Taxas On-Chain',
    feeEstimatorSubtitle: 'Estimativas precisas em sat/vB com cálculo interativo de custo total em USD/BRL',
    fastestFeeCard: 'Prioridade Alta (~10 min)',
    halfHourFeeCard: 'Prioridade Média (~30 min)',
    hourFeeCard: 'Prioridade Baixa (~1 h)',
    minimumFeeCard: 'Mínimo Purga (~várias h)',
    customCalcTitle: 'Simulador de Custo da Transação',
    txVbytesLabel: 'Tamanho Virtual da Tx (vBytes):',
    chosenFeeRateLabel: 'Taxa Escolhida (sat/vB):',
    totalFeeSats: 'Taxa Total (Sats):',
    totalFeeUsd: 'Custo Estimado (USD):',
    totalFeeBrl: 'Custo Estimado (BRL):',

    // OnChainAnalytics
    analyticsTitle: 'Bitcoin Analytics & Halving Clock',
    analyticsSubtitle: 'Métricas da rede em tempo real, fornecimento e contagem regressiva para o próximo Halving',
    halvingCountdown: 'Contagem Regressiva do Halving',
    days: 'Dias',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    currentBlockHeight: 'Altura Atual de Bloco:',
    blocksUntilHalving: 'Blocos Até o Halving:',
    subsidyBefore: 'Subvenção Atual:',
    subsidyAfter: 'Próxima Subvenção:',
    estDate: 'Data Estimada:',
    totalSupplyLabel: 'Oferta em Circulação:',
    maxSupplyLabel: 'Oferta Máxima:',
    miningDiffLabel: 'Dificuldade de Mineração:',
    nextDiffEstimate: 'Estimativa Próximo Ajuste:',

    // QuotesWidget
    quotesTitle: 'Sabedoria Bitcoin & Cotação Aleatória',
    quotesSubtitle: 'Frases históricas de cypherpunks, desenvolvedores e pensadores do ecossistema Bitcoin',
    nextQuoteBtn: 'Próxima Frase',

    // TransactionView
    txDetailsTitle: 'Detalhes da Transação Bitcoin',
    txidLabel: 'TxID:',
    statusConfirmedLabel: 'Confirmada',
    statusUnconfirmedLabel: 'Pendente na Mempool',
    confirmationsLabel: 'Confirmações:',
    blockHashLabel: 'Hash do Bloco:',
    feeLabel: 'Taxa Paga:',
    vsizeLabel: 'Tamanho Virtual (vsize):',
    inputsHeader: 'Entradas (Inputs):',
    outputsHeader: 'Saídas (Outputs):',

    // AddressView
    addressDetailsTitle: 'Visão Geral do Endereço Bitcoin',
    addressLabel: 'Endereço:',
    totalReceivedLabel: 'Total Recebido:',
    totalSentLabel: 'Total Enviado:',
    balanceLabel: 'Saldo Atual:',
    txCountLabel: 'Total de Transações:',

    // XpubView
    xpubDetailsTitle: 'Análise de XPUB / YPUB / ZPUB',
    xpubLabel: 'XPUB:',
    derivedAddressesTitle: 'Endereços Derivados (GAP Limit 20):',
    pathHeader: 'Caminho (Path)',
    addressHeader: 'Endereço',
    txCountHeader: 'Qtd Tx',

    // BlockDetailModal
    blockDetailsTitle: 'Detalhes do Bloco Bitcoin',
    blockHeightLabel: 'Altura:',
    blockTimeLabel: 'Minerado em:',
    blockSizeLabel: 'Tamanho:',
    blockWeightLabel: 'Peso (Weight):',
    merkleRootLabel: 'Merkle Root:',
    rewardLabel: 'Recompensa Total:',

    // PendingTxTracer
    tracerTitle: 'Rastreador de Transações Pendentes (Live Tracer)',
    tracerSubtitle: 'Acompanhe a posição vByte na Mempool e estimativa de inclusão em blocos',
    vbytePositionLabel: 'Posição vByte na Fila:',
    estBlockLabel: 'Bloco Estimado de Confirmação:',

    // Liquid Dashboard & Views
    liquidTitle: 'Liquid Network Sidechain Dashboard',
    liquidSubtitle: 'Monitoramento de Transações Confidenciais, L-BTC e Ativos na Sidechain',
    lbtcCirculatingLabel: 'L-BTC em Circulação:',
    pegin24hLabel: 'Peg-In (24h):',
    pegout24hLabel: 'Peg-Out (24h):',
    confidentialRatioLabel: 'Proporção Tx Confidencial:',
    federationNodesLabel: 'Nós da Federação:',
    assetDetailTitle: 'Detalhes do Ativo Liquid',
    assetIdLabel: 'Asset ID:',
    tickerLabel: 'Ticker:',
    issuerDomainLabel: 'Domínio do Emissor:',

    // Tools & New Features
    psbtDecoderTitle: 'Decodificador de PSBT (BIP 174)',
    psbtDecoderSubtitle: 'Inspecione entradas, saídas e assinaturas de transações parcialmente assinadas',
    psbtInputLabel: 'Hexadecimal ou Base64 do PSBT:',
    psbtInputPlaceholder: 'Cole aqui o PSBT (começando com psbt em hex 70736274 ou base64 cHNid)...',
    psbtDecodeBtn: 'Decodificar PSBT',
    psbtEmptyError: 'Por favor, insira uma string de PSBT.',
    psbtInvalidMagicError: 'Formato de PSBT inválido. Deve começar com magic bytes "psbt".',
    psbtParseError: 'Erro ao processar o formato do PSBT.',
    psbtReadyFinalize: 'PSBT Pronto para Finalizar / Transmitir',
    psbtNeedsSignature: 'Aguardando Assinaturas Adicionais',
    psbtInputs: 'Entradas',
    psbtOutputs: 'Saídas',
    copyRaw: 'Copiar Hex/Raw',
    copied: 'Copiado!',
    qrCodeModalTitle: 'Código QR para Escaneamento Rápido',
    satsConverterTitle: 'Conversor de Sats/Fiat & Calculadora RBF',
    satsConverterSubtitle: 'Conversão em tempo real de Satoshis, BTC e moedas Fiat + simulador de aceleração RBF/CPFP',
    converterTab: 'Conversor Fiat/Sats',
    rbfSimulatorTab: 'Acelerador RBF / CPFP',
    watchlistTitle: 'Sua Lista de Favoritos (Watchlist)',
    watchlistSubtitle: 'Acompanhe endereços, transações e XPUBs salvos localmente no seu navegador',
    itemsSaved: 'itens salvos',
    addFavoriteBtn: 'Adicionar Novo Favorito',
    addressTxPlaceholder: 'Endereço, TxID, XPUB ou Asset ID...',
    labelPlaceholder: 'Rótulo / Apelido (ex: Minha Cold Storage)...',
    saveBtn: 'Salvar',
    filterFavorites: 'Filtrar favoritos...',
    emptyWatchlist: 'Nenhum item salvo nos seus favoritos ainda.',
    toolsBtn: 'Ferramentas & Utils',

    // New Charts & Dashboards i18n
    chartsDashboardTitle: 'Painel Integrado de Analytics & Gráficos On-Chain',
    chartsDashboardSubtitle: 'Filtros em tempo real para Hashrate, Dificuldade, Mempool, Preço BTC e Adoção',
    hashrateTitle: 'Hashrate Estimado da Rede (EH/s)',
    btcPriceVolumeTitle: 'Preço & Volume de Transações BTC',
    addressTypeDistTitle: 'Distribuição de Tipos de Endereço & Script On-Chain',
    mempoolConsensus: 'Consenso da Mempool',
    liquidChartsTitle: 'Gráficos & Analytics da Sidechain Liquid',
    liquidChartsSubtitle: 'Fluxo Peg-In/Out, Transações Confidenciais e Distribuição de Ativos',
    pegInOutTitle: 'Fluxo Peg-In vs Peg-Out (L-BTC)',
    confidentialRatioTitle: 'Proporção de Tx Confidenciais (%)',
    liquidAssetShareTitle: 'Market Share de Ativos Emitidos na Liquid',
    rangeLabel: 'FAIXA',
    txCountLabelUpper: 'TX COUNT',
    sizeLabelUpper: 'TAMANHO',
    days7: '7 Dias',
    days30: '30 Dias',
    proportion: 'Proporção',
    marketShare: 'Market Share',
    blockNum1Label: 'Próximo Bloco (~10 min)',
    blockNum2Label: 'Bloco #2 (~20 min)',
    blockNum3Label: 'Bloco #3 (~30 min)',
    blockNum4Label: 'Bloco #4 (~40 min)',
    minedLabel: 'Minerado:',
    medianFeeLabel: 'Taxa Média:',
    lbtcBackedLabel: '100% Lastreado por BTC em Federação',
    confidentialValuesHidden: 'Valores e Ativos Ocultos',
    featuredLiquidAssets: 'Ativos em Destaque na Rede Liquid',
    recentLiquidBlocks: 'Blocos Recentes da Rede Liquid (~1 min block time)',
    otherIssuedTokens: 'Outros Tokens Emitidos',
    confidentialTxLabel: 'Tx Confidencial',
    formatLabel: 'Formato:'
  },
  en: {
    // Navbar & Navigation
    bitcoin: 'Bitcoin',
    liquid: 'Liquid',
    broadcastTx: 'Broadcast Signed Tx',
    nodeConfig: 'Node Config',
    ownNode: 'Own Node (.onion)',
    publicNode: 'Public API (Mempool.space)',
    searchPlaceholderNav: 'Search TxID, Block, Address, XPUB...',
    switchLang: 'Switch Language',
    backToDashboard: 'Back to Dashboard',
    backToLiquid: 'Back to Liquid Panel',
    
    // SearchBar
    btcExplorerTitle: 'Bitcoin Explorer (On-Chain)',
    liquidExplorerTitle: 'Liquid Network Explorer',
    btcExplorerDesc: 'Explore Transactions (TxID), Blockchain Blocks, Bitcoin Addresses (bc1q/bc1p/1A1z), XPUBs or real-time Mempool.',
    liquidExplorerDesc: 'Explore Confidential Transactions (TxID), Federation Blocks, Liquid Addresses (lq1...), Assets (L-BTC/USDt) and Proofs.',
    searchPlaceholderBtc: 'Paste a Bitcoin TxID, Block Hash, Address (bc1q/bc1p/1A1z...) or XPUB...',
    searchPlaceholderLiquid: 'Paste a Liquid TxID, Asset ID (L-BTC/USDt), Address (lq1...) or Blinding Key...',
    searchBtn: 'Search',
    quickSamples: 'Quick samples:',

    // Dashboard Tabs
    mempoolTab: '⚡ Live Mempool Stream',
    chartsTab: '📈 On-Chain Charts',
    analyticsTab: '📊 Halving & Difficulty',
    quotesTab: '💡 Quotes & Insights',

    // MetricsBar
    btcPrice: 'BTC Price',
    recommendedFees: 'Recommended Fees',
    mempoolPending: 'Pending Mempool',
    estimatedHashrate: 'Estimated Hashrate',
    nextHalving: 'Next Halving',
    highPriority: 'High Priority',
    medPriority: 'Medium Priority',
    lowPriority: 'Low Priority',
    queuedTxs: 'Queued Txs',
    activeMempool: 'Active',
    diffAdjLabel: 'Difficulty Adjustment:',
    blockRewardLabel: 'Block Reward:',

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

    // NodeConfig Modal
    nodeConfigTitle: 'Tor Node (.onion) & Gateway Config',
    nodeConfigSubtitle: 'Professional environment with Tor Gateway & .onion credentials support',
    tabBitcoinExplorer: 'BitcoinExplorer (.onion)',
    tabElementsRpc: 'Elements Core RPC (Liquid)',
    tabTorGateway: '🧅 Tor Gateway Resolver',
    currentStatus: 'Current Status:',
    statusUmbrel: 'Connected to Own Node (.onion API)',
    statusPublic: 'Connected to 3rd Party Public APIs (Fallback)',
    statusError: 'Endpoint Connection Error',
    statusChecking: 'Checking connectivity...',
    testConnection: 'Test Connection',
    saveConfigBtn: 'Save Settings TS',
    umbrelInputLabel: 'BitcoinExplorer API URL/Host (.onion or Local)',
    publicFallbackLabel: 'Public Fallback (Mempool.space API)',
    elementsSavedTitle: 'Saved Elements Core node credentials (.onion):',
    elementsSavedDesc: 'Direct communication with user-provided Liquid RPC node.',
    rpcHostLabel: 'RPC Host (.onion)',
    rpcPortLabel: 'RPC Port',
    rpcUserLabel: 'RPC Username',
    rpcPassLabel: 'RPC Password',
    torResolverTitle: 'Tor Gateway Resolution Mode (.onion):',
    torResolverDesc: 'Allows web browser to resolve `.onion` domains natively without extra plugins.',
    selectTorResolver: 'Select Tor Resolver:',

    // Mempool
    mempoolTitle: 'Mempool Live Stream & Block Pipeline',
    mempoolSubtitle: 'Mempool.space style pipeline: Pending Mempool block queue (left) & Mined blocks (right)',
    listeningLive: 'Listening to Blockchain (Live)',
    pendingQueue: 'MEMPOOL BLOCK QUEUE (PENDING)',
    minedBlocks: 'MINED BLOCKS ON BLOCKCHAIN',
    nextBlock: 'Next Block (~10 min)',
    feeScale: 'sat/vB Scale:',
    confirmedInBlock: 'Confirmed (Block',

    // FeeEstimator
    feeEstimatorTitle: 'On-Chain Fee Calculator & Estimator',
    feeEstimatorSubtitle: 'Accurate sat/vB estimates with interactive total cost calculation in USD/BRL',
    fastestFeeCard: 'High Priority (~10 min)',
    halfHourFeeCard: 'Medium Priority (~30 min)',
    hourFeeCard: 'Low Priority (~1 hr)',
    minimumFeeCard: 'Minimum Purge (~several hrs)',
    customCalcTitle: 'Transaction Cost Simulator',
    txVbytesLabel: 'Tx Virtual Size (vBytes):',
    chosenFeeRateLabel: 'Chosen Fee Rate (sat/vB):',
    totalFeeSats: 'Total Fee (Sats):',
    totalFeeUsd: 'Estimated Cost (USD):',
    totalFeeBrl: 'Estimated Cost (BRL):',

    // OnChainAnalytics
    analyticsTitle: 'Bitcoin Analytics & Halving Clock',
    analyticsSubtitle: 'Real-time network metrics, supply metrics and countdown to next Halving',
    halvingCountdown: 'Halving Countdown',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    currentBlockHeight: 'Current Block Height:',
    blocksUntilHalving: 'Blocks Until Halving:',
    subsidyBefore: 'Current Subsidy:',
    subsidyAfter: 'Next Subsidy:',
    estDate: 'Estimated Date:',
    totalSupplyLabel: 'Circulating Supply:',
    maxSupplyLabel: 'Maximum Supply:',
    miningDiffLabel: 'Mining Difficulty:',
    nextDiffEstimate: 'Next Adjustment Estimate:',

    // QuotesWidget
    quotesTitle: 'Bitcoin Wisdom & Random Quote',
    quotesSubtitle: 'Historical quotes from cypherpunks, developers and thinkers of the Bitcoin ecosystem',
    nextQuoteBtn: 'Next Quote',

    // TransactionView
    txDetailsTitle: 'Bitcoin Transaction Details',
    txidLabel: 'TxID:',
    statusConfirmedLabel: 'Confirmed',
    statusUnconfirmedLabel: 'Pending in Mempool',
    confirmationsLabel: 'Confirmations:',
    blockHashLabel: 'Block Hash:',
    feeLabel: 'Fee Paid:',
    vsizeLabel: 'Virtual Size (vsize):',
    inputsHeader: 'Inputs:',
    outputsHeader: 'Outputs:',

    // AddressView
    addressDetailsTitle: 'Bitcoin Address Overview',
    addressLabel: 'Address:',
    totalReceivedLabel: 'Total Received:',
    totalSentLabel: 'Total Sent:',
    balanceLabel: 'Current Balance:',
    txCountLabel: 'Total Transactions:',

    // XpubView
    xpubDetailsTitle: 'XPUB / YPUB / ZPUB Analysis',
    xpubLabel: 'XPUB:',
    derivedAddressesTitle: 'Derived Addresses (GAP Limit 20):',
    pathHeader: 'Path',
    addressHeader: 'Address',
    txCountHeader: 'Tx Count',

    // BlockDetailModal
    blockDetailsTitle: 'Bitcoin Block Details',
    blockHeightLabel: 'Height:',
    blockTimeLabel: 'Mined At:',
    blockSizeLabel: 'Size:',
    blockWeightLabel: 'Weight:',
    merkleRootLabel: 'Merkle Root:',
    rewardLabel: 'Total Reward:',

    // PendingTxTracer
    tracerTitle: 'Pending Transaction Live Tracer',
    tracerSubtitle: 'Track vByte position in Mempool and block inclusion estimate',
    vbytePositionLabel: 'vByte Queue Position:',
    estBlockLabel: 'Estimated Confirmation Block:',

    // Liquid Dashboard & Views
    liquidTitle: 'Liquid Network Sidechain Dashboard',
    liquidSubtitle: 'Confidential Transactions, L-BTC and Asset Monitoring on Sidechain',
    lbtcCirculatingLabel: 'L-BTC Circulating:',
    pegin24hLabel: 'Peg-In (24h):',
    pegout24hLabel: 'Peg-Out (24h):',
    confidentialRatioLabel: 'Confidential Tx Ratio:',
    federationNodesLabel: 'Federation Nodes:',
    assetDetailTitle: 'Liquid Asset Details',
    assetIdLabel: 'Asset ID:',
    tickerLabel: 'Ticker:',
    issuerDomainLabel: 'Issuer Domain:',

    // Tools & New Features
    psbtDecoderTitle: 'PSBT Decoder (BIP 174)',
    psbtDecoderSubtitle: 'Inspect inputs, outputs and signatures of partially signed bitcoin transactions',
    psbtInputLabel: 'PSBT Hex or Base64 String:',
    psbtInputPlaceholder: 'Paste PSBT here (starting with magic bytes "psbt" in hex 70736274 or base64 cHNid)...',
    psbtDecodeBtn: 'Decode PSBT',
    psbtEmptyError: 'Please enter a PSBT string.',
    psbtInvalidMagicError: 'Invalid PSBT format. Must start with magic bytes "psbt".',
    psbtParseError: 'Failed to parse PSBT structure.',
    psbtReadyFinalize: 'PSBT Ready to Finalize / Broadcast',
    psbtNeedsSignature: 'Pending Additional Signatures',
    psbtInputs: 'Inputs',
    psbtOutputs: 'Outputs',
    copyRaw: 'Copy Hex/Raw',
    copied: 'Copied!',
    qrCodeModalTitle: 'QR Code for Fast Scan',
    satsConverterTitle: 'Sats/Fiat Converter & RBF Calculator',
    satsConverterSubtitle: 'Real-time conversion of Satoshis, BTC and Fiat + RBF/CPFP fee booster simulator',
    converterTab: 'Fiat/Sats Converter',
    rbfSimulatorTab: 'RBF / CPFP Booster',
    watchlistTitle: 'Your Saved Watchlist',
    watchlistSubtitle: 'Track locally saved addresses, transactions and XPUBs in your browser',
    itemsSaved: 'saved items',
    addFavoriteBtn: 'Add New Favorite',
    addressTxPlaceholder: 'Address, TxID, XPUB or Asset ID...',
    labelPlaceholder: 'Label / Nickname (e.g. Cold Storage)...',
    saveBtn: 'Save',
    filterFavorites: 'Filter favorites...',
    emptyWatchlist: 'No items saved to your watchlist yet.',
    toolsBtn: 'Tools & Utils',

    // New Charts & Dashboards i18n
    chartsDashboardTitle: 'Integrated On-Chain Analytics & Charts Dashboard',
    chartsDashboardSubtitle: 'Real-time filters for Hashrate, Difficulty, Mempool, BTC Price and Adoption',
    hashrateTitle: 'Estimated Network Hashrate (EH/s)',
    btcPriceVolumeTitle: 'BTC Price & Transaction Volume',
    addressTypeDistTitle: 'On-Chain Address & Script Type Distribution',
    mempoolConsensus: 'Mempool Consensus',
    liquidChartsTitle: 'Liquid Sidechain Charts & Analytics',
    liquidChartsSubtitle: 'Peg-In/Out Flow, Confidential Transactions and Asset Share',
    pegInOutTitle: 'Peg-In vs Peg-Out Flow (L-BTC)',
    confidentialRatioTitle: 'Confidential Tx Ratio (%)',
    liquidAssetShareTitle: 'Liquid Issued Assets Market Share',
    rangeLabel: 'RANGE',
    txCountLabelUpper: 'TX COUNT',
    sizeLabelUpper: 'SIZE',
    days7: '7 Days',
    days30: '30 Days',
    proportion: 'Proportion',
    marketShare: 'Market Share',
    blockNum1Label: 'Next Block (~10 min)',
    blockNum2Label: 'Block #2 (~20 min)',
    blockNum3Label: 'Block #3 (~30 min)',
    blockNum4Label: 'Block #4 (~40 min)',
    minedLabel: 'Mined:',
    medianFeeLabel: 'Median Fee:',
    lbtcBackedLabel: '100% Backed by BTC in Federation',
    confidentialValuesHidden: 'Hidden Values & Assets',
    featuredLiquidAssets: 'Featured Assets on Liquid Network',
    recentLiquidBlocks: 'Recent Liquid Network Blocks (~1 min block time)',
    otherIssuedTokens: 'Other Issued Tokens',
    confidentialTxLabel: 'Confidential Tx',
    formatLabel: 'Format:'
  }
};

export type TranslationKey = keyof typeof translations['pt'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
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

  const t = (key: TranslationKey): string => {
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

