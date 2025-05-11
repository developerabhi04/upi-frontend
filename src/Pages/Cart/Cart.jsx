import { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, fetchCartItems, updateCartQuantity } from "../../redux/slices/cartSlices";
import { toast } from "react-toastify";
import { Delete, RemoveShoppingCart } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { cartItems = [] } = useSelector((state) => state.shopCart);

    useEffect(() => {
        if (user) {
            dispatch(fetchCartItems(user._id));
        }
    }, [dispatch, user]);

    const handleQuantityChange = async (productId, sizes, seamSizes, colorName, newQuantity) => {
        if (newQuantity < 1) {
            toast.error("Quantity must be at least 1");
            return;
        }
        try {
            await dispatch(updateCartQuantity({
                userId: user._id,
                productId,
                quantity: newQuantity,
                sizes: sizes || null,
                seamSizes: seamSizes || null,
                colorName,
            })).unwrap();
            toast.success("Quantity updated!");
            dispatch(fetchCartItems(user._id));
        } catch (error) {
            toast.error(error.message || "Failed to update quantity");
        }
    };

    const handleRemoveItem = async (productId, sizes, seamSizes, colorName) => {
        if (!productId || !colorName) {
            console.warn("Missing required parameters for deletion");
            return;
        }
        try {
            await dispatch(deleteCartItem({ userId: user._id, productId, sizes, seamSizes, colorName })).unwrap();
            toast.success("Item removed from cart successfully!");
            dispatch(fetchCartItems(user._id));
        } catch (error) {
            toast.error(error || "Failed to delete item");
        }
    };

    const checkout = () => {
        navigate("/checkout-user", { state: { cartItems } });
    };

    const subtotal = cartItems.reduce((acc, item) => (item.price ? acc + item.price * item.quantity : acc), 0);
    const tax = subtotal * 0.07;
    const total = subtotal + tax;

    const navigateLink = (id) => {
        window.scrollTo(0, 0);
        navigate(`/product-details/${id}`);
    };



    const pageTitle = 'Your Shopping Cart | Your Store';
    const pageDescription = cartItems.length
        ? `You have ${cartItems.length} item(s) in your cart. Review your items, update quantities, or proceed to checkout.`
        : 'Your cart is empty. Browse products to add items to your cart.';
    const pageUrl = window.location.href;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin + '/' },
            { '@type': 'ListItem', position: 2, name: 'Cart', item: pageUrl },
        ],
    };

    return (
        <Fragment>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={pageUrl} />
                <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
            </Helmet>

            <section className="cart-page">
                {cartItems.length === 0 ? (
                    <div className="emptyCart">
                        <RemoveShoppingCart />
                        <Typography>No Product in Your Cart</Typography>
                        <Link to="/products">View Products</Link>
                    </div>
                ) : (
                    <div className="cart-container">
                        <h1 className="cart-heading">Your Shopping Cart ({cartItems.length} Items)</h1>
                        <div className="cart-content">
                            <div className="cart-items">
                                {cartItems.map((item, index) => (
                                    <div className="cart-item" key={`${item.productId}-${String(item.selectedSize) || 'noSize'}-${String(item.selectedSeamSize) || 'noSeamSize'}-${index}`}>
                                        <div className="item-image" onClick={() => navigateLink(item.productId)}>
                                            <img src={item.imageUrl} alt={item.name} />
                                        </div>
                                        <div className="item-info">
                                            <div className="item-details">
                                                <div className="item-controls">
                                                    <h3 className="item-title">{item.name}</h3>
                                                    <button className="remove-btn" onClick={() => handleRemoveItem(item.productId, item.selectedSize, item.selectedSeamSize, item.selectedColorName)}>
                                                        <Delete />
                                                    </button>
                                                </div>
                                                <div className="quantity-control">
                                                    <div className="quantity-buttons">
                                                        <button className="quantity-btn" onClick={() => handleQuantityChange(item.productId, item.selectedSize, item.selectedSeamSize, item.selectedColorName, item.quantity - 1)}>
                                                            −
                                                        </button>
                                                        <input type="number" value={item.quantity} readOnly />
                                                        <button className="quantity-btn" onClick={() => handleQuantityChange(item.productId, item.selectedSize, item.selectedSeamSize, item.selectedColorName, item.quantity + 1)}>
                                                            +
                                                        </button>
                                                    </div>
                                                    <p className="item-price">${item.price?.toFixed(2)}</p>
                                                </div>
                                                {item.selectedSize && <p className="item-variant">Size (Top): {item.selectedSize}</p>}
                                                {item.selectedSeamSize && <p className="item-variant">Seam Size (Bottom): {item.selectedSeamSize}</p>}
                                                <p className="item-variant">Color: {item.selectedColorName}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="order-summary">
                                <h2 className="summary-heading">Order Summary</h2>
                                <div className="summary-details">
                                    <div className="summary-row">
                                        <span>Subtotal ({cartItems.length} Items)</span>
                                        <span>${subtotal?.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Shipping</span>
                                        <span className="free-shipping">FREE</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Estimated Tax</span>
                                        <span>${tax?.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-total">
                                        <span>Total</span>
                                        <span>${total?.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button className="checkout-btn" onClick={checkout}>
                                    Proceed to Checkout
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                        <path d="M17 12h-4v4h-2v-4H7v-2h4V6h2v4h4z" />
                                    </svg>
                                </button>
                                <div className="secure-checkout">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                                    </svg>
                                    <span>Secure SSL Encryption</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </Fragment>
    );
};

export default Cart;
