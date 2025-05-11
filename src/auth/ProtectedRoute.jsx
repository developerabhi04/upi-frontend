import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { loading, isAuthenticated } = useSelector((state) => state.user);

    if (loading) {
        return <div>Loading...</div>; // Show a loader while loading
    }

    if (isAuthenticated === false) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
