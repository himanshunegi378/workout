import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL = Platform.select({
  android: 'http://10.0.2.2:4000',
  default: 'http://localhost:4000',
});

export interface User {
  id: string;
  username: string;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_KEY = 'auth_token';

/**
 * Persists token to secure storage or localStorage depending on platform.
 */
async function setSecureItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

/**
 * Retrieves token from secure storage or localStorage depending on platform.
 */
async function getSecureItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage not available:', e);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

/**
 * Removes token from secure storage or localStorage depending on platform.
 */
async function deleteSecureItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

/**
 * Provides JWT auth token, current user, login, signup, and logout actions.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Load token on startup and verify via /api/auth/me
  useEffect(() => {
    async function loadStoredState() {
      try {
        const storedToken = await getSecureItem(TOKEN_KEY);
        if (storedToken) {
          const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setToken(storedToken);
            setUser(userData);
          } else {
            // Token is invalid/expired
            await deleteSecureItem(TOKEN_KEY);
          }
        }
      } catch (e) {
        console.error('Failed to load auth token:', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredState();
  }, []);

  /**
   * Authenticates user credentials with the backend.
   */
  const login = async (username: string, password: string) => {
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      await setSecureItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser({ id: data.id, username: data.username });
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      throw err;
    }
  };

  /**
   * Registers a new user account with the backend.
   */
  const signup = async (username: string, password: string) => {
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      await setSecureItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser({ id: data.id, username: data.username });
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
      throw err;
    }
  };

  /**
   * Clears the user session and secure storage token.
   */
  const logout = async () => {
    setError(null);
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, { method: 'POST' }).catch(() => {});
    } finally {
      await deleteSecureItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        login,
        signup,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Accesses current auth context session.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
