'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import { apiFetch } from '@/lib/api-client';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(async () => {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);

    if (refreshTokenValue) {
      try {
        await apiFetch('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: refreshTokenValue }),
        });
      } catch (error) {
        console.error('Logout request failed', error);
      }
    }
    
    if (pathname.startsWith('/dashboard')) {
      router.push('/auth/login');
    }
  }, [pathname, router]);

  const fetchUserProfile = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    // If no tokens exist at all, we're definitely logged out
    if (!savedToken && !refreshToken) {
      setIsLoading(false);
      return;
    }

    // prevent duplicate calls if already loading
    // and if user is already there, we might not need to fetch again immediately
    // unless this is a forced refresh. 

    try {
      const userData = await apiFetch<User>('/auth/me');
      setUser(userData);
      
      // If we are on login/register pages and already verified, go to dashboard
      if (pathname === '/auth/login' || pathname === '/auth/register') {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      // apiFetch handles 401s by attempting refresh, so if we're here, 
      // the refresh also failed or the server is down.
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router, logout]); // Removed logout from here if it causes stability issues, but apiFetch needs it indirectly. 
  // Wait, let's keep it simple. The loop is likely because useEffect depends on [fetchUserProfile] 
  // and fetchUserProfile used to depend on [logout, pathname, router]. 
  // If logout changes perfectly, it's fine. But logout depended on [pathname, router].
  // It's a chain.

  useEffect(() => {
    let mounted = true;
    if (mounted) {
       fetchUserProfile();
    }
    
    const handleFocus = () => {
      if (localStorage.getItem('token') && !user && !isLoading) {
        fetchUserProfile();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      mounted = false;
      window.removeEventListener('focus', handleFocus);
    }
  }, [fetchUserProfile]); // user and isLoading removed from deps to break loop

  const login = async (credentials: LoginCredentials) => {
    const data = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setToken(data.accessToken);
    setUser(data.user);
    router.push('/dashboard');
  };

  const register = async (credentials: RegisterCredentials) => {
    const data = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setToken(data.accessToken);
    setUser(data.user);
    router.push('/dashboard');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!token && !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
