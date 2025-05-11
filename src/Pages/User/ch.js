import { useState } from "react";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import { validateCoupon } from "../../redux/slices/couponSlices";
import { createNewOrder } from "../../redux/slices/orderSlices";
import { clearOrderedProducts } from "../../redux/slices/cartSlices";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Helmet } from "react-helmet-async";

const Checkout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = location.state?.cartItems || [];
  const { user } = useSelector((state) => state.user);
  const { loading: couponLoading } = useSelector((state) => state.coupons);

  const [errors, setErrors] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.07; // 7% example
  const totalBeforeDiscount = subtotal + tax;
  const [localTotal, setLocalTotal] = useState(totalBeforeDiscount);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
  });

  // Accordion
  const [activeSection, setActiveSection] = useState(null);
  const toggleSection = (section) =>
    setActiveSection((prev) => (prev === section ? null : section));

  const faqData = [
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days if the product is unused and in its original condition.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order is shipped, you'll receive an email with the tracking details.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, shipping charges and delivery times vary by destination.",
    },
  ];

  // Live validation
  const handleChange = (e) => {
    const { id, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [id]: value }));

    let msg = "";
    switch (id) {
      case "fullName":
        msg = value.trim().length < 3 ? "At least 3 characters." : "";
        break;
      case "address":
        msg = value.trim().length < 5 ? "At least 5 characters." : "";
        break;
      case "city":
      case "state":
        msg = value.trim().length < 2 ? "Too short." : "";
        break;
      case "zipCode":
        msg = !/^\d{5}(-\d{4})?$/.test(value) ? "Invalid ZIP." : "";
        break;
      case "phoneNumber":
        msg = !/^\d{10}$/.test(value) ? "Must be 10 digits." : "";
        break;
      case "email":
        msg = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email." : "";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [id]: msg }));
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    try {
      const result = await dispatch(
        validateCoupon({
          code: couponCode.trim(),
          totalAmount: localTotal,
        })
      ).unwrap();
      setDiscountedTotal(result.discountedTotal);
      setDiscountAmount(result.discountAmount);
      toast.success(result.message);
    } catch (err) {
      toast.error(err || "Failed to apply coupon");
    }
  };

  // Create order & notify admin
  const handleOrderCreation = async (paymentResult) => {
    // check all fields
    const missing = Object.entries(shippingDetails).find(
      ([, v]) => !v.trim()
    );
    if (missing) {
      toast.error("Please fill in all shipping details!");
      return;
    }

    const finalTotal = discountedTotal ?? totalBeforeDiscount;
    const orderData = {
      user: user._id,
      cartItems,
      shippingDetails,
      subtotal,
      tax,
      total: finalTotal,
      discountAmount: totalBeforeDiscount - finalTotal,
      paymentResult,
      paymentMethod: "PayPal",
    };

    try {
      // 1) create order in back-end
      const orderResponse = await dispatch(createNewOrder(orderData)).unwrap();

      // 2) send email to admin
      const serviceID = "service_g1vypdw";          // ← your EmailJS service ID
      const templateID = "template_order_notification"; // ← your EmailJS template ID
      const publicKey = "iJ8C5xen08mRnFQsz";       // ← your EmailJS public key

      const productsList = cartItems
        .map(
          (it) =>
            `${it.name} — Qty: ${it.quantity}, Price: $${it.price.toFixed(2)}`
        )
        .join("\n");

      const shippingAddr = `${shippingDetails.fullName}
${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} – ${shippingDetails.zipCode}
Phone: ${shippingDetails.phoneNumber}
Email: ${shippingDetails.email}`;

      const templateParams = {
        order_id: orderResponse._id,
        products: productsList,
        shipping_address: shippingAddr,
        total: finalTotal.toFixed(2),
      };

      await emailjs.send(serviceID, templateID, templateParams, publicKey);

      // 3) clear cart & redirect
      await dispatch(
        clearOrderedProducts({
          userId: user._id,
          orderedItems: cartItems.map((i) => i.productId),
        })
      );
      toast.success("Order placed! Redirecting...");
      setTimeout(() => {
        window.scrollTo(0, 0);
        navigate("/orders-success", {
          state: { orderId: orderResponse._id },
        });
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to place order");
    }
  };

  // PayPal button logic
  return (
    <>
      <Helmet>
        <title>Checkout | Your Store</title>
        <meta
          name="description"
          content="Complete your purchase by providing shipping details and payment information."
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <section className="checkout-pages">
        <h1>Checkout</h1>
        <div className="container">
          <div className="checkout-content">
            {/* Shipping Accordion */}
            <div className="accordion-section">
              <button
                className="accordion-header"
                onClick={() => toggleSection("shipping")}
              >
                <span>Shipping Details</span>
                {activeSection === "shipping" ? (
                  <ArrowDropUp />
                ) : (
                  <ArrowDropDown />
                )}
              </button>
              {activeSection === "shipping" && (
                <div className="accordion-content">
                  <Grid container spacing={2}>
                    {[
                      "fullName",
                      "address",
                      "city",
                      "state",
                      "zipCode",
                      "phoneNumber",
                      "email",
                    ].map((field) => (
                      <Grid
                        key={field}
                        item
                        xs={field === "email" ? 12 : 6}
                      >
                        <TextField
                          fullWidth
                          id={field}
                          label={
                            {
                              fullName: "Full Name",
                              zipCode: "ZIP Code",
                              phoneNumber: "Phone Number",
                            }[field] || field.charAt(0).toUpperCase() + field.slice(1)
                          }
                          variant="outlined"
                          onChange={handleChange}
                          error={Boolean(errors[field])}
                          helperText={errors[field]}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              )}
            </div>

            {/* FAQ Accordion */}
            <div className="accordion-section">
              <button
                className="accordion-header"
                onClick={() => toggleSection("faq")}
              >
                <span>Frequently Asked Questions</span>
                {activeSection === "faq" ? (
                  <ArrowDropUp />
                ) : (
                  <ArrowDropDown />
                )}
              </button>
              {activeSection === "faq" && (
                <div className="accordion-content faq-content">
                  {faqData.map((faq, i) => (
                    <div key={i} className="faq-item">
                      <h4>{faq.question}</h4>
                      <p>{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary + PayPal */}
          <div className="checkout-orders">
            <div className="order-summarys">
              <h2>Order Summary</h2>
              <div className="summary-details">
                <div className="cart-products">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="cart-product">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="cart-product-image"
                      />
                      <div className="cart-product-details">
                        <div className="cart-product-name-price">
                          <h4>{item.name}</h4>
                          <h4 className="price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </h4>
                        </div>
                        <p>
                          Qty: <span>{item.quantity}</span>
                        </p>
                        {item.selectedSize && (
                          <p>Size: {item.selectedSize}</p>
                        )}
                        {item.selectedSeamSize && (
                          <p>Seam Size: {item.selectedSeamSize}</p>
                        )}
                        <p>Color: {item.selectedColorName}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-item">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                {discountedTotal !== null && (
                  <div className="total">
                    <span>Discount:</span>
                    <span>
                      -$
                      {(
                        totalBeforeDiscount - discountedTotal
                      ).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="total">
                  <span>Total:</span>
                  <span>
                    $
                    {(
                      discountedTotal ?? totalBeforeDiscount
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Coupon */}
              <div className="coupon-section">
                <h3>Have a coupon?</h3>
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponLoading}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? "Applying..." : "Apply"}
                  </button>
                </div>
              </div>

              {/* PayPal Buttons */}
              <div className="checkout-btn-container">
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) =>
                    actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: (
                              discountedTotal ?? totalBeforeDiscount
                            ).toFixed(2),
                          },
                        },
                      ],
                    })
                  }
                  onApprove={(data, actions) =>
                    actions.order.capture().then((details) => {
                      handleOrderCreation(details);
                    })
                  }
                  onError={() =>
                    toast.error("PayPal transaction failed!")
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
