import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server"; // Your API base URL




// ✅ Fetch All Banners
export const fetchSecondBanners = createAsyncThunk("second-banner/fetchSecondBanners", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${server}/second-banner/public/get-all-banner`);
        return response.data.banners;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch banners");
    }
});

// ✅ Add New Banner
export const addSecondBanner = createAsyncThunk(
    "second-banner/add-Second-Banner",
    async (formData, { rejectWithValue }) => {
        try {
            // console.log("📤 Sending request to add banner...");
            const token = localStorage.getItem("token");
            const response = await axios.post(`${server}/second-banner/admin/add-second-banner`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // console.log("Banner add successfully:", response.data); // ✅ Log success response
            return response.data.banner;
        } catch (error) {
            console.error("Upload Error:", error.response?.data); // ✅ Log API error response
            return rejectWithValue(error.response?.data?.message || "Failed to add banner");
        }
    }
);


// ✅ Update Banner
export const updateSecondBanner = createAsyncThunk("second-banner/update-Banner", async ({ id, data }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${server}/second-banner/admin/edit/${id}`, data, {
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
export const fetchSingleBanner = createAsyncThunk("second-banner/fetchSingleBanner", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${server}/second-banner/public/getbanner/${id}`);
        return response.data.banner;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch banner");
    }
});

// ✅ Delete Banner
export const deleteBanner = createAsyncThunk("second-banner/deleteBanner", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        await axios.delete(`${server}/second-banner/admin/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return id; // Return deleted ID for removal from store
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete banner");
    }
});

// ✅ Banner Slice
const bannerSlice = createSlice({
    name: "secondBanner",
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
            .addCase(fetchSecondBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSecondBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchSecondBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Banner
            .addCase(addSecondBanner.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSecondBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = [...state.banners, action.payload]; // Ensure a new array is assigned

            })
            .addCase(addSecondBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Banner
            .addCase(updateSecondBanner.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateSecondBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.secondBanner = action.payload;
                const index = state.banners.findIndex((b) => b._id === action.payload._id);
                if (index !== -1) {
                    state.banners[index] = action.payload;
                    state.banners = [...state.banners];
                }
            })
            .addCase(updateSecondBanner.rejected, (state, action) => {
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
