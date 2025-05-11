import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestOrders } from "../../redux/slices/orderSlices";
import TableHOC from "./TableHOC";
import Loadertwo from "../Loader/Loadertwo";

const columns = [
  { Header: "Order ID", accessor: "id" },
  { Header: "User", accessor: "user" },
  { Header: "Quantity", accessor: "quantity" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Status", accessor: "status" },
];

const DashboardTable = () => {
  const dispatch = useDispatch();
  const { latestOrders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchLatestOrders());
  }, [dispatch]);

  const formattedData = useMemo(() => {
    return (
      latestOrders
        ?.slice(0, 3) // ✅ Get only the last 3 transactions
        .map((order) => ({
          id: order._id,
          user: order.user?.name || "Guest User",
          quantity: order.orderItems?.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
          amount: `$${order.total}`,
          status: (
            <span
              className={
                order.status === "Processing"
                  ? "red"
                  : order.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {order.status}
            </span>
          ),
        })) || []
    );
  }, [latestOrders]);

  if (loading)
    return (
      <>
        <Loadertwo />
      </>
    );
  if (error) return <p className="error">{error}</p>;
  if (!formattedData.length) return <p>No recent transactions found.</p>;

  const TableComponent = TableHOC(
    columns,
    formattedData,
    "transaction-box",
    "Latest 3 Transactions"
  );

  return <TableComponent />;
};

export default DashboardTable;
