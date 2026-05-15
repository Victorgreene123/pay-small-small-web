import { ApiResponse, AuthResponse } from '@/types/auth';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://pay-small-small.onrender.com/api';

/**
 * ===============================
 * 🔒 Global Refresh State
 * ===============================
 */
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * ===============================
 * 🔄 Handle Token Refresh (Safe)
 * ===============================
 */
async function handleTokenRefresh(): Promise<string | null> {
  if (!isRefreshing) {
    isRefreshing = true;

    refreshPromise = (async () => {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) return null;

      try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: storedRefreshToken,
          }),
        });

        const result: ApiResponse<AuthResponse> = await response.json();

        console.log('🔄 Refresh response:', result);

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Refresh failed');
        }

        // ✅ Save new tokens
        localStorage.setItem('token', result.data.accessToken);

        if (result.data.refreshToken) {
          localStorage.setItem(
            'refreshToken',
            result.data.refreshToken
          );
        }

        return result.data.accessToken;
      } catch (error) {
        console.error('❌ Refresh failed:', error);

        // ❌ Clear tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        return null;
      } finally {
        isRefreshing = false;
      }
    })();
  }

  return refreshPromise;
}

/**
 * ===============================
 * 🌐 Main API Fetch Function
 * ===============================
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  let response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  /**
   * ===============================
   * ⚠️ Handle 401 (Token Expired)
   * ===============================
   */
  /**
   * ===============================
   * ⚠️ Handle 401 (Token Expired)
   * ===============================
   */
  if (
    response.status === 401 &&
    retry &&
    typeof window !== 'undefined' &&
    !endpoint.includes('/auth/refresh')
  ) {
    console.warn('⚠️ Access token expired. Attempting refresh...');
    const newToken = await handleTokenRefresh();
    if (newToken) {
      console.log('✅ Token refreshed. Retrying request...');
      return apiFetch<T>(endpoint, options, false);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/auth/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {}
    throw new Error(errorMessage);
  }

  let result: any;
  try {
    result = await response.json();
  } catch (error) {
    throw new Error('Invalid server response');
  }

  if (result.success === false) {
    throw new Error(result.message || 'Action failed');
  }

  return result.data !== undefined ? result.data : result;
}