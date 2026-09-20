import { NodeConfig, TorGatewayMode } from '../types';

export const DEFAULT_CONFIG: NodeConfig = {
  torGatewayMode: (import.meta.env.VITE_TOR_GATEWAY_MODE as TorGatewayMode) || 'onion.ly',
  localTorProxyUrl: import.meta.env.VITE_LOCAL_TOR_PROXY_URL || 'http://localhost:9050',
  umbrelApiUrl: import.meta.env.VITE_BITCOIN_ONION_API || 'http://umbrel.local:3002/api',
  btcPublicApi: import.meta.env.VITE_BTC_PUBLIC_FALLBACK || 'https://mempool.space/api',
  liquidPublicApi: import.meta.env.VITE_LIQUID_PUBLIC_FALLBACK || 'https://blockstream.info/liquid/api',

  elementsNode: {
    p2pHost: import.meta.env.VITE_LIQUID_P2P_HOST || 'your-liquid-p2p-node.onion',
    p2pPort: parseInt(import.meta.env.VITE_LIQUID_P2P_PORT || '18332', 10),
    rpcHost: import.meta.env.VITE_LIQUID_RPC_HOST || 'your-liquid-rpc-node.onion',
    rpcPort: parseInt(import.meta.env.VITE_LIQUID_RPC_PORT || '7041', 10),
    rpcUser: import.meta.env.VITE_LIQUID_RPC_USER || 'elements',
    rpcPass: import.meta.env.VITE_LIQUID_RPC_PASS || 'YOUR_ELEMENTS_RPC_PASSWORD',
    electrumHost: import.meta.env.VITE_LIQUID_ELECTRUM_HOST || 'your-liquid-electrum-node.onion',
    electrumPort: parseInt(import.meta.env.VITE_LIQUID_ELECTRUM_PORT || '50001', 10)
  }
};

/**
 * Transforms any .onion host URL into a browser-resolvable Tor Gateway endpoint.
 */
export function formatOnionUrl(hostOrUrl: string, gatewayMode: TorGatewayMode = 'onion.ly'): string {
  if (!hostOrUrl) return '';

  let clean = hostOrUrl.trim();

  // If already full HTTP/HTTPS URL and no .onion, return clean
  if (!clean.includes('.onion')) {
    return clean;
  }

  // Remove leading protocol if present
  clean = clean.replace(/^https?:\/\//, '');

  if (gatewayMode === 'onion.ly') {
    const [domainAndPort, ...rest] = clean.split('/');
    const path = rest.join('/');
    const [domain, port] = domainAndPort.split(':');
    const portStr = port ? `:${port}` : '';
    return `https://${domain}.ly${portStr}${path ? '/' + path : ''}`;
  }

  if (gatewayMode === 'onion.pet') {
    const [domainAndPort, ...rest] = clean.split('/');
    const path = rest.join('/');
    const [domain, port] = domainAndPort.split(':');
    const portStr = port ? `:${port}` : '';
    return `https://${domain}.pet${portStr}${path ? '/' + path : ''}`;
  }

  return `http://${clean}`;
}

export function getNodeConfig(): NodeConfig {
  try {
    const saved = localStorage.getItem('btc_dash_node_config');
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading saved node config:', e);
  }
  return DEFAULT_CONFIG;
}

export function saveNodeConfig(config: NodeConfig): void {
  try {
    localStorage.setItem('btc_dash_node_config', JSON.stringify(config));
  } catch (e) {
    console.error('Error saving node config:', e);
  }
}
