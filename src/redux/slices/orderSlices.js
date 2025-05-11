import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

//Create an Asynchronous Redux Thunk
export const createNewOrder = createAsyncThunk(
    "order/createNewOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${server}/order/new-order`, orderData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create order");
        }
    }
);



// ✅ Fetch all orders
export const fetchOrders = createAsyncThunk("order/fetchOrders", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${server}/order/all-orders`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("API Response Orders:", response.data.orders); // Debugging
        return response.data.orders;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchLatestOrders = createAsyncThunk("order/fetchLatestOrders", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${server}/order/all-latest-orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data.orders; // ✅ Orders sorted by latest date from backend
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});


// ✅ Fetch single order details
export const fetchOrderDetails = createAsyncThunk("order/fetchOrderDetails", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${server}/order/get-single-order/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data.order;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch order details");
    }
});



// ✅ Update order status
export const updateOrderStatus = createAsyncThunk("order/updateOrderStatus", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${server}/order/order-status-process/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.order;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
});

// ✅ Delete an order
export const deleteOrder = createAsyncThunk("order/deleteOrder", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${server}/order/delete-order/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
            return id; // Return deleted order ID
        } else {
            throw new Error("Failed to delete order");
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        latestOrders: [],
        orderDetails: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetNewOrderSuccess: (state) => {
            state.newOrderSuccess = false;
            state.orderPlaced = false;
        },
    },
    extraReducers: (builder) => {
        builder


            .addCase(createNewOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.newOrderSuccess = true;
                state.newOrder = action.payload;
            })
            .addCase(createNewOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Fetch all orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;

            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(fetchLatestOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLatestOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.latestOrders = action.payload; // ✅ Store latest orders
            })
            .addCase(fetchLatestOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Fetch single order details
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;

            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Update Order Status
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.map((order) =>
                    order._id === action.payload._id ? action.payload : order
                );
                if (state.orderDetails && state.orderDetails._id === action.payload._id) {
                    state.orderDetails.status = action.payload.status; // Update status in details view
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Delete an order
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter((order) => order._id !== action.payload);
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const { resetNewOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;
