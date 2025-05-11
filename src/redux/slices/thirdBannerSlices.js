import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server"; // Your API base URL




// ✅ Fetch All Banners
export const fetchThirdBanners = createAsyncThunk("third-banner/fetchThirdBanners", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${server}/third-banner/public/get-all-banner`);
        return response.data.thirdBanners;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch banners");
    }
});

// ✅ Add New Banner
export const addThirdBanner = createAsyncThunk("third-banner/add-third-Banner", async (formData, { rejectWithValue }) => {
        try {
            // console.log("📤 Sending request to add banner...");
            const token = localStorage.getItem("token");
            const response = await axios.post(`${server}/third-banner/admin/add-third-banner`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // console.log("Banner add successfully:", response.data); // ✅ Log success response
            return response.data.newThirdBanner;
        } catch (error) {
            console.error("Upload Error:", error.response?.data); // ✅ Log API error response
            return rejectWithValue(error.response?.data?.message || "Failed to add banner");
        }
    }
);


// ✅ Update Banner
export const updateThirdBanner = createAsyncThunk("third-banner/update-Banner", async ({ id, data }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${server}/third-banner/admin/edit/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.thirdBanner;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update banner");
    }
});

// ✅ Fetch Single Banner
export const fetchSingleBanner = createAsyncThunk("third-banner/fetchSingleBanner", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${server}/third-banner/public/getbanner/${id}`);
        return response.data.thirdBanner;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch banner");
    }
});

// ✅ Delete Banner
export const deleteBanner = createAsyncThunk("third-banner/deleteBanner", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        await axios.delete(`${server}/third-banner/admin/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return id; // Return deleted ID for removal from store
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete banner");
    }
});

// ✅ Banner Slice
const bannerSlice = createSlice({
    name: "thirdBanner",
    initialState: {
        thirdBanners: [],
        thirdBanner: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch All Banners
            .addCase(fetchThirdBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchThirdBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.thirdBanners = action.payload;
            })
            .addCase(fetchThirdBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Banner
            .addCase(addThirdBanner.pending, (state) => {
                state.loading = true;
            })
            .addCase(addThirdBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.thirdBanners = [...state.thirdBanners, action.payload]; // Ensure a new array is assigned

            })
            .addCase(addThirdBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Banner
            .addCase(updateThirdBanner.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateThirdBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.thirdBanner = action.payload;
                const index = state.thirdBanners.findIndex((b) => b._id === action.payload._id);
                if (index !== -1) {
                    state.thirdBanners[index] = action.payload;
                    state.thirdBanners = [...state.thirdBanners];
                }
            })
            .addCase(updateThirdBanner.rejected, (state, action) => {
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
                state.thirdBanner = action.payload;
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
                state.thirdBanners = state.thirdBanners.filter((b) => b._id !== action.payload);
            })
            .addCase(deleteBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default bannerSlice.reducer;
