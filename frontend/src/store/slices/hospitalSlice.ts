import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { HospitalState, Hospital, SearchFilters } from '../../types';
import { hospitalAPI } from '../../services/api';

const initialState: HospitalState = {
  hospitals: [],
  selectedHospital: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchHospitals = createAsyncThunk(
  'hospitals/fetchHospitals',
  async (filters: SearchFilters = {}, { rejectWithValue }) => {
    try {
      const response = await hospitalAPI.getHospitals(filters);
      if (response.data.success && response.data.data) {
        return response.data.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch hospitals');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hospitals');
    }
  }
);

export const fetchHospitalById = createAsyncThunk(
  'hospitals/fetchHospitalById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await hospitalAPI.getHospitalById(id);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch hospital');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hospital');
    }
  }
);

export const createHospital = createAsyncThunk(
  'hospitals/createHospital',
  async (hospitalData: Partial<Hospital>, { rejectWithValue }) => {
    try {
      const response = await hospitalAPI.createHospital(hospitalData);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to create hospital');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create hospital');
    }
  }
);

export const updateHospital = createAsyncThunk(
  'hospitals/updateHospital',
  async ({ id, hospitalData }: { id: string; hospitalData: Partial<Hospital> }, { rejectWithValue }) => {
    try {
      const response = await hospitalAPI.updateHospital(id, hospitalData);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to update hospital');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update hospital');
    }
  }
);

export const deleteHospital = createAsyncThunk(
  'hospitals/deleteHospital',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await hospitalAPI.deleteHospital(id);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue(response.data.message || 'Failed to delete hospital');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete hospital');
    }
  }
);

const hospitalSlice = createSlice({
  name: 'hospitals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedHospital: (state, action: PayloadAction<Hospital | null>) => {
      state.selectedHospital = action.payload;
    },
    clearHospitals: (state) => {
      state.hospitals = [];
      state.selectedHospital = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch hospitals
      .addCase(fetchHospitals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospitals = action.payload;
        state.error = null;
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch hospital by ID
      .addCase(fetchHospitalById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHospitalById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedHospital = action.payload;
        state.error = null;
      })
      .addCase(fetchHospitalById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create hospital
      .addCase(createHospital.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createHospital.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.hospitals.push(action.payload);
        }
        state.error = null;
      })
      .addCase(createHospital.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update hospital
      .addCase(updateHospital.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateHospital.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.hospitals.findIndex(h => h.id === action.payload!.id);
          if (index !== -1) {
            state.hospitals[index] = action.payload;
          }
          if (state.selectedHospital?.id === action.payload.id) {
            state.selectedHospital = action.payload;
          }
        }
        state.error = null;
      })
      .addCase(updateHospital.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete hospital
      .addCase(deleteHospital.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteHospital.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospitals = state.hospitals.filter(h => h.id !== action.payload);
        if (state.selectedHospital?.id === action.payload) {
          state.selectedHospital = null;
        }
        state.error = null;
      })
      .addCase(deleteHospital.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedHospital, clearHospitals } = hospitalSlice.actions;
export default hospitalSlice.reducer;
