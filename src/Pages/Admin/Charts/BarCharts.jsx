import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../../Components/Admin/AdminSidebar";
import { BarChart } from "../../../Components/Admin/Chart";
import { fetchBarCharts } from "../../../redux/slices/AdminChartSlices";


const BarCharts = () => {
    const dispatch = useDispatch();
    const { barCharts, loading } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchBarCharts());
    }, [dispatch]);

    return (
        <div className="admin-container">
            <AdminSidebar />

            <main className="chart-container">
                <h1>Bar Charts</h1>

                {loading ? (
                    <p>Loading bar charts...</p>
                ) : barCharts ? (
                    <>
                        <section>
                            <BarChart
                                horizontal={false}
                                data_1={barCharts.revenue || []}
                                data_2={barCharts.orders || []}
                                title_1="Revenue"
                                title_2="Transactions"
                                bgColor_1="rgb(0, 115, 255)"
                                bgColor_2="rgb(53, 162, 235, 0.8)"
                                labels={barCharts?.months || []} // Show last 6 months
                            />
                            <h2>Revenue & Transactions (Last 6 Months)</h2>
                        </section>

                        <section>
                            <BarChart
                                horizontal={true}
                                data_1={barCharts.orders || []}
                                title_1="Orders"
                                bgColor_1="hsl(180, 40%, 50%)"
                                labels={barCharts?.months || []}
                            />
                            <h2>Orders Over The Last 6 Months</h2>
                        </section>
                    </>
                ) : (
                    <p>No bar chart data available.</p>
                )}
            </main>
        </div>
    );
};

export default BarCharts;
