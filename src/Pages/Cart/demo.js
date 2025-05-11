import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { deleteCartItem, fetchCartItems, updateCartQuantity } from "../../redux/slices/cartSlices";
import { toast } from "react-toastify";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { cartItems = [], isLoading, error } = useSelector((state) => state.shopCart);

    useEffect(() => {
        if (user) {
            dispatch(fetchCartItems(user._id))
                .then((response) => {
                    console.log("Cart Items Fetched Successfully:", response);
                })
                .catch((error) => {
                    console.error("Error fetching cart items:", error);
                });
        }
    }, [dispatch, user]);

    // Handle quantity change for a cart item
    const handleQuantityChange = (productId, sizes, seamSizes, newQuantity) => {
        if (newQuantity < 1) {
            toast.error("Quantity must be at least 1");
            return;
        }

        dispatch(updateCartQuantity({ userId: user._id, productId, quantity: newQuantity, sizes, seamSizes }));
        toast.success("Cart item quantity updated successfully!");
    };

    // Handle removing an item from the cart
    const handleRemoveItem = (productId, sizes, seamSizes) => {
        dispatch(deleteCartItem({ userId: user._id, productId, sizes, seamSizes }));
        toast.success("Item removed from cart successfully!");
    };

    const checkout = () => {
        navigate("/checkout-user");
    };

    // Calculate subtotal, tax, and total
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.07; // Assuming a tax rate of 7%
    const total = subtotal + tax;

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    console.log("Cart Items in Component:", cartItems);
    return (
        <section className="cart-page">
            <div className="cart-container">
                <h1 className="cart-heading">Your Shopping Cart ({cartItems.length} Items)</h1>

                <div className="cart-content">
                    {/* Cart Items Section */}
                    <div className="cart-items">

                        {cartItems.map((item) => (
                            <div className="cart-item" key={`${item.productId}-${item.selectedSize}-${item.selectedSeamSize}`}>
                                <div className="item-image">
                                    <img src={item.imageUrl} alt={item.name} />
                                </div>
                                <div className="item-info">
                                    <div className="item-details">
                                        <h3 className="item-title">{item.name}</h3>
                                        <p className="item-variant">Size: {item.selectedSize}</p>
                                        <p className="item-variant">Color: {item.selectedSeamSize}</p>
                                        <p className="item-price">${item.price.toFixed(2)}</p>
                                    </div>

                                    <div className="item-controls">
                                        <div className="quantity-control">
                                            <button className="quantity-btn"
                                                onClick={() =>handleQuantityChange(item.productId, item.selectedSize, item.selectedSeamSize, item.quantity - 1)}>
                                                −
                                            </button>

                                            <input type="number" value={item.quantity} readOnly />
                                            <button className="quantity-btn" onClick={() => handleQuantityChange(item.productId, item.selectedSize, item.selectedSeamSize, item.quantity + 1)}>+</button>
                                        </div>

                                        <button className="remove-btn" onClick={() => handleRemoveItem(item.productId, item.selectedSize, item.selectedSeamSize)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                                <path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v7H9v-7zm4 0h2v7h-2v-7zM9 4v2h6V4H9z" />
                                            </svg>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>

                        ))}



                        {/* Order Summary Section */}
                        <div className="order-summary">
                            <h2 className="summary-heading">Order Summary</h2>
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Subtotal ({cartItems.length} Items)</span>
                                    <span>$({subtotal.toFixed(2)})</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span className="free-shipping">FREE</span>
                                </div>
                                <div className="summary-row">
                                    <span>Estimated Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
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
            </div>
        </section>
    )
}

export default Cart;    
