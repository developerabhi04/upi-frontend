import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { server } from "../../server";


export const fetchBanners = createAsyncThunk('banner/fetchBanners', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${server}/event/public/banners`);
    return data.banners;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});


export const createBanner = createAsyncThunk('banner/createBanner', async (formData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
    const { data } = await axios.post(`${server}/event/admin/banners`, formData, config);
    return data.banner;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});


export const updateBanner = createAsyncThunk('banner/updateBanner', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
    const { data } = await axios.put(`${server}/event/admin/banners/${id}`, formData, config);
    return data.banner;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});


export const deleteBanner = createAsyncThunk('banner/deleteBanner', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${server}/event/admin/banners/${id}`, config);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});


const bannerEventSlice = createSlice({
  name: 'bannerEvent',
  initialState: { banners: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBanners.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchBanners.fulfilled, (state, action) => { state.loading = false; state.banners = action.payload; })
      .addCase(fetchBanners.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createBanner.fulfilled, (state, action) => { state.banners.unshift(action.payload); })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.banners = state.banners.map(b => b._id === action.payload._id ? action.payload : b);
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter(b => b._id !== action.payload);
      });
  }
});

export default bannerEventSlice.reducer;