import axios from 'axios';

let forceLogoutHandler: (() => void) | null = null;

export function setForceLogoutHandler(handler: () => void) {
  forceLogoutHandler = handler;
}

export function triggerForceLogout() {
  if (forceLogoutHandler) {
    forceLogoutHandler();
  } else {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const PUBLIC_AUTH_PATHS = ['/v1/auth/login', '/v1/auth/register', '/v1/auth/refresh'];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !PUBLIC_AUTH_PATHS.some((p) => originalRequest.url?.includes(p))
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch {
        processQueue(new Error('refresh failed'), null);
        localStorage.removeItem('access_token');
        triggerForceLogout();
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
