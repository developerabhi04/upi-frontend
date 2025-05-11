import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

  // AdminRoute ensures that only admin users can access the child route
  const AdminRoute = ({ children }) => {
    const { user } = useSelector((state) => state.user);
    if (!user || user.role !== "admin") {
      return <Navigate to="/" replace />;
    }
    return children;
  };


  export default AdminRoute;