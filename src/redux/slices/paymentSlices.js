import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// Fetch all UPI configs
export const fetchPaymentConfigs = createAsyncThunk(
  "paymentConfig/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${server}/payment/payment-config`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.configs; // <-- this must match { success, configs }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const slice = createSlice({
  name: "paymentConfig",
  initialState: { configs: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.configs = action.payload;
      })
      .addCase(fetchPaymentConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
