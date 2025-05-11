import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";


// **FETCH DASHBOARD STATS**
export const fetchDashboardStats = createAsyncThunk("dashboard/fetchStats",async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${server}/adminstats/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return data.stats;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to load dashboard stats");
        }
    }
);




// **FETCH PIE CHART DATA**
export const fetchPieCharts = createAsyncThunk("dashboard/fetchPieCharts",async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${server}/adminstats/pie`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return data.charts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to load pie charts");
        }
    }
);



// **FETCH BAR CHART DATA**
export const fetchBarCharts = createAsyncThunk("dashboard/fetchBarCharts",async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${server}/adminstats/bar`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return data.charts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to load bar charts");
        }
    }
);




// **FETCH LINE CHART DATA**
export const fetchLineCharts = createAsyncThunk("dashboard/fetchLineCharts",async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${server}/adminstats/line`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return data.charts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to load line charts");
        }
    }
);




// **DASHBOARD SLICE**
const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        stats: null,
        pieCharts: null,
        barCharts: null,
        lineCharts: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Dashboard Stats
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Pie Charts
            .addCase(fetchPieCharts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPieCharts.fulfilled, (state, action) => {
                state.loading = false;
                state.pieCharts = action.payload;
            })
            .addCase(fetchPieCharts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Bar Charts
            .addCase(fetchBarCharts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBarCharts.fulfilled, (state, action) => {
                state.loading = false;
                state.barCharts = action.payload;
            })
            .addCase(fetchBarCharts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Line Charts
            .addCase(fetchLineCharts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLineCharts.fulfilled, (state, action) => {
                state.loading = false;
                state.lineCharts = action.payload;
            })
            .addCase(fetchLineCharts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
