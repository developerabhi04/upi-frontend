import { useCallback, useEffect } from "react";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import TableHOC from "../../Components/Admin/TableHOC";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteCoupon, fetchCoupons } from "../../redux/slices/couponSlices";

const columns = [
  { Header: "Code", accessor: "code" },
  { Header: "Discount", accessor: "discount" },
  { Header: "Expiry Date", accessor: "expiryDate" },
  { Header: "Active", accessor: "isActive" },
  { Header: "Edit", accessor: "edit" },
  { Header: "Delete", accessor: "delete" },
];

const Coupons = () => {
  const dispatch = useDispatch();
  const { coupons, loading, error } = useSelector((state) => state.coupons);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      dispatch(deleteCoupon(id))
        .unwrap()
        .then(() => {
          toast.success("Coupon deleted successfully!");
        })
        .catch((error) => {
          toast.error(`Failed to delete coupon: ${error}`);
        });
    }
  };

  // ✅ Transform Redux coupons into table-friendly format
  const data = coupons.map((coupon) => ({
    code: coupon.code,
    discount: `${coupon.discount}%`,
    expiryDate: new Date(coupon.expiryDate).toLocaleDateString("en-GB"),
    isActive: coupon.isActive ? "Yes" : "No",
    edit: (
      <Link to={`/admin/coupon/${coupon._id}`}>
        <FaEdit style={{ cursor: "pointer", color: "blue" }} title="Edit" />
      </Link>
    ),
    delete: (
      <FaTrash
        style={{ cursor: "pointer", color: "red" }}
        title="Delete"
        onClick={() => handleDelete(coupon._id)}
      />
    ),
  }));

  const Table = useCallback(() => {
    return TableHOC(columns, data, "dashboard-product-box", "Coupons", true)();
  }, [columns, data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {loading ? <p>Loading...</p> : error ? <p>{error}</p> : <Table />}
      </main>
      <Link to={"/admin/coupons/new"} className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Coupons;