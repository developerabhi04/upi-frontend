import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../Components/Admin/AdminSidebar";
import { toast } from "react-toastify";
import { Container, TextField, Button, Typography, Paper, CircularProgress, FormControlLabel, Switch } from "@mui/material";
import { fetchSingleCoupon, updateCoupon } from "../../../redux/slices/couponSlices";

const CouponManagement = () => {
    const { id: couponId } = useParams(); // ✅ Get Coupon ID from URL
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state
    const { coupon, loading, error } = useSelector((state) => state.coupons);

    // Form state
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [expiryDate, setExpiry] = useState("");
    const [isActive, setIsActive] = useState(false); // ✅ Default to false

    useEffect(() => {
        if (couponId) {
            dispatch(fetchSingleCoupon(couponId)); // ✅ Fetch coupon with correct ID
        }
    }, [dispatch, couponId]);

    useEffect(() => {
        if (coupon) {
            setCode(coupon.code || "");
            setDiscount(coupon.discount || "");
            setExpiry(coupon.expiryDate ? coupon.expiryDate.split("T")[0] : "");
            setIsActive(coupon?.isActive ?? false); // ✅ Handle undefined state
        }
    }, [coupon]);

    // Form submission
    const submitHandler = (e) => {
        e.preventDefault();

        console.log("Updated Coupon Data:", { code, discount, expiryDate, isActive }); // Debugging

        if (!code || !discount || !expiryDate) {
            toast.error("Please fill all fields");
            return;
        }

        dispatch(updateCoupon({ id: couponId, data: { code, discount, expiryDate, isActive } }))
            .then((res) => {
                if (!res.error) {
                    toast.success("Coupon updated successfully!");
                    setTimeout(() => navigate("/admin/coupons"), 1500);
                } else {
                    toast.error(res.error || "Failed to update coupon");
                }
            });
    };

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="banner-sections" style={{ background: "white" }}>
                <Container maxWidth="sm" sx={{ mt: 4 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>Edit Coupon</Typography>
                        {loading ? (
                            <CircularProgress />
                        ) : (
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
                                    {loading ? <CircularProgress size={24} /> : "Update Coupon"}
                                </Button>
                            </form>
                        )}
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    </Paper>
                </Container>
            </main>
        </div>
    );
};

export default CouponManagement;
