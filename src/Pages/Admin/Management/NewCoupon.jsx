import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../Components/Admin/AdminSidebar";
import { toast } from "react-toastify";
import { addCoupon, fetchCoupons } from "../../../redux/slices/couponSlices";
import { Container, TextField, Button, Typography, Paper, CircularProgress, FormControlLabel, Switch } from "@mui/material";

const NewCoupon = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state
    const { loading, error } = useSelector((state) => state.coupons);

    // Form state
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [expiryDate, setExpiry] = useState("");
    const [isActive, setIsActive] = useState(true); // Default to inactive


    useEffect(() => {
        dispatch(fetchCoupons());
    }, [dispatch]);

    // Form submission
    const submitHandler = (e) => {
        e.preventDefault();

        console.log("New Coupon Data:", { code, discount, expiryDate, isActive });

        if (!code || !discount || !expiryDate) {
            toast.error("Please fill all fields");
            return;
        }

        const newCoupon = { code, discount, expiryDate,isActive };

        dispatch(addCoupon(newCoupon)).then((res) => {
            if (!res.error) {
                toast.success("Coupon added successfully!");
                setTimeout(() => navigate("/admin/coupons"), 1500);
            } else {
                toast.error(res.error || "Failed to add coupon");
            }
        });
    };

    return (
        <div className="admin-container">
            <AdminSidebar />

            <main className="banner-sections" style={{ background: "white" }}>
                <Container maxWidth="sm" sx={{ mt: 4 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>Create New Coupon</Typography>
                        <form onSubmit={submitHandler}>
                            <TextField
                                fullWidth
                                label="Coupon Code"
                                variant="outlined"
                                margin="normal"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Discount (%)"
                                type="number"
                                variant="outlined"
                                margin="normal"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Expiry Date"
                                type="date"
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                value={expiryDate}
                                onChange={(e) => setExpiry(e.target.value)}
                                required
                                inputProps={{ min: new Date().toISOString().split("T")[0] }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label={isActive ? "Active (Yes)" : "Inactive (No)"}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : "Create Coupon"}
                            </Button>
                        </form>
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    </Paper>
                </Container>

            </main>
        </div>
    );
};

export default NewCoupon;