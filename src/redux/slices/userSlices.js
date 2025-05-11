import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";
import { signInWithGoogle } from "../../firebase";




// ✅ Google Sign-In Thunk
export const googleLogin = createAsyncThunk("user/googleLogin",async (_, { rejectWithValue }) => {
        try {
            const { token } = await signInWithGoogle();
            // console.log("🟢 Sending Token to Backend:", token);

            // Send the token to your backend
            const response = await axios.post(`${server}/user/google-login`, { token },
                { headers: { "Content-Type": "application/json" } }
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            return response.data;
        } catch (error) {
            console.error("❌ Google Login Error:", error);
            return rejectWithValue(error.response?.data?.message || "Google Login failed");
        }
    }
);






// ✅ Async thunk for user registration
export const registerUser = createAsyncThunk("user/register", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${server}/user/register`, userData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        // Store token & user data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || "Registration failed");
    }
}
);

// ✅ Async thunk for user login
export const loginUser = createAsyncThunk("user/login", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${server}/user/login`, userData, {
            headers: { "Content-Type": "application/json" },
        });

        // Store token & user data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || "Login failed");
    }
}
);


// ✅ Async thunk for fetching all users (Admin)
export const fetchUsers = createAsyncThunk("user/fetchUsers", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/user/get-all-users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.users; // Assuming API returns { users: [...] }
    } catch (error) {
        return rejectWithValue(error.response.data.message || "Failed to fetch users");
    }
});


// ✅ Delete User Action
export const deleteUser = createAsyncThunk("user/deleteUser", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${server}/user/delete-user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return { id, message: response.data.message };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
});


const userSlice = createSlice({
    name: "user",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null,
        users: [],
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            state.user = null;
            state.token = null;
            state.users = [];
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // ✅ Registration cases
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // ✅ Fetch users cases (Admin)
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload; // ✅ Store fetched users in state
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Handle Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user._id !== action.payload.id);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export const { logout } = userSlice.actions;
export default userSlice.reducer;
