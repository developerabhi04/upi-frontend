import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";



// ✅ Fetch All Categories with Subcategories
export const fetchCategories = createAsyncThunk("categories/fetchCategories", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/category/public/category/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.categories;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
    }
});

// ✅ Add New Category
export const addCategory = createAsyncThunk("categories/addCategory", async (formData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${server}/category/admin/category/add`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.category;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add category");
    }
});

// ✅ Update Category
export const updateCategory = createAsyncThunk("categories/updateCategory", async ({ id, formData }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${server}/category/admin/category/update/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.category;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update category");
    }
});

// ✅ Delete Category
export const deleteCategory = createAsyncThunk("categories/deleteCategory", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${server}/category/admin/category/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete category");
    }
});

// ✅ Add New Subcategory
export const addSubCategory = createAsyncThunk("categories/addSubCategory", async ({ name, categoryId }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${server}/category/admin/subcategory/add`, { name, categoryId }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data.subCategory;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add subcategory");
    }
});

// ✅ Update Subcategory
export const updateSubCategory = createAsyncThunk("categories/updateSubCategory", async ({ id, name, categoryId }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${server}/category/admin/subcategory/update/${id}`, { name, categoryId }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data.subCategory;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update subcategory");
    }
});

// ✅ Delete Subcategory
export const deleteSubCategory = createAsyncThunk("categories/deleteSubCategory", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${server}/category/admin/subcategory/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete subcategory");
    }
});

// ✅ Category Slice
const categorySlice = createSlice({
    name: "categories",
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ✅ Fetch Categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Add Category
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Update Category
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })

            // ✅ Delete Category
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter((cat) => cat._id !== action.payload);
            })

            // ✅ Add Subcategory
            .addCase(addSubCategory.fulfilled, (state, action) => {
                const category = state.categories.find((cat) => cat._id === action.payload.category);
                if (category) {
                    category.subcategories.push(action.payload);
                }
            })

            // ✅ Update Subcategory
            .addCase(updateSubCategory.fulfilled, (state, action) => {
                state.categories.forEach((category) => {
                    const subIndex = category.subcategories.findIndex((sub) => sub._id === action.payload._id);
                    if (subIndex !== -1) {
                        category.subcategories[subIndex] = action.payload;
                    }
                });
            })

            // ✅ Delete Subcategory
            .addCase(deleteSubCategory.fulfilled, (state, action) => {
                state.categories.forEach((category) => {
                    category.subcategories = category.subcategories.filter((sub) => sub._id !== action.payload);
                });
            });
    },
});

export default categorySlice.reducer;
