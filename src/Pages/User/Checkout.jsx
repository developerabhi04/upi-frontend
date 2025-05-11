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

import { fetchPaymentConfigs } from "../../redux/slices/paymentSlices.js";
import { validateCoupon } from "../../redux/slices/couponSlices";
import { createNewOrder } from "../../redux/slices/orderSlices";
import { clearOrderedProducts } from "../../redux/slices/cartSlices";

const buildUpiDeepLink = ({ payeeVpa, payeeName, amount, txnId }) =>
  `upi://pay?pa=${encodeURIComponent(payeeVpa)}` +
  `&pn=${encodeURIComponent(payeeName)}` +
  `&am=${encodeURIComponent(amount)}` +
  `&cu=INR&tr=${encodeURIComponent(txnId)}`;

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Cart & User
  const cartItems = location.state?.cartItems || [];
  const { user } = useSelector((state) => state.user);

  // UPI configs
  const { configs, loading: configLoading } = useSelector(
    (state) => state.paymentConfig
  );

  // Shipping form state
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
  const { loading: couponLoading } = useSelector((s) => s.coupons);
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
    // Ensure shipping details
    const missing = Object.entries(shipping)
      .filter(([, v]) => !v.trim())
      .map(([k]) => k);
    if (missing.length) return toast.error("Please fill all fields");

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

  // Kick off UPI payment flow
  const handlePay = () => {
    const cfg = configs.find((c) => c.method === method);
    if (!cfg) {
      toast.error("Payment configuration not found");
      return;
    }
    const txnId = `AT-${Date.now()}`;

    // Step 1: confirm start
    if (!window.confirm(`Proceed to payment via ${method}?`)) return;

    // Step 2: redirect into UPI app
    const uri = buildUpiDeepLink({
      payeeVpa: cfg.payeeVpa,
      payeeName: cfg.payeeName,
      amount: total,
      txnId,
    });
    window.location.href = uri;

    // Step 3: after user returns, confirm completion
    setTimeout(() => {
      if (window.confirm(`Did you complete payment via ${method}?`)) {
        placeOrder({ via: method, txnId });
      } else {
        toast.error("Payment incomplete. Please try again.");
      }
    }, 3000);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: { xs: 2, md: 10 }, mb: { xs: 4, md: 10 } }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
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
                <FormLabel component="legend">Select UPI Method</FormLabel>
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
                        <Box
                          component="img"
                          src={phonePeLogo}
                          alt="PhonePe"
                          width={24}
                          mr={1}
                        />
                        PhonePe
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="UPI-Paytm"
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center">
                        <Box
                          component="img"
                          src={paytmLogo}
                          alt="Paytm"
                          width={32}
                          mr={1}
                        />
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  color="green"
                >
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
                  disabled={couponLoading}
                  fullWidth
                />
                <Button
                  variant="outlined"
                  onClick={applyCoupon}
                  disabled={couponLoading}
                >
                  {couponLoading ? "Applying..." : "Apply"}
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
