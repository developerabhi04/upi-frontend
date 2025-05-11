import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server"; // Your API base URL



// ✅ Validate Coupon
export const validateCoupon = createAsyncThunk("coupons/validateCoupon",async ({ code, totalAmount }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${server}/coupon/validate`, { code, totalAmount }, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to validate coupon");
        }
    }
);



// ✅ Fetch All Coupons
export const fetchCoupons = createAsyncThunk("coupons/fetchCoupons", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/coupon/public/all` , {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data.coupons;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch coupons");
    }
});

// ✅ Add New Coupon
export const addCoupon = createAsyncThunk("coupons/addCoupon", async (couponData, { rejectWithValue }) => {
   
    
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${server}/coupon/admin/create`, couponData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add coupon");
    }
});

// ✅ Update Coupon
export const updateCoupon = createAsyncThunk("coupons/updateCoupon", async ({ id, data }, { rejectWithValue }) => {
    // console.log("Updating Coupon Data:", data);
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${server}/coupon/admin/update/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("Updated Coupon Response:", response.data);
        return response.data.coupon;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update coupon");
    }
});

// ✅ Delete Coupon
export const deleteCoupon = createAsyncThunk("coupons/deleteCoupon", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${server}/coupon/admin/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return id; // Return deleted ID for removal from store
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete coupon");
    }
});

// ✅ Fetch Single Banner
export const fetchSingleCoupon = createAsyncThunk("coupon/fetchSingleCoupon", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/coupon/public/get-coupon/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data.coupon;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch banner");
    }
});


// ✅ Coupon Slice
const couponSlice = createSlice({
    name: "coupons",
    initialState: {
        coupons: [],
        coupon: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(validateCoupon.pending, (state) => {
                state.loading = true;
            })
            .addCase(validateCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupon = action.payload; // Store validated coupon details
            })
            .addCase(validateCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch All Coupons
            .addCase(fetchCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload;
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Coupon
            .addCase(addCoupon.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons.push(action.payload);
            })
            .addCase(addCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Coupon
            .addCase(updateCoupon.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCoupon.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.coupons.findIndex((c) => c._id === action.payload._id);
                if (index !== -1) {
                    state.coupons[index] = action.payload;
                }
                if (state.coupon && state.coupon._id === action.payload._id) {
                    state.coupon = action.payload; // Update single coupon state
                }
            })
            .addCase(updateCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // Fetch Single Banner
        .addCase(fetchSingleCoupon.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSingleCoupon.fulfilled, (state, action) => {
            state.loading = false;
            state.coupon = action.payload;
        })
        .addCase(fetchSingleCoupon.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })


        // Delete Coupon
        .addCase(deleteCoupon.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteCoupon.fulfilled, (state, action) => {
            state.loading = false;
            state.coupons = state.coupons.filter((c) => c._id !== action.payload);
        })
        .addCase(deleteCoupon.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
},
});

export default couponSlice.reducer;