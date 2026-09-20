// Formatting utilities for Bitcoin and Liquid in TypeScript

export function formatSatsToBTC(sats: number | null | undefined, decimals = 8): string {
  if (sats === undefined || sats === null || isNaN(sats)) return '0.00000000';
  const btc = Number(sats) / 100000000;
  return btc.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatNumber(num: number | null | undefined): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US');
}

export function formatUSD(amount: number | null | undefined): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function formatBRL(amount: number | null | undefined): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
}

export function truncateHash(hash: string | null | undefined, start = 8, end = 8): string {
  if (!hash) return '';
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || isNaN(bytes)) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let size = Number(bytes);
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}

export function formatTimeAgo(timestamp: number | null | undefined): string {
  if (!timestamp) return 'Recente';
  const timeMs = typeof timestamp === 'number' && timestamp < 1e11 ? timestamp * 1000 : timestamp;
  const elapsed = Math.floor((Date.now() - timeMs) / 1000);
  
  if (elapsed < 60) return `${elapsed}s atrás`;
  if (elapsed < 3600) return `${Math.floor(elapsed / 60)}m atrás`;
  if (elapsed < 86400) return `${Math.floor(elapsed / 3600)}h atrás`;
  return `${Math.floor(elapsed / 86400)}d atrás`;
}

export function formatFeeRate(feeSat: number, vBytes: number): string {
  if (!vBytes || vBytes === 0) return '0.0 sat/vB';
  const rate = feeSat / vBytes;
  return `${rate.toFixed(1)} sat/vB`;
}

export function calculateMoscowTime(priceUSD: number | null | undefined): number {
  if (!priceUSD || priceUSD === 0) return 0;
  return Math.round(100000000 / priceUSD);
}
