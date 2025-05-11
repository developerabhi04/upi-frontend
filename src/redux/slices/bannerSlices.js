import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server"; // Your API base URL

// ✅ Fetch All Banners
export const fetchBanners = createAsyncThunk("banners/fetchBanners", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/banner/public/getbanner`, {
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
export const addBanner = createAsyncThunk("banners/addBanner", async (formData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${server}/banner/admin/addbanner`, formData, {
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
export const updateBanner = createAsyncThunk("banners/updateBanner", async ({ id, data }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${server}/banner/admin/edit/${id}`, data, {
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
export const fetchSingleBanner = createAsyncThunk("banners/fetchSingleBanner", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/banner/public/getbanner/${id}`, {
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
export const deleteBanner = createAsyncThunk("banners/deleteBanner", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        await axios.delete(`${server}/banner/admin/delete/${id}`, {
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
const bannerSlice = createSlice({
    name: "banners",
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
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Banner
            .addCase(addBanner.pending, (state) => {
                state.loading = true;
            })
            .addCase(addBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.banners.push(action.payload);
            })
            .addCase(addBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Banner
            .addCase(updateBanner.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.banner = action.payload;
                const index = state.banners.findIndex((b) => b._id === action.payload._id);
                if (index !== -1) {
                    state.banners[index] = action.payload;
                    state.banners = [...state.banners];
                }
            })
            .addCase(updateBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Single Banner
            .addCase(fetchSingleBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.banner = action.payload;
            })
            .addCase(fetchSingleBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Banner
            .addCase(deleteBanner.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = state.banners.filter((b) => b._id !== action.payload);
            })
            .addCase(deleteBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default bannerSlice.reducer;
