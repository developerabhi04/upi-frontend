import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, deleteOrder } from "../../redux/slices/orderSlices";
import TableHOC from "../../Components/Admin/TableHOC";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material"; // ✅ Material UI Dialog
import { toast } from "react-toastify"; // ✅ Import Toastify




const Transaction = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // ✅ Open confirmation dialog
  const handleOpenDialog = (id) => {
    setSelectedOrderId(id);
    setOpenDialog(true);
  };

  // ✅ Close confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderId(null);
  };

  // ✅ Handle delete order
  const handleDelete = () => {
    if (selectedOrderId) {
      dispatch(deleteOrder(selectedOrderId))
        .unwrap()
        .then(() => {
          toast.success("Order deleted successfully!", { position: "top-center" }); // ✅ Show success message
        })
        .catch((err) => {
          toast.error("Failed to delete order. Please try again.", { position: "top-center" }); // ✅ Show error message
          console.error("Failed to delete order:", err);
        })
        .finally(() => {
          handleCloseDialog(); // ✅ Close the dialog after deletion
        });
    }
  };

  const columns = [
    { Header: "Order Id", accessor: "orderId" },
    { Header: "User", accessor: "user" },
    { Header: "Amount", accessor: "total" },
    { Header: "Discount", accessor: "discount" },
    { Header: "Quantity", accessor: "quantity" },
    { Header: "Status", accessor: "status" },
    { Header: "Action", accessor: "action" },
    { Header: "Delete", accessor: "delete" },
  ];

  const data = orders?.map((order) => ({
    orderId: order._id,
    user: order.user?.name || "Guest user",
    total: `$${order.total}`,
    discount: `$${order.discountAmount}`,
    quantity: order?.cartItems?.reduce((sum, item) => sum + item.quantity, 0),
    status: (
      <span className={order.status === "Processing" ? "red" : order.status === "Shipped" ? "green" : "purple"}>
        {order.status}
      </span>
    ),

    action: <Link to={`/admin/transaction/${order._id}`}>Manage</Link>,

    delete: (
      <button onClick={() => handleOpenDialog(order._id)} className="delete-btn">
        <AiOutlineDelete />
      </button>
      
    ),
  })) || [];

  const TableComponent = TableHOC(columns, data, "dashboard-product-box", "Transaction", true);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {loading && <p>Loading orders...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && data.length > 0 ? <TableComponent /> : <p>No orders found.</p>}

        {/* ✅ Material UI Delete Confirmation Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you really want to delete this order? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
            <Button onClick={handleDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

      </main>
    </div>
  );
};

export default Transaction;
