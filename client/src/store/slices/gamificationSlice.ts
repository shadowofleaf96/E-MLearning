import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

export interface GamificationStats {
  xp: number;
  level: number;
  streak: number;
  badges: any[];
  goals?: any[];
  milestones?: any[];
}

interface GamificationState {
  stats: GamificationStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: GamificationState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchGamificationStats = createAsyncThunk(
  'gamification/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.GAMIFICATION.STATS);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch gamification stats'
      );
    }
  }
);

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGamificationStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGamificationStats.fulfilled,
        (state, action: PayloadAction<GamificationStats>) => {
          state.loading = false;
          state.stats = action.payload;
        }
      )
      .addCase(fetchGamificationStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default gamificationSlice.reducer;
