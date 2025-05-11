import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchUsers } from "../../redux/slices/userSlices";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import TableHOC from "../../Components/Admin/TableHOC";
import { FaTrash } from "react-icons/fa";

const columns = [
  { Header: "Avatar", accessor: "avatar" },
  { Header: "Name", accessor: "name" },
  { Header: "Email", accessor: "email" },
  { Header: "Role", accessor: "role" },
  { Header: "Action", accessor: "action" },
];

const Customers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);


  // ✅ Delete user function
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  // Transform users into table-friendly format
  const data = users.map((user) => ({
    avatar: (
      <img
        style={{ borderRadius: "50%", width: "40px", height: "40px" }}
        src={user.avatar[0]?.url}
        alt="Avatar"
      />
    ),
    name: user.name,
    email: user.email,
    role: (
      <span
        style={{
          background: user.role === "admin" ? "green" : "red",
          fontWeight: "bold",
          color: "white",
          padding: "0.5rem",
          borderRadius:"5px"
        }}
      >
        {user.role || "user"}
      </span>
    ),
    action: user.role === "admin" ? ( // Disable delete button for admins
      <button
        disabled
        style={{
          color: "gray",
          border: "none",
          background: "none",
          cursor: "not-allowed",
          opacity: 0.6,
        }}
      >
        <FaTrash />
      </button>
    ) : (
      <button
        onClick={() => handleDelete(user._id)}
        style={{
          color: "red",
          border: "none",
          background: "none",
          cursor: "pointer",
        }}
      >
        <FaTrash />
      </button>
    ),
  }));

  // ✅ Corrected `useCallback`
  const Table = useCallback(() => {
    return TableHOC(columns, data, "dashboard-product-box", "Customers", true)();
  }, [columns, data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {loading ? (
          <p>Loading customers...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <Table />  // ✅ Call it properly inside JSX
        )}
      </main>
    </div>
  );
};

export default Customers;
