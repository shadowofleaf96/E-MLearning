import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  certificatesService,
  CertificateItem,
} from '@/modules/certificates/services/certificates.service';

export type Certificate = CertificateItem;

interface CertificateState {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;
}

const initialState: CertificateState = {
  certificates: [],
  loading: false,
  error: null,
};

export const fetchCertificates = createAsyncThunk(
  'certificate/fetchCertificates',
  async (_, { rejectWithValue }) => {
    try {
      return await certificatesService.getStudentCertificates();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch certificates'
      );
    }
  }
);

const certificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCertificates.fulfilled,
        (state, action: PayloadAction<Certificate[]>) => {
          state.loading = false;
          state.certificates = action.payload;
        }
      )
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default certificateSlice.reducer;
