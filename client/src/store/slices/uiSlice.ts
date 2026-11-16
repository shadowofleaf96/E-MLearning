import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  activeModals: Record<string, boolean>;
}

const initialState: UiState = {
  sidebarOpen: true,
  theme: 'light',
  activeModals: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark' | 'system'>) {
      state.theme = action.payload;
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModals[action.payload] = true;
    },
    closeModal(state, action: PayloadAction<string>) {
      state.activeModals[action.payload] = false;
    },
    closeAllModals(state) {
      state.activeModals = {};
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  openModal,
  closeModal,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;
