import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import phonePeLogo from "../../assets/payment/phonepe-logo-icon.webp";
import paytmLogo from "../../assets/payment/unnamed.png";


import { validateCoupon } from "../../redux/slices/couponSlices.js";
import { createNewOrder } from "../../redux/slices/orderSlices.js";
import { clearOrderedProducts } from "../../redux/slices/cartSlices.js";
import { fetchPaymentConfigs } from "../../redux/slices/paymentSlices.js";

const buildDeepLink = ({ method, payeeVpa, payeeName, amount, txnId }) => {
  let baseScheme = "upi://pay";

  if (method === "UPI-PhonePe") {
    baseScheme = "phonepe://upi/pay";
  } else if (method === "UPI-Paytm") {
    baseScheme = "paytmmp://pay";
  }

  return (
    `${baseScheme}` +
    `?pa=${encodeURIComponent(payeeVpa)}` +
    `&pn=${encodeURIComponent(payeeName)}` +
    `&am=${encodeURIComponent(amount)}` +
    `&cu=INR` +
    `&tr=${encodeURIComponent(txnId)}`
  );
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  // Cart & User
  const cartItems = state?.cartItems || [];
  const { user } = useSelector((s) => s.user);

  // UPI configs
  const { configs, loading: configLoading,error } = useSelector(
    (s) => s.paymentConfig
  );
  console.log("Loaded UPI configs:", configs, "error:", error);

  // Shipping form
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Payment method
  const [method, setMethod] = useState("");

  // Totals
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * 0.07;
  const total = (discountedTotal ?? subtotal + tax).toFixed(2);

  useEffect(() => {
    dispatch(fetchPaymentConfigs());
  }, [dispatch]);

  const handleField = (e) => {
    const { id, value } = e.target;
    setShipping((s) => ({ ...s, [id]: value }));
    setErrors((err) => ({ ...err, [id]: value.trim() ? "" : "Required" }));
  };

  const applyCoupon = async () => {
    try {
      const result = await dispatch(
        validateCoupon({ code: couponCode, totalAmount: +total })
      ).unwrap();
      setDiscountedTotal(result.discountedTotal);
      setDiscountAmount(result.discountAmount);
      toast.success(result.message);
    } catch (err) {
      toast.error(err);
    }
  };

  const placeOrder = async (paymentResult) => {
    const missing = Object.entries(shipping)
      .filter(([, v]) => !v.trim())
      .map(([k]) => k);
    if (missing.length) {
      return toast.error("Please fill all shipping fields");
    }

    const orderData = {
      user: user._id,
      cartItems,
      shippingDetails: shipping,
      subtotal,
      tax,
      total: +total,
      discount: discountedTotal,
      discountAmount,
      paymentResult,
      paymentMethod: paymentResult.via,
    };

    try {
      const resp = await dispatch(createNewOrder(orderData)).unwrap();
      await dispatch(
        clearOrderedProducts({
          userId: user._id,
          orderedItems: cartItems.map((i) => i.productId),
        })
      );
      toast.success("Order placed successfully!");
      navigate("/orders-success", { state: { orderId: resp._id } });
    } catch (err) {
      toast.error(err);
    }
  };

  const handlePay = () => {
    const cfg = configs.find((c) => c.method === method);
    if (!cfg) {
      return toast.error("Payment configuration not found");
    }
    const txnId = `AT-${Date.now()}`;

    if (!window.confirm(`Proceed to payment via ${method}?`)) return;

    // Redirect into the UPI app
    const uri = buildDeepLink({
      method,
      payeeVpa: cfg.payeeVpa,
      payeeName: cfg.payeeName,
      amount: total,
      txnId,
    });
    window.location.href = uri;

    // Ask user to confirm completion
    setTimeout(() => {
      if (window.confirm(`Did you complete payment via ${method}?`)) {
        placeOrder({ via: method, txnId });
      } else {
        toast.error("Payment incomplete. Please try again.");
      }
    }, 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 10 }, mb: { xs: 4, md: 10 } }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Grid container spacing={4}>
        {/* Shipping & Payment Method */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
            <Stack spacing={2}>
              {Object.keys(shipping).map((field) => (
                <TextField
                  key={field}
                  id={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={shipping[field]}
                  onChange={handleField}
                  error={!!errors[field]}
                  helperText={errors[field]}
                  fullWidth
                />
              ))}

              <FormControl component="fieldset">
                <FormLabel>Select UPI Method</FormLabel>
                <RadioGroup
                  row
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="UPI-PhonePe"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center">
                        <Box component="img" src={phonePeLogo} alt="PhonePe" width={24} mr={1} />
                        PhonePe
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="UPI-Paytm"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center">
                        <Box component="img" src={paytmLogo} alt="Paytm" width={32} mr={1} />
                        Paytm
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          </Paper>
        </Grid>

        {/* Order Summary & Actions */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
            <Stack spacing={2}>
              <Typography variant="h5">Order Summary</Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography>Subtotal:</Typography>
                <Typography>₹{subtotal.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Tax (7%):</Typography>
                <Typography>₹{tax.toFixed(2)}</Typography>
              </Box>
              {discountAmount > 0 && (
                <Box display="flex" justifyContent="space-between" color="green">
                  <Typography>Discount:</Typography>
                  <Typography>-₹{discountAmount.toFixed(2)}</Typography>
                </Box>
              )}
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">₹{total}</Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <TextField
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  fullWidth
                />
                <Button variant="outlined" onClick={applyCoupon}>
                  Apply
                </Button>
              </Stack>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handlePay}
                disabled={!method || configLoading}
              >
                Pay ₹{total}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
