/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOR_GATEWAY_MODE?: string;
  readonly VITE_LOCAL_TOR_PROXY_URL?: string;
  readonly VITE_BITCOIN_ONION_API?: string;
  readonly VITE_LIQUID_P2P_HOST?: string;
  readonly VITE_LIQUID_P2P_PORT?: string;
  readonly VITE_LIQUID_RPC_HOST?: string;
  readonly VITE_LIQUID_RPC_PORT?: string;
  readonly VITE_LIQUID_RPC_USER?: string;
  readonly VITE_LIQUID_RPC_PASS?: string;
  readonly VITE_LIQUID_ELECTRUM_HOST?: string;
  readonly VITE_LIQUID_ELECTRUM_PORT?: string;
  readonly VITE_BTC_PUBLIC_FALLBACK?: string;
  readonly VITE_LIQUID_PUBLIC_FALLBACK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
