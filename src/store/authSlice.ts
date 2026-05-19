import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginPayload, SignupPayload } from '../types/index';
import { authService } from '../services/authService';
import type { LoginResponse } from '../services/authService';
import { userStorage, tokenStorage } from '../utils/localStorage';

const initialState: AuthState = {
  user: userStorage.get(),
  isAuthenticated: !!tokenStorage.get(),
  isLoading: false,
  error: null,
  token: tokenStorage.get() || undefined,
};

// Async thunks
export const loginUser = createAsyncThunk<LoginResponse, LoginPayload>(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.login(payload);
      tokenStorage.set(response.token);
      userStorage.set({
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        avatar: response.image,
        role: 'user',
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk<User, SignupPayload>(
  'auth/signupUser',
  async (payload, { rejectWithValue }) => {
    try {
      const user = await authService.signup(payload);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  authService.logout();
  userStorage.clear();
  tokenStorage.clear();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          avatar: action.payload.image,
          role: 'user',
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = undefined;
        state.error = null;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
