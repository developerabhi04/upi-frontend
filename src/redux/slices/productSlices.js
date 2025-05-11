import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";



// ✅ Fetch Products with Filters
export const fetchProducts = createAsyncThunk("products/fetchProducts", async (filterParams = {}, { rejectWithValue }) => {
        try {
            const params = {};
            if (filterParams.keyword) {
                params.keyword = filterParams.keyword;
            }
            if (filterParams.category && filterParams.category.length > 0) {
                params.category = Array.isArray(filterParams.category)
                    ? filterParams.category.join(",")
                    : filterParams.category;
            }
            if (filterParams.size && filterParams.size.length > 0) {
                params.size = Array.isArray(filterParams.size)
                    ? filterParams.size.join(",")
                    : filterParams.size;
            }
            if (filterParams.seamSize && filterParams.seamSize.length > 0) {
                params.seamSize = Array.isArray(filterParams.seamSize)
                    ? filterParams.seamSize.join(",")
                    : filterParams.seamSize;
            }
            if (filterParams.color && filterParams.color.length > 0) {
                params.color = Array.isArray(filterParams.color)
                    ? filterParams.color.join(",")
                    : filterParams.color;
            }
            if (filterParams.priceRange) {
                params.price = JSON.stringify({
                    min: filterParams.priceRange[0],
                    max: filterParams.priceRange[1],
                });
            }
            if (filterParams.sort) {
                params.sort = filterParams.sort;
            }
            const response = await axios.get(`${server}/products/get-all-products`, { params });
            return response.data.products;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch products"
            );
        }
    }
);

// ✅ Live Search Thunk for OnChange Searches
export const fetchLiveSearchProducts = createAsyncThunk(
    "products/fetchLiveSearchProducts",
    async (keyword, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${server}/products/get-all-products`, {
                params: { keyword },
            });
            return response.data.products;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch live search products"
            );
        }
    }
);


// ✅ Fetch Similar Products for a given product ID
export const fetchSimilarProducts = createAsyncThunk(
    "products/fetchSimilarProducts",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${server}/products/similar/${id}`);
            return response.data.products;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch similar products"
            );
        }
    }
);


// ✅ Add New Product
export const addProduct = createAsyncThunk("products/addProduct", async (productData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        // ✅ Ensure `category` exists before sending to backend
        if (!productData.get("category")) {
            productData.append("category", "Uncategorized");
        }

        const response = await axios.post(`${server}/products/create-product`, productData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.product;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add product");
    }
});



// ✅ Update Product
export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.put(`${server}/products/update-product/${id}`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.product;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
});

// ✅ Fetch Single Product
export const fetchSingleProduct = createAsyncThunk("products/fetchSingleProduct",
    async (id, { rejectWithValue }) => {
        try {
            if (!id) throw new Error("Product ID is missing");

            const response = await axios.get(`${server}/products/get-single-product/${id}`);

            // console.log("🟢 API Response for Product:", response.data.product); // ✅ Debugging
            return response.data.product;
        } catch (error) {
            console.error("🔴 Error fetching product:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
        }
    }
);


// ✅ Delete Product
export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${server}/products/delete-product/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return id; // Return the deleted product ID to remove from Redux store
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
});



export const fetchNewArrivalProducts = createAsyncThunk("products/fetchNewArrivalProducts",
    async (color, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${server}/products/new-arrivals`, { params: { color: color }, });
            return response.data.products;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch new arrival products");
        }
    }
);

// ✅ Product Slice
const productSlices = createSlice({
    name: "products",
    initialState: {
        products: [], // List of products
        product: null,
        liveSearchResults: [],   // Live search suggestions
        searchLoading: false,
        loading: false, // Loading state
        error: null, // Error messages
        // selectedColor: null,
        similarProducts: [],
        filters: {
            keyword: "",
            category: [], // multi-select: array of category names or IDs
            size: [], // e.g., ["S", "M", "L"]
            seamSize: [], // e.g., ["28", "30", "32", "34"]
            color: [], // e.g., ["Black", "Blue"]
            priceRange: [0, 1000],
            sort: "",
        },
    },
    reducers: {
        setSelectedColor: (state, action) => {
            state.selectedColor = action.payload;
        },

        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder

            // get-Fetch Products
            // Fetch Products (Pending)
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Fetch Products (Fulfilled)
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload; // Update the product list
            })
            // Fetch Products (Rejected)
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set error message
            })

            .addCase(fetchSimilarProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.similarProducts = action.payload;
            })
            .addCase(fetchSimilarProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            .addCase(fetchLiveSearchProducts.pending, (state) => {
                state.searchLoading = true;
                state.error = null;
            })
            .addCase(fetchLiveSearchProducts.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.liveSearchResults = action.payload;
            })
            .addCase(fetchLiveSearchProducts.rejected, (state, action) => {
                state.searchLoading = false;
                state.error = action.payload;
            })


            // Add Product
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
                const index = state.products.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Fetch Single Product
            .addCase(fetchSingleProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleProduct.fulfilled, (state, action) => {
                // console.log("🟢 Updating Redux Store with Product:", action.payload); // ✅ Debug Redux
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchSingleProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter((p) => p._id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(fetchNewArrivalProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewArrivalProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchNewArrivalProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export const { setSelectedColor, setFilters } = productSlices.actions;


export default productSlices.reducer;
