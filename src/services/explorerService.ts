import { getWithFallback, postWithFallback } from './httpClient';
import { ApiResponse, BtcBlock, BtcTx, AddressData, XpubData, DerivedAddress, MempoolFees, PriceData } from '../types';

export const explorerService = {
  async getTip(): Promise<ApiResponse<number | string | any>> {
    return getWithFallback<number | string | any>('/blocks/tip');
  },

  async getBlock(hashOrHeight: string | number): Promise<ApiResponse<BtcBlock>> {
    return getWithFallback<BtcBlock>(`/block/${hashOrHeight}`);
  },

  async getTransaction(txid: string): Promise<ApiResponse<BtcTx>> {
    return getWithFallback<BtcTx>(`/tx/${txid}`);
  },

  async broadcastTx(rawHex: string): Promise<ApiResponse<string>> {
    return postWithFallback<string>('/tx', rawHex);
  },

  async getAddress(address: string, limit = 25, offset = 0): Promise<ApiResponse<AddressData>> {
    return getWithFallback<AddressData>(`/address/${address}?limit=${limit}&offset=${offset}`);
  },

  async getXpub(xpub: string): Promise<ApiResponse<XpubData>> {
    return getWithFallback<XpubData>(`/xyzpub/${xpub}`);
  },

  async getXpubAddresses(xpub: string, receiveOrChange = 0, limit = 20): Promise<ApiResponse<DerivedAddress[]>> {
    return getWithFallback<DerivedAddress[]>(`/xyzpub/addresses/${xpub}?receiveOrChange=${receiveOrChange}&limit=${limit}`);
  },

  async getXpubTxids(xpub: string, gapLimit = 20): Promise<ApiResponse<string[]>> {
    return getWithFallback<string[]>(`/xyzpub/txids/${xpub}?gapLimit=${gapLimit}`);
  },

  async getHashrate(): Promise<ApiResponse<any>> {
    return getWithFallback<any>('/mining/hashrate');
  },

  async getDiffAdj(): Promise<ApiResponse<any>> {
    return getWithFallback<any>('/mining/diff-adj-estimate');
  },

  async getNextBlockPredictor(): Promise<ApiResponse<any>> {
    return getWithFallback<any>('/mining/next-block');
  },

  async getNextBlockTxids(): Promise<ApiResponse<string[]>> {
    return getWithFallback<string[]>('/mining/next-block/txids');
  },

  async getMempoolFees(): Promise<ApiResponse<MempoolFees>> {
    return getWithFallback<MempoolFees>('/mempool/fees');
  },

  async getMempoolSummary(): Promise<ApiResponse<any>> {
    return getWithFallback<any>('/mempool/summary');
  },

  async getMempoolCount(): Promise<ApiResponse<number | any>> {
    return getWithFallback<number | any>('/mempool/count');
  },

  async getPrice(): Promise<ApiResponse<PriceData>> {
    return getWithFallback<PriceData>('/price');
  },

  async getNextHalving(): Promise<ApiResponse<any>> {
    return getWithFallback<any>('/blockchain/next-halving');
  },

  async getRandomQuote(): Promise<ApiResponse<{ quote?: string; text?: string; author: string }>> {
    return getWithFallback<{ quote?: string; text?: string; author: string }>('/quotes/random');
  }
};
