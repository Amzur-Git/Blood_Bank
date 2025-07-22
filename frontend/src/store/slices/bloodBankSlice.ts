import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BloodBankState, BloodBank, SearchFilters } from '../../types';
import { bloodBankAPI } from '../../services/api';

const initialState: BloodBankState = {
  bloodBanks: [],
  selectedBloodBank: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchBloodBanks = createAsyncThunk(
  'bloodBanks/fetchBloodBanks',
  async (filters: SearchFilters = {}, { rejectWithValue }) => {
    try {
      const response = await bloodBankAPI.getBloodBanks(filters);
      if (response.data.success && response.data.data) {
        return response.data.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch blood banks');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blood banks');
    }
  }
);

export const fetchBloodBankById = createAsyncThunk(
  'bloodBanks/fetchBloodBankById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await bloodBankAPI.getBloodBankById(id);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch blood bank');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blood bank');
    }
  }
);

export const createBloodBank = createAsyncThunk(
  'bloodBanks/createBloodBank',
  async (bloodBankData: Partial<BloodBank>, { rejectWithValue }) => {
    try {
      const response = await bloodBankAPI.createBloodBank(bloodBankData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to create blood bank');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create blood bank');
    }
  }
);

export const updateBloodBank = createAsyncThunk(
  'bloodBanks/updateBloodBank',
  async ({ id, bloodBankData }: { id: string; bloodBankData: Partial<BloodBank> }, { rejectWithValue }) => {
    try {
      const response = await bloodBankAPI.updateBloodBank(id, bloodBankData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to update blood bank');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update blood bank');
    }
  }
);

export const deleteBloodBank = createAsyncThunk(
  'bloodBanks/deleteBloodBank',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await bloodBankAPI.deleteBloodBank(id);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue(response.data.message || 'Failed to delete blood bank');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete blood bank');
    }
  }
);

const bloodBankSlice = createSlice({
  name: 'bloodBanks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedBloodBank: (state, action: PayloadAction<BloodBank | null>) => {
      state.selectedBloodBank = action.payload;
    },
    clearBloodBanks: (state) => {
      state.bloodBanks = [];
      state.selectedBloodBank = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blood banks
      .addCase(fetchBloodBanks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBloodBanks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bloodBanks = action.payload;
        state.error = null;
      })
      .addCase(fetchBloodBanks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch blood bank by ID
      .addCase(fetchBloodBankById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBloodBankById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBloodBank = action.payload;
        state.error = null;
      })
      .addCase(fetchBloodBankById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create blood bank
      .addCase(createBloodBank.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBloodBank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bloodBanks.push(action.payload);
        state.error = null;
      })
      .addCase(createBloodBank.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update blood bank
      .addCase(updateBloodBank.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBloodBank.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bloodBanks.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bloodBanks[index] = action.payload;
        }
        if (state.selectedBloodBank?.id === action.payload.id) {
          state.selectedBloodBank = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBloodBank.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete blood bank
      .addCase(deleteBloodBank.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBloodBank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bloodBanks = state.bloodBanks.filter(b => b.id !== action.payload);
        if (state.selectedBloodBank?.id === action.payload) {
          state.selectedBloodBank = null;
        }
        state.error = null;
      })
      .addCase(deleteBloodBank.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedBloodBank, clearBloodBanks } = bloodBankSlice.actions;
export default bloodBankSlice.reducer;
