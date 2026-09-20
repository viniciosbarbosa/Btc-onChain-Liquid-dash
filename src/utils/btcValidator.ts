import { SearchTypeResult } from '../types';

export function detectSearchType(query: string): SearchTypeResult {
  if (!query || typeof query !== 'string') return { type: 'unknown', value: '' };

  const trimmed = query.trim();

  // Block Height (numeric)
  if (/^\d+$/.test(trimmed)) {
    return { type: 'block_height', value: parseInt(trimmed, 10) };
  }

  // XPUB / YPUB / ZPUB / TPUB / VPUB
  if (/^(xpub|ypub|zpub|tpub|vpub|upub)[a-km-zA-HJ-NP-Z1-9]{90,110}$/i.test(trimmed)) {
    return { type: 'xpub', value: trimmed };
  }

  // 64-char Hex (TxID, Block Hash, or Liquid Asset ID)
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    if (trimmed.startsWith('00000000')) {
      return { type: 'block_hash', value: trimmed.toLowerCase() };
    }
    // Could be TxID or Liquid Asset ID
    return { type: 'tx_or_asset', value: trimmed.toLowerCase() };
  }

  // Bitcoin / Liquid Address Formats
  if (
    /^(1|3|bc1q|bc1p|lq1|ex1|Q)[a-zA-HJ-NP-Z0-9]{25,90}$/i.test(trimmed)
  ) {
    return { type: 'address', value: trimmed };
  }

  return { type: 'text', value: trimmed };
}
