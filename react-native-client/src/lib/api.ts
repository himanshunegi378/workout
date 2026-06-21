import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const BACKEND_URL = Platform.select({
  android: 'http://10.0.2.2:4000',
  default: 'http://localhost:4000',
});

const TOKEN_KEY = 'auth_token';

/**
 * Retrieves the persisted auth token from secure storage.
 */
async function getStoredToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  } else {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  }
}

export interface FetchOptions extends RequestInit {
  token?: string | null;
}

/**
 * Custom fetch client that automatically:
 * 1. Appends the dynamic backend URL based on OS platform.
 * 2. Injects the Bearer Authorization header using either the provided token or stored token.
 * 3. Default handles Content-Type to application/json.
 */
export async function apiFetch(path: string, options: FetchOptions = {}): Promise<Response> {
  const url = path.startsWith('http') ? path : `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = options.token !== undefined ? options.token : await getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}
