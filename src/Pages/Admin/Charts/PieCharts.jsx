import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../../Components/Admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../Components/Admin/Chart";
import { useEffect } from "react";
import { fetchPieCharts } from "../../../redux/slices/AdminChartSlices";


const PieCharts = () => {

  const dispatch = useDispatch();
  const { pieCharts, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchPieCharts());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="chart-container">
        <h1>Pie & Dougnut Charts</h1>
        <section>
          <div>
            <PieChart
              labels={["Processing", "Shipped", "Delivered"]}
              data={[
                pieCharts?.statusCount?.processing || 0,
                pieCharts?.statusCount?.shipped || 0,
                pieCharts?.statusCount?.delivered || 0,
              ]}
              backgroundColor={[
                `hsl(110, 80%, 80%)`,
                `hsl(110, 80%, 50%)`,
                `hsl(110, 40%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />

          </div>
          <h2>Order Fulfillment Ratio</h2>
        </section>

        {/*  */}
        <section>
          <div>
            <DoughnutChart
              labels={
                pieCharts?.categoryCount &&
                  typeof pieCharts.categoryCount === "object" &&
                  !Array.isArray(pieCharts.categoryCount)
                  ? Object.keys(pieCharts.categoryCount)
                  : ["No Data"]
              }
              data={
                pieCharts?.categoryCount &&
                  typeof pieCharts.categoryCount === "object" &&
                  !Array.isArray(pieCharts.categoryCount)
                  ? Object.values(pieCharts.categoryCount)
                  : [1] // Default value to prevent errors
              }
              backgroundColor={
                pieCharts?.categoryCount &&
                  typeof pieCharts.categoryCount === "object" &&
                  !Array.isArray(pieCharts.categoryCount)
                  ? Object.keys(pieCharts.categoryCount).map(
                    (_, index) => `hsl(${index * 40}, 80%, 50%)`
                  )
                  : ["#ccc"]
              }
              legends={true}
              offset={[0, 0, 0, 80]}
            />


          </div>
          <h2>Product Categories Ratio</h2>
        </section>

        {/*  */}
        <section>
          <div>
            <DoughnutChart
              labels={["In Stock", "Out Of Stock"]}
              data={[
                pieCharts?.stockCount?.inStock || 0,
                pieCharts?.stockCount?.outOfStock || 0,
              ]}
              backgroundColor={["hsl(269, 80%, 40%)", "rgb(53, 162, 255)"]}
              legends={false}
              offset={[0, 80]}
              cutout={"70%"}
            />

          </div>
          <h2>Stock Availablity</h2>
        </section>

        

      </main>
    </div>
  )
}


export default PieCharts;