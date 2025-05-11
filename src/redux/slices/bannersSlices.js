import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server"; // Your API base URL

// ✅ Fetch All Banners
export const fetchBannerss = createAsyncThunk("bannerss/fetchBannerss", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/banners/public/getbanners`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.banners;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch banners");
    }
});

// ✅ Add New Banner
export const addBanners = createAsyncThunk("bannerss/addBanners", async (formData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${server}/banners/admin/addbanners`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.banner;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add banner");
    }
});

// ✅ Update Banner
export const updateBanners = createAsyncThunk("bannerss/updateBanners", async ({ id, data }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${server}/banners/admin/edit/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.banner;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update banner");
    }
});

// ✅ Fetch Single Banner
export const fetchSingleBanners = createAsyncThunk("bannerss/fetchSingleBanners", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/banners/public/getbanner/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.banner;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch banner");
    }
});

// ✅ Delete Banner
export const deleteBanners = createAsyncThunk("bannerss/deleteBanners", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        await axios.delete(`${server}/banners/admin/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return id; // Return deleted ID for removal from store
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete banner");
    }
});

// ✅ Banner Slice
const bannersSlice = createSlice({
    name: "bannerss",
    initialState: {
        banners: [],
        banner: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch All Banners
            .addCase(fetchBannerss.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBannerss.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchBannerss.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Banner
            .addCase(addBanners.pending, (state) => {
                state.loading = true;
            })
            .addCase(addBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners.push(action.payload);
            })
            .addCase(addBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Banner
            .addCase(updateBanners.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banner = action.payload;
                const index = state.banners.findIndex((b) => b._id === action.payload._id);
                if (index !== -1) {
                    state.banners[index] = action.payload;
                    state.banners = [...state.banners];
                }
            })
            .addCase(updateBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Single Banner
            .addCase(fetchSingleBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banner = action.payload;
            })
            .addCase(fetchSingleBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Banner
            .addCase(deleteBanners.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = state.banners.filter((b) => b._id !== action.payload);
            })
            .addCase(deleteBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default bannersSlice.reducer;
