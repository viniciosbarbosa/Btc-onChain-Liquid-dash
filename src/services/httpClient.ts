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
  const isDev = import.meta.env.DEV;

  // Format Tor .onion API URL or local endpoint
  const onionBase = formatOnionUrl(config.umbrelApiUrl, config.torGatewayMode);
  const primaryUrl = `${onionBase.replace(/\/$/, '')}${endpoint}`;
  const fallbackBase = config.btcPublicApi.replace(/\/$/, '');

  let publicEndpoint = endpoint;
  if (endpoint === '/mempool/fees') publicEndpoint = '/v1/fees/recommended';
  if (endpoint === '/blocks/tip') publicEndpoint = '/blocks/tip/height';
  if (endpoint === '/price') publicEndpoint = '/v1/prices';

  const fetchPublic = async (): Promise<ApiResponse<T>> => {
    const res = await axios.get<T>(`${fallbackBase}${publicEndpoint}`, {
      timeout: 5000,
      headers: { 'Accept': 'application/json' }
    });
    if (res.status === 200 && res.data !== undefined && res.data !== null) {
      return { data: res.data, source: 'public' };
    }
    throw new Error('Public API empty response');
  };

  const fetchPrimary = async (): Promise<ApiResponse<T>> => {
    const res = await axios.get<T>(primaryUrl, {
      timeout: 4000,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (res.status === 200 && res.data !== undefined && res.data !== null) {
      return { data: res.data, source: 'umbrel' };
    }
    throw new Error('Primary node empty response');
  };

  // In non-dev environment, prioritize 3rd-party public API (mempool.space) directly
  if (!isDev) {
    try {
      return await fetchPublic();
    } catch (pubErr) {
      // Fallback to custom node URL if public fails
      try {
        return await fetchPrimary();
      } catch (primErr) {
        console.warn(`Both public and primary fetches failed for ${endpoint}:`, pubErr, primErr);
      }
    }
  } else {
    // In dev environment, try custom node / Tor gateway first, then fallback to public API
    try {
      return await fetchPrimary();
    } catch (primErr) {
      try {
        return await fetchPublic();
      } catch (pubErr) {
        console.warn(`Both primary and public fetches failed for ${endpoint}:`, primErr, pubErr);
      }
    }
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
  const isDev = import.meta.env.DEV;
  const onionBase = formatOnionUrl(config.umbrelApiUrl, config.torGatewayMode);
  const primaryUrl = `${onionBase.replace(/\/$/, '')}${endpoint}`;
  const fallbackBase = config.btcPublicApi.replace(/\/$/, '');

  const postPublic = async (): Promise<ApiResponse<T>> => {
    const res = await axios.post<T>(`${fallbackBase}${endpoint}`, data, {
      timeout: 8000,
      headers: { 'Content-Type': 'text/plain' }
    });
    if (res.status === 200 && res.data) {
      return { data: res.data, source: 'public' };
    }
    throw new Error('Public broadcast failed');
  };

  const postPrimary = async (): Promise<ApiResponse<T>> => {
    const res = await axios.post<T>(primaryUrl, data, {
      timeout: 8000,
      headers: { 'Content-Type': 'text/plain', ...(options.headers || {}) },
      ...options
    });
    if (res.status === 200 && res.data) {
      return { data: res.data, source: 'umbrel' };
    }
    throw new Error('Primary broadcast failed');
  };

  if (!isDev) {
    try {
      return await postPublic();
    } catch (pubErr) {
      try {
        return await postPrimary();
      } catch (primErr) {
        console.warn('POST failed on both endpoints:', pubErr, primErr);
      }
    }
  } else {
    try {
      return await postPrimary();
    } catch (primErr) {
      try {
        return await postPublic();
      } catch (pubErr) {
        console.warn('POST failed on both endpoints:', primErr, pubErr);
      }
    }
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
