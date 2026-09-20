// Domain Type Definitions for Bitcoin & Liquid Dashboard

export type TorGatewayMode = 'onion.ly' | 'onion.pet' | 'direct' | 'local_proxy';
export type NetworkType = 'btc' | 'liquid';
export type ActiveTabType = 'dashboard' | 'mempool' | 'fees' | 'liquid' | 'search';

export interface ElementsNodeConfig {
  p2pHost: string;
  p2pPort: number;
  rpcHost: string;
  rpcPort: number;
  rpcUser: string;
  rpcPass: string;
  electrumHost: string;
  electrumPort: number;
}

export interface NodeConfig {
  torGatewayMode: TorGatewayMode;
  localTorProxyUrl: string;
  umbrelApiUrl: string;
  btcPublicApi: string;
  liquidPublicApi: string;
  elementsNode: ElementsNodeConfig;
}

export interface BtcBlock {
  id?: string;
  height: number;
  hash: string;
  minedTime?: number;
  miner?: string;
  txCount: number;
  size: number;
  vSize?: number;
  medianFee: number;
  feeRange?: string;
  rewardBTC?: number;
  totalFeesSat?: number;
  color?: string;
  shadow?: string;
  label?: string;
}

export interface BtcTxStatus {
  confirmed: boolean;
  block_height?: number;
  block_hash?: string;
  block_time?: number;
}

export interface BtcPrevout {
  scriptpubkey_address?: string;
  value: number;
}

export interface BtcVin {
  txid: string;
  vout: number;
  prevout?: BtcPrevout;
}

export interface BtcVout {
  scriptpubkey_address?: string;
  value: number;
}

export interface BtcTx {
  txid: string;
  version?: number;
  locktime?: number;
  size: number;
  vsize?: number;
  weight?: number;
  fee?: number;
  status: BtcTxStatus;
  vin: BtcVin[];
  vout: BtcVout[];
}

export interface AddressStats {
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
  tx_count: number;
}

export interface AddressData {
  address: string;
  chain_stats: AddressStats;
  mempool_stats?: AddressStats;
}

export interface DerivedAddress {
  address: string;
  index: number;
  balanceSat: number;
  txCount: number;
}

export interface XpubData {
  xpub: string;
  type?: string;
  balanceSat: number;
  txCount: number;
}

export interface MempoolFees {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  minimumFee: number;
}

export interface PriceData {
  USD?: number;
  usd?: number;
  BRL?: number;
  brl?: number;
  EUR?: number;
}

export interface LiquidAsset {
  asset_id: string;
  ticker?: string;
  name?: string;
  entity?: { domain: string };
  chain_stats?: {
    tx_count: number;
    peg_in_count: number;
    peg_out_count: number;
    has_blinded_issuance: boolean;
  };
}

export interface LiquidStats {
  network: string;
  nodeConfig: ElementsNodeConfig;
  circulatingLbtc: number;
  pegin24h: number;
  pegout24h: number;
  federationNodes: number;
  confidentialTxRatio: number;
  assetsCount: number;
}

export interface LiquidVin {
  txid: string;
  vout: number;
  is_pegin?: boolean;
  pegin_txid?: string;
  issuance?: {
    asset_id: string;
    is_reissuance: boolean;
    asset_blinding_nonce?: string;
    contract_hash?: string;
    asset_entropy?: string;
  };
  scriptwitness?: string[];
}

export interface LiquidVout {
  scriptpubkey_address?: string;
  asset?: string;
  value?: number;
  valuecommitment?: string;
  assetcommitment?: string;
  surjection_proof?: string;
  range_proof?: string;
  is_pegout?: boolean;
}

export interface LiquidTx {
  txid: string;
  size: number;
  vsize: number;
  weight: number;
  fee?: number;
  fee_asset?: string;
  status: BtcTxStatus;
  vin: LiquidVin[];
  vout: LiquidVout[];
  is_confidential: boolean;
  has_issuance: boolean;
  is_pegin: boolean;
  is_pegout: boolean;
}

export interface LiquidBlock {
  height: number;
  tx_count: number;
  size: number;
  timestamp: number;
}

export type SearchType = 'block_height' | 'xpub' | 'block_hash' | 'tx_or_asset' | 'tx' | 'address' | 'text' | 'unknown';

export interface SearchTypeResult {
  type: SearchType;
  value: string | number;
}

export interface ApiResponse<T> {
  data?: T;
  source: 'umbrel' | 'public' | 'onion' | 'elements';
}
