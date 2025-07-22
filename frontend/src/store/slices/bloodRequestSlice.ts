import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BloodRequestState, BloodRequest, SearchFilters } from '../../types';
import { bloodRequestAPI } from '../../services/api';

const initialState: BloodRequestState = {
  requests: [],
  selectedRequest: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchBloodRequests = createAsyncThunk(
  'bloodRequests/fetchBloodRequests',
  async (filters: SearchFilters = {}, { rejectWithValue }) => {
    try {
      const response = await bloodRequestAPI.getBloodRequests(filters);
      if (response.data.success && response.data.data) {
        return response.data.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch blood requests');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blood requests');
    }
  }
);

export const fetchBloodRequestById = createAsyncThunk(
  'bloodRequests/fetchBloodRequestById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await bloodRequestAPI.getBloodRequestById(id);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch blood request');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blood request');
    }
  }
);

export const createBloodRequest = createAsyncThunk(
  'bloodRequests/createBloodRequest',
  async (requestData: Partial<BloodRequest>, { rejectWithValue }) => {
    try {
      const response = await bloodRequestAPI.createBloodRequest(requestData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to create blood request');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create blood request');
    }
  }
);

export const updateBloodRequest = createAsyncThunk(
  'bloodRequests/updateBloodRequest',
  async ({ id, requestData }: { id: string; requestData: Partial<BloodRequest> }, { rejectWithValue }) => {
    try {
      const response = await bloodRequestAPI.updateBloodRequest(id, requestData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Failed to update blood request');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update blood request');
    }
  }
);

export const deleteBloodRequest = createAsyncThunk(
  'bloodRequests/deleteBloodRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await bloodRequestAPI.deleteBloodRequest(id);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue(response.data.message || 'Failed to delete blood request');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete blood request');
    }
  }
);

const bloodRequestSlice = createSlice({
  name: 'bloodRequests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedRequest: (state, action: PayloadAction<BloodRequest | null>) => {
      state.selectedRequest = action.payload;
    },
    clearBloodRequests: (state) => {
      state.requests = [];
      state.selectedRequest = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blood requests
      .addCase(fetchBloodRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBloodRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
        state.error = null;
      })
      .addCase(fetchBloodRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch blood request by ID
      .addCase(fetchBloodRequestById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBloodRequestById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedRequest = action.payload;
        state.error = null;
      })
      .addCase(fetchBloodRequestById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create blood request
      .addCase(createBloodRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBloodRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests.push(action.payload);
        state.error = null;
      })
      .addCase(createBloodRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update blood request
      .addCase(updateBloodRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBloodRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.selectedRequest?.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBloodRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete blood request
      .addCase(deleteBloodRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBloodRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = state.requests.filter(r => r.id !== action.payload);
        if (state.selectedRequest?.id === action.payload) {
          state.selectedRequest = null;
        }
        state.error = null;
      })
      .addCase(deleteBloodRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedRequest, clearBloodRequests } = bloodRequestSlice.actions;
export default bloodRequestSlice.reducer;
