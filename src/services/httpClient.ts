import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getNodeConfig, formatOnionUrl } from '../config/apiEndpoints';
import { ApiResponse } from '../types';

/**
 * Professional Axios HTTP Client with Tor Gateway Resolution & Fallback
 */
export async function getWithFallback<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> {
  const config = getNodeConfig();
  
  // Format Tor .onion API URL or local endpoint
  const onionBase = formatOnionUrl(config.umbrelApiUrl, config.torGatewayMode);
  const primaryUrl = `${onionBase.replace(/\/$/, '')}${endpoint}`;
  const fallbackBase = config.btcPublicApi.replace(/\/$/, '');

  // 1. Try Custom Node / Tor .onion API via Axios
  try {
    const res = await axios.get<T>(primaryUrl, {
      timeout: 4000,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (res.status === 200 && res.data) {
      return { data: res.data, source: 'umbrel' };
    }
  } catch (err) {
    // Silent fallback to public API
  }

  // 2. Fallback to Mempool.space / Public REST API via Axios
  try {
    let publicEndpoint = endpoint;
    if (endpoint === '/mempool/fees') publicEndpoint = '/v1/fees/recommended';
    if (endpoint === '/blocks/tip') publicEndpoint = '/blocks/tip/height';
    if (endpoint === '/price') publicEndpoint = '/v1/prices';

    const res = await axios.get<T>(`${fallbackBase}${publicEndpoint}`, {
      timeout: 5000,
      headers: { 'Accept': 'application/json' }
    });

    if (res.status === 200 && res.data) {
      return { data: res.data, source: 'public' };
    }
  } catch (fallbackErr) {
    console.warn(`Axios fallback fetch failed for ${endpoint}:`, fallbackErr);
  }

  throw new Error(`Axios: Unable to fetch ${endpoint} from node or public fallback.`);
}

/**
 * Professional Axios POST with Tor Gateway Resolution & Fallback for Raw Tx Broadcast
 */
export async function postWithFallback<T>(
  endpoint: string,
  data: any,
  options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> {
  const config = getNodeConfig();
  const onionBase = formatOnionUrl(config.umbrelApiUrl, config.torGatewayMode);
  const primaryUrl = `${onionBase.replace(/\/$/, '')}${endpoint}`;
  const fallbackBase = config.btcPublicApi.replace(/\/$/, '');

  try {
    const res = await axios.post<T>(primaryUrl, data, {
      timeout: 8000,
      headers: { 'Content-Type': 'text/plain', ...(options.headers || {}) },
      ...options
    });
    if (res.status === 200 && res.data) {
      return { data: res.data, source: 'umbrel' };
    }
  } catch (err) {
    // Fallback to public node broadcast
  }

  try {
    const res = await axios.post<T>(`${fallbackBase}${endpoint}`, data, {
      timeout: 8000,
      headers: { 'Content-Type': 'text/plain' }
    });
    if (res.status === 200 && res.data) {
      return { data: res.data, source: 'public' };
    }
  } catch (fallbackErr) {
    console.warn(`Axios fallback POST failed for ${endpoint}:`, fallbackErr);
  }

  throw new Error(`Axios: Transmissão da transação falhou no nó local e no nó público.`);
}

/**
 * Creates an Axios instance with Basic Auth for Elements Core RPC calls
 */
export function createElementsRpcClient(): AxiosInstance {
  const config = getNodeConfig();
  const rpcOnionUrl = formatOnionUrl(
    `${config.elementsNode.rpcHost}:${config.elementsNode.rpcPort}`,
    config.torGatewayMode
  );

  return axios.create({
    baseURL: rpcOnionUrl,
    timeout: 5000,
    auth: {
      username: config.elementsNode.rpcUser,
      password: config.elementsNode.rpcPass
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
