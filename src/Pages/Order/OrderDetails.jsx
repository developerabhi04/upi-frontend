import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Stepper, Step, StepLabel, Grid, Stack, Skeleton } from "@mui/material";
import { deleteOrder, fetchOrderDetails } from "../../redux/slices/orderSlices";
import ReviewSection from "./Review";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orderDetails, loading, error } = useSelector((state) => state.order);

  // Map order status to Stepper steps
  // const [reviews, setReviews] = useState({});
  // const [submittedReviews, setSubmittedReviews] = useState({});

  const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStep = statusSteps.indexOf(orderDetails?.status || "Pending");

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      await dispatch(deleteOrder(id));
      navigate("/orders");
    }
  };

  if (loading)
    return (
      <>
        <Grid item md={5} sm={8} xs={12} lg={12} height={"100%"}>
          <Stack spacing={"1rem"}>
            {Array.from({ length: 18 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={"2rem"} />
            ))}
          </Stack>
        </Grid>
      </>
    );
  if (error) return <p className="error">Error: {error}</p>;
  if (!orderDetails) return <p>Order not found</p>;

  // const handleReviewChange = (productId, field, value) => {
  //     setReviews((prev) => ({
  //         ...prev,
  //         [productId]: { ...prev[productId], [field]: value },
  //     }));
  // };

  // const handleSubmitReview = async (productId) => {
  //     console.log("Submitting review for product:", productId);

  //     if (submittedReviews[productId]) {
  //         return toast.error("You have already reviewed this product!");
  //     }

  //     const { rating, comment } = reviews[productId] || {};
  //     if (!rating || !comment) {
  //         return toast.error("Please provide a rating and comment.");
  //     }

  //     try {
  //         const response = await dispatch(submitReview({ productId, rating, comment }));
  //         console.log("Review submission response:", response);
  //         toast.success("Review submitted!");

  //         // ✅ Mark product as reviewed
  //         setSubmittedReviews((prev) => ({ ...prev, [productId]: true }));

  //     } catch (error) {
  //         console.error("Error submitting review:", error);
  //         toast.error("Failed to submit review.");
  //     }
  // };

  const handleContactSupport = () => {
    navigate("/chat-support");
  };

  return (
    <section className="order-details-page">
      <div className="container">
        <div className="order-header">
          <h1>Order Details</h1>
          <p>Track and view detailed information about your order below.</p>
        </div>

        {/* Order Overview */}
        <div className="order-overview">
          <div className="overview-item">
            <h3>Order #{orderDetails._id.slice(-10).toUpperCase()}</h3>
            <p>
              Placed on:{" "}
              {new Date(orderDetails.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p>
              Status:{" "}
              <span className={`status ${orderDetails.status.toLowerCase()}`}>
                {orderDetails.status}
              </span>
            </p>
          </div>
          <div className="overview-item">
            <p>
              <strong>Payment Method:</strong>{" "}
              {orderDetails.paymentMethod === "COD"
                ? "Cash on Delivery"
                : "Online Payment"}
            </p>
            <p>
              <strong>Total Price:</strong> ${orderDetails.total.toFixed(2)}
            </p>
            <p>
              <strong>Coupon Discount:</strong> $
              {orderDetails.discountAmount.toFixed(2)}
            </p>
            <p>
              <strong>Tax:</strong> ${orderDetails.tax.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="order-tracking">
          <h2>Order Tracking</h2>
          <Stepper activeStep={currentStep} alternativeLabel>
            {statusSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        {/* Product Details */}
        <div className="product-details">
          <h2>Products</h2>
          <div className="product-list">
            {orderDetails.cartItems?.map((item) => (
              <div className="product-item" key={item._id}>
                <div className="product-image">
                  <img
                    src={item.imageUrl || "/default-product.png"}
                    alt={item.name}
                  />
                </div>
                <div className="product-info">
                  <h5>{item.name}</h5>
                  <p>Size: {item.selectedSize || item.selectedSeamSize}</p>
                  <p>Colour: {item.selectedColorName || "N/A"}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price.toFixed(2)}</p>

                  {/* Review Form - Only if Delivered */}
                  {orderDetails.status === "Delivered" && (
                    <ReviewSection
                      productId={item.productId}
                      reviewed={item.reviewed}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="payment-details">
          <h2>Payment Summary</h2>
          <div className="summary-item">
            <p>Subtotal:</p>
            <p>${orderDetails.subtotal.toFixed(2)}</p>
          </div>
          <div className="summary-item">
            <p>Discount:</p>
            <p>-${orderDetails.discountAmount.toFixed(2)}</p>
          </div>
          <div className="summary-item">
            <p>Tax:</p>
            <p>${orderDetails.tax.toFixed(2)}</p>
          </div>
          <div className="summary-item total">
            <p>
              <strong>Total:</strong>
            </p>
            <p>
              <strong>${orderDetails.total.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="shipping-details">
          <h2>Shipping Information</h2>
          <p>{orderDetails.shippingDetails.fullName}</p>
          <p>{orderDetails.shippingDetails.address}</p>
          <p>
            {orderDetails.shippingDetails.city},{" "}
            {orderDetails.shippingDetails.state} -{" "}
            {orderDetails.shippingDetails.zipCode}
          </p>
          <p>Phone: {orderDetails.shippingDetails.phoneNumber}</p>
          <p>Email: {orderDetails.shippingDetails.email}</p>
        </div>

        {/* Action Buttons */}
        {orderDetails.status !== "Delivered" && (
          <div className="action-buttons">
            <button
              className="cancel-order"
              onClick={handleCancelOrder}
              disabled={orderDetails.status === "Shipped"}
            >
              {orderDetails.status === "Shipped"
                ? "Cannot Cancel Shipped Order"
                : "Cancel Order"}
            </button>
            {/* <button className="contact-support" >Contact Support</button> */}
          </div>
        )}

        <div className="action-buttons">
          <div></div>
          <button className="contact-support" onClick={handleContactSupport}>
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
