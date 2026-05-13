import apiClient, { triggerForceLogout } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: 'buyer' | 'jastiper';
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
}

export interface RefreshResponse {
  access_token: string;
  expires_in: number;
}

export interface ErrorResponse {
  error: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/v1/auth/login', data);
    const { access_token, expires_in } = response.data;
    localStorage.setItem('access_token', access_token);
    scheduleTokenRefresh(expires_in);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/v1/auth/register', data);
    const { access_token, expires_in } = response.data;
    localStorage.setItem('access_token', access_token);
    scheduleTokenRefresh(expires_in);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/v1/auth/logout');
      return response.data;
    } finally {
      localStorage.removeItem('access_token');
      clearTokenRefresh();
    }
  },

  refresh: async (): Promise<RefreshResponse> => {
    const response = await apiClient.post<RefreshResponse>('/v1/auth/refresh');
    return response.data;
  },
};

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

export function scheduleTokenRefresh(expiresIn: number) {
  const refreshTime = (expiresIn - 60) * 1000;

  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  if (refreshTime > 0) {
    refreshTimeout = setTimeout(async () => {
      try {
        const response = await authApi.refresh();
        localStorage.setItem('access_token', response.access_token);
        scheduleTokenRefresh(response.expires_in);
      } catch {
        localStorage.removeItem('access_token');
        triggerForceLogout();
      }
    }, refreshTime);
  }
}

export function clearTokenRefresh() {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}