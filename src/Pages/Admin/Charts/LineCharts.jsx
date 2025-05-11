import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../../Components/Admin/AdminSidebar"
import { LineChart } from "../../../Components/Admin/Chart"
import { useEffect } from "react";
import { fetchLineCharts } from "../../../redux/slices/AdminChartSlices";





const LineCharts = () => {
    const dispatch = useDispatch();
    const { lineCharts } = useSelector((state) => state.dashboard);

    console.log(lineCharts)

    useEffect(() => {
        dispatch(fetchLineCharts());
    }, [dispatch]);

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="chart-container">
                <h1>Line Charts</h1>
                <section>
                    <LineChart
                        data={lineCharts?.users || []}
                        label="Users"
                        borderColor="rgb(53, 162, 255)"
                        backgroundColor="rgba(53, 162, 255,0.5)"
                        labels={lineCharts?.months || []}
                    />
                    <h2>Active Users</h2>
                </section>

                <section>
                    <LineChart
                        data={lineCharts?.products || []}
                        backgroundColor={"hsla(269,80%,40%,0.4)"}
                        borderColor={"hsl(269,80%,40%)"}
                        label="Products"
                        labels={lineCharts?.months}
                    />
                    <h2>Total Products (USD)</h2>
                </section>

                <section>
                    <LineChart
                        data={lineCharts?.revenue || []}
                        backgroundColor={"hsla(129,80%,40%,0.4)"}
                        borderColor={"hsl(129,80%,40%)"}
                        label="Revenue"
                        labels={lineCharts?.months}
                    />
                    <h2>Total Revenue</h2>
                </section>

                <section>
                    <LineChart
                        data={lineCharts?.discount || []}
                        backgroundColor={"hsla(29,80%,40%,0.4)"}
                        borderColor={"hsl(29,80%,40%)"}
                        label="Discount"
                        labels={lineCharts?.months}
                    />
                    <h2>Discount Allotted</h2>
                </section>

            </main>
        </div>
    )
}

export default LineCharts