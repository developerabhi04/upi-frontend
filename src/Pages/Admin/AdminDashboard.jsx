import AdminSidebar from "../../Components/Admin/AdminSidebar";
// import UserImg from "../../assets/userpic.png";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { BarChart } from "../../Components/Admin/Chart";
import DashboardTable from "../../Components/Admin/DashboardTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBarCharts, fetchDashboardStats, fetchLineCharts, fetchPieCharts } from "../../redux/slices/AdminChartSlices";
import Loadertwo from "../../Components/Loader/Loadertwo";



const AdminDashboard = () => {
    const dispatch = useDispatch();

    // Extract data from Redux store
    const { stats, pieCharts, barCharts, loading, error } = useSelector((state) => state.dashboard);
    console.log(barCharts)

    // Fetch data when the component mounts
    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchPieCharts());
        dispatch(fetchBarCharts());
        dispatch(fetchLineCharts());
    }, [dispatch]);

    if (loading) {
        return <><Loadertwo/></>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main */}
            <main className="dashboard">

                {/* Section 1 */}
                <section className="widget-container">
                    <WidgetItem
                        percent={stats?.changePercent?.revenue.toFixed(0) || 0}
                        amount={true}
                        value={stats?.count?.revenue.toFixed(2) || 0}
                        heading={"Revenue"}
                        color={"rgb(0, 115, 255)"}
                    />
                    <WidgetItem
                        percent={stats?.changePercent?.user || 0}
                        value={stats?.count?.user || 0}
                        heading={"User"}
                        color={"rgb(0, 198, 202)"}
                    />
                    <WidgetItem
                        percent={stats?.changePercent?.order || 0}
                        value={stats?.count?.order || 0}
                        heading={"Transactions"}
                        color={"rgb(225, 196, 0)"}
                    />
                    <WidgetItem
                        percent={stats?.changePercent?.product || 0}
                        amount={false}
                        value={stats?.count?.product || 0}
                        heading={"Products"}
                        color={"rgb(76 0 255)"}
                    />
                </section>

                {/* Graph 2 */}
                <section className="graph-container">
                    <div className="revenue-chart">
                        <h2>Revenue & Transaction</h2>
                        <BarChart
                            data_1={barCharts?.revenue || []}
                            data_2={barCharts?.orders || []}
                            labels={barCharts?.months || []}
                            title_1={"Revenue"}
                            title_2={"Transaction"}
                            bgColor_1={"rgb(0, 115, 255)"}
                            bgColor_2={"rgb(53, 162, 235, 0.8)"}
                        />
                    </div>

                    <div className="dashboard-categories">
                        <h2>Inventory</h2>
                        <div>
                            {Object.entries(pieCharts?.categoryCount || {}).map(([category, value]) => (
                                <CategoryItem
                                    key={category}
                                    heading={category}
                                    value={value}
                                    color={`hsl(${value * 4}, ${value}%, 50%)`}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 3 */}
                <section className="transaction-container">

                    {/* Table */}
                    <DashboardTable />
                </section>
            </main>
        </div>
    );
};


// WidgetItem Component
const WidgetItem = ({ heading, value, percent, color, amount = false }) => (
    <article className="widget">
        <div className="widget-info">
            <p>{heading}</p>
            <h4>{amount ? `$${value}` : value}</h4>
            {percent > 0 ? (
                <span className="green">
                    <HiTrendingUp /> + {percent}%
                </span>
            ) : (
                <span className="red">
                    <HiTrendingDown /> - {percent}%
                </span>
            )}
        </div>

        <div
            className="widget-circle"
            style={{
                background: `conic-gradient(${color} ${(Math.abs(percent) / 100) * 360}deg, rgb(255, 255, 255) 0)`,
            }}
        >
            <span style={{ color }}>{percent}%</span>
        </div>
    </article>
);

// CategoryItem Component
const CategoryItem = ({ color, value, heading }) => (
    <div className="category-item">
        <h5>{heading}</h5>
        <div>
            <div
                style={{
                    backgroundColor: color,
                    width: `${value}%`,
                }}
            ></div>
        </div>
        <span>{value}%</span>
    </div>
);

export default AdminDashboard;
