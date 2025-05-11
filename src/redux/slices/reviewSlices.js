import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";


// ✅ Submit Review
export const submitReview = createAsyncThunk("review/submitReview", async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Sending review to API:", { productId, rating, comment });
        const response = await axios.post(`${server}/reviews/post-review`, { productId, rating, comment },
            {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, withCredentials: true,
            });

        console.log("Received response:", response);
        return response.data.review;
    } catch (error) {
        console.error("Review submission failed:", error.response.data);
        return rejectWithValue(error.response.data.message || "Failed to submit review");
    }
});


// ✅ Fetch Reviews for a Product
export const fetchReviews = createAsyncThunk("review/fetchReviews", async (productId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/reviews/get-review`, {
            params: { productId },
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
        return response.data.reviews;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch reviews"
        );
    }
}
);


// ✅ Delete Review (Admin Only)
export const deleteReview = createAsyncThunk(
    "review/deleteReview",
    async ({ productId, reviewId }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(`${server}/reviews/${productId}/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return reviewId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete review");
        }
    }
);

const reviewSlice = createSlice({
    name: "review",
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ✅ Submit Review
            .addCase(submitReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitReview.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Review submitted. Re-fetching reviews...");
                state.reviews.push(action.payload);
                // state.reviews.push(action.payload); // Add new review
            })
            .addCase(submitReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Fetch Reviews
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Delete Review (Admin Only)
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = state.reviews.filter((review) => review._id !== action.payload);
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
