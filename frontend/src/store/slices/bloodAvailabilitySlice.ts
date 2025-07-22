import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BloodAvailabilityState, BloodAvailability, SearchFilters } from '../../types';
import { bloodAvailabilityAPI } from '../../services/api';

const initialState: BloodAvailabilityState = {
  availabilities: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchBloodAvailability = createAsyncThunk(
  'bloodAvailability/fetchBloodAvailability',
  async (filters: SearchFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await bloodAvailabilityAPI.getBloodAvailability(filters);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch blood availability');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blood availability');
    }
  }
);

export const fetchEmergencyBloodAvailability = createAsyncThunk(
  'bloodAvailability/fetchEmergencyBloodAvailability',
  async ({ bloodType, cityId }: { bloodType: string; cityId: string }, { rejectWithValue }) => {
    try {
      const response = await bloodAvailabilityAPI.getEmergencyBloodAvailability(bloodType, cityId);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch emergency blood availability');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch emergency blood availability');
    }
  }
);

const bloodAvailabilitySlice = createSlice({
  name: 'bloodAvailability',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateBloodAvailability: (state, action: PayloadAction<BloodAvailability>) => {
      const index = state.availabilities.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.availabilities[index] = action.payload;
      }
    },
    clearBloodAvailability: (state) => {
      state.availabilities = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blood availability
      .addCase(fetchBloodAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBloodAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.availabilities = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchBloodAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch emergency blood availability
      .addCase(fetchEmergencyBloodAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmergencyBloodAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.availabilities = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchEmergencyBloodAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateBloodAvailability, clearBloodAvailability } = bloodAvailabilitySlice.actions;
export default bloodAvailabilitySlice.reducer;
