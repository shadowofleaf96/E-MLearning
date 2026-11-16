import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrentUser } from '@/types/user.types';

interface AuthState {
  user: CurrentUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{ user: CurrentUser; token: string }>
    ) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUser(state, action: PayloadAction<CurrentUser>) {
      state.user = action.payload;
      if (action.payload) {
        state.isAuthenticated = true;
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('token') || sessionStorage.getItem('token')
            : null;
        if (token) {
          state.token = token;
        }
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;
