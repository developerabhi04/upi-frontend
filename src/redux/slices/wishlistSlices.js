// redux/slices/WishlistSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";




const initialState = {
    wishlistItems: [],
    isLoading: false,
    error: null,
};


// Async action to move an item from wishlist to cart
export const moveToCart = createAsyncThunk("wishlist/moveToCart",
    async ({ userId, productId, sizes, seamSizes, colorName }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const requestData = {
                userId,
                productId,
                sizes: sizes || null,
                seamSizes: seamSizes || null,
                colorName: colorName || "DefaultColor"  // 👈 Ensure colorName is never undefined
            };

            // console.log("🛒 Moving item to cart:", requestData);

            const response = await axios.post(`${server}/wishlist/move-to-cart`, requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to move item to cart.");
        }
    }
);




// Add to Wishlist
export const addToWishlist = createAsyncThunk("wishlist/addToWishlist",
    async ({ userId, productId, sizes, seamSizes, colorName }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(`${server}/wishlist/add`, { userId, productId, sizes, seamSizes, colorName }, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            if (response.data.success) {
                return response.data.wishlist.items;
            } else {
                return rejectWithValue(response.data.message || "Failed to add item to wishlist");
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add item to wishlist");
        }
    }
);

// Remove from Wishlist
export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist",
    async ({ userId, productId, sizes, seamSizes, colorName }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            // Build query parameters using URLSearchParams for consistency
            const params = new URLSearchParams();
            if (sizes !== null && sizes !== undefined) params.append("sizes", sizes);
            if (seamSizes !== null && seamSizes !== undefined) params.append("seamSizes", seamSizes);
            params.append("colorName", colorName);
            const url = `${server}/wishlist/delete/${userId}/${productId}?${params.toString()}`;
            const response = await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (response.status === 200) {
                return { productId, sizes, seamSizes, colorName };
            } else {
                return rejectWithValue(`Failed to delete item. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("removeFromWishlist Error:", error);
            return rejectWithValue(error.response?.data?.message || "Failed to remove item from wishlist");
        }
    }
);



// Get Wishlist Items
export const fetchWishlistItems = createAsyncThunk("wishlist/fetchWishlistItems",
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${server}/wishlist/${userId}`, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message || "Failed to fetch wishlist items");
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist items");
        }
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wishlistItems = action.payload;
                state.error = null;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(removeFromWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                const { productId, sizes, seamSizes, colorName } = action.payload;
                state.wishlistItems = state.wishlistItems.filter((item) => {
                    const sizeMatch = sizes ? String(item.selectedSize) === String(sizes) : !item.selectedSize;
                    const seamSizeMatch = seamSizes ? String(item.selectedSeamSize) === String(seamSizes) : !item.selectedSeamSize;
                    return !(
                        item.productId === productId &&
                        sizeMatch &&
                        seamSizeMatch &&
                        item.selectedColorName === colorName
                    );
                });
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(fetchWishlistItems.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWishlistItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wishlistItems = action.payload;
                state.error = null;
            })
            .addCase(fetchWishlistItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(moveToCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(moveToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                const { productId, sizes, seamSizes, colorName } = action.meta.arg;
                state.wishlistItems = state.wishlistItems.filter((item) => {
                    const sizeMatch = sizes ? String(item.selectedSize) === String(sizes) : !item.selectedSize;
                    const seamSizeMatch = seamSizes ? String(item.selectedSeamSize) === String(seamSizes) : !item.selectedSeamSize;
                    return !(
                        item.productId === productId &&
                        sizeMatch &&
                        seamSizeMatch &&
                        item.selectedColorName === colorName
                    );
                });
            })
            .addCase(moveToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export default wishlistSlice.reducer;
