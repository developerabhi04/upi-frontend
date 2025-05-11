import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrderDetails, updateOrderStatus } from "../../../redux/slices/orderSlices";
import AdminSidebar from "../../../Components/Admin/AdminSidebar";
import Loadertwo from "../../../Components/Loader/Loadertwo";

const TransactionManagement = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { orderDetails, loading, error } = useSelector((state) => state.order);

  const [selectedImage, setSelectedImage] = useState(null); // State for modal image


  useEffect(() => {
    dispatch(fetchOrderDetails(id)); // ✅ Fetch order details when the component loads
  }, [dispatch, id]);



  const updateHandler = async () => {
    await dispatch(updateOrderStatus(id)); // ✅ Dispatch update action
    dispatch(fetchOrderDetails(id)); // ✅ Immediately fetch updated order details to avoid image disappearance
  };


  if (loading) return <><Loadertwo/></>;
  if (error) return <p className="error">{error}</p>;
  if (!orderDetails) return <p>No order details found.</p>;


  const {
    user,
    cartItems,
    shippingDetails,
    subtotal,
    tax,
    total,
    // discount,
    discountAmount,
    paymentMethod,
    status,
  } = orderDetails;

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="management-section">
        {/* Order Items Section */}
        <section className="order-items">
          <h2>Order Items</h2>

          {cartItems.map((item) => (
            <div key={item.productId?._id || item._id} className="order-item-card">
              <img
                src={item.imageUrl || "https://via.placeholder.com/100"}
                alt={item.name}
                className="product-image"
                onClick={() => setSelectedImage(item.productId?.photos?.[0]?.url)}
              />

              <div className="order-item-details">
                <p className="item-name">{item.name}</p>
                <span className="item-price">
                  ${item.price} x {item.quantity} = ${item.price * item.quantity}
                </span>
              </div>

              <div>
                <p>Quantity: {item.quantity}</p>
                <p>Size: {item.selectedSize || ""}</p>
                <p>SeamSize: {item.selectedSeamSize || "N/A"}</p>
                <p>Color: {item.selectedColorName}</p>
              </div>
            </div>
            
          ))}
        </section>

        {/* Order Details Section */}
        <article className="shipping-info-card">
          <h1>Order Info</h1>

          {/* User Details */}
          <div className="info-section">
            <h5>User Info</h5>
            <p>Name: {user?.name || "Guest User"}</p>
            <p>Email: {user?.email || "Guest User"}</p>
            <p>Phone: {shippingDetails?.phoneNumber || "Guest User"}</p>
            <p>Address:{shippingDetails?.address || "Guest User"}</p>
            <p>City:{shippingDetails?.city || "Guest User"}</p>
            <p>ZipCode:{shippingDetails?.zipCode || "Guest User"}</p>
            <p>state:{shippingDetails?.state || "Guest User"}</p>


          </div>

          {/* Order Amount */}
          <div className="info-section">
            <h5>Amount Info</h5>
            <p>Payment-Info: {paymentMethod}</p>
            <p>Subtotal: ${subtotal}</p>
            <p>Tax: ${tax}</p>
            <p>Discount: ${discountAmount}</p>
           
            <p className="total-amount">Total: ${total.toFixed(2)}</p>
          </div>

          {/* Order Status */}
          <div className="info-section">
            <h5>Status Info</h5>
            <p>
              Status:{" "}
              <span className={`status ${status.toLowerCase()}`}>
                {status}
              </span>
            </p>
          </div>

          {/* Hide Button if Status is Delivered */}
          {status !== "Delivered" && (
            <button className="update-button" onClick={updateHandler} disabled={loading}>
              {loading ? "Updating..." : "Process Status"}
            </button>
          )}
        </article>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Product Preview" />
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
