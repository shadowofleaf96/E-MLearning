import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tenant } from '@/types/tenant.types';

interface TenantState {
  currentTenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  currentTenant: null,
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    fetchTenantStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTenantSuccess(state, action: PayloadAction<Tenant>) {
      state.loading = false;
      state.currentTenant = action.payload;
    },
    fetchTenantFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearTenant(state) {
      state.currentTenant = null;
      state.error = null;
    },
  },
});

export const {
  fetchTenantStart,
  fetchTenantSuccess,
  fetchTenantFailure,
  clearTenant,
} = tenantSlice.actions;

export default tenantSlice.reducer;
