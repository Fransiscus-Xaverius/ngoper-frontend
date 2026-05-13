import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authApi, scheduleTokenRefresh, clearTokenRefresh } from '../../api/auth';
import apiClient from '../../api/client';
import type { LoginRequest } from '../../api/auth';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  location?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,
};

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<User>('/v1/auth/me');
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch user');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('access_token', response.access_token);
      scheduleTokenRefresh(response.expires_in);
      return { token: response.access_token };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      return rejectWithValue(err.response?.data?.error || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    localStorage.removeItem('access_token');
    clearTokenRefresh();
    return null;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } } };
    localStorage.removeItem('access_token');
    clearTokenRefresh();
    return rejectWithValue(err.response?.data?.error || 'Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;