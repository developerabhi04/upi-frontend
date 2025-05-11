import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server"; // Your API base URL


// ✅ Fetch All Banners
export const fetchCompanyInfo = createAsyncThunk("company-details/fetchCompanyDetails", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/company-details/public/company`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.companys;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch banners");
    }
});

// ✅ Add New Banner
export const addCompanyInfo = createAsyncThunk("company-details/add-company-details", async (formData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${server}/company-details/admin/add-company`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.company;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add banner");
    }
});

// ✅ Update Banner
export const updateCompanyInfo = createAsyncThunk("company-details/update-company-details", async ({ id, data }, { rejectWithValue }) => {
    try {
        if (!id) throw new Error("Company ID is required for update");

        const token = localStorage.getItem("token");
        const response = await axios.put(`${server}/company-details/admin/edit/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.company;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update banner");
    }
});

// ✅ Fetch Single Banner
export const fetchSingleCompanyInfo = createAsyncThunk("company-details/fetchSingleBanner", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/company-details/public/get-company-info/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.company;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch banner");
    }
});

// ✅ Delete Banner
export const deleteCompanyInfo = createAsyncThunk("company-details/deleteBanner", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        await axios.delete(`${server}/company-details/admin/delete/${id}`, {
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
const companySlice = createSlice({
    name: "company",
    initialState: {
        companys: [],
        company: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch All Banners
            .addCase(fetchCompanyInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.companys = action.payload;
            })
            .addCase(fetchCompanyInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Banner
            .addCase(addCompanyInfo.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCompanyInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.companys.push(action.payload);
            })
            .addCase(addCompanyInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Banner
            .addCase(updateCompanyInfo.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCompanyInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.company = action.payload;
                const index = state.companys.findIndex((b) => b._id === action.payload._id);
                if (index !== -1) {
                    state.companys[index] = action.payload;
                    state.companys = [...state.companys];
                }
            })
            .addCase(updateCompanyInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Single Banner
            .addCase(fetchSingleCompanyInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleCompanyInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.company = action.payload;
            })
            .addCase(fetchSingleCompanyInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Banner
            .addCase(deleteCompanyInfo.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCompanyInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.companys = state.companys.filter((b) => b._id !== action.payload);
            })
            .addCase(deleteCompanyInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default companySlice.reducer;
