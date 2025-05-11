import { Link } from "react-router-dom";
import { Box, Button, Typography, Card, CardContent, Divider } from "@mui/material";
import { ViewCarousel, Image } from "@mui/icons-material";
import AdminSidebar from "../../Components/Admin/AdminSidebar";

const Banners = () => {
  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="banner-sections">
        <Box display="flex">
          <Box flex={1} p={4}>
            <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
              Manage Banners
            </Typography>

            {/* Banners Section */}
            <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center" mt={3}>
              {["first-banner", "first-banner-seconds" , "second-banner", "third-banner"].map((banner, index) => (
                <Card key={index} sx={{ width: 300, boxShadow: 5, borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h5" textAlign="center" gutterBottom>
                      Banner Section {index + 1}
                    </Typography>
                    <Box display="flex" justifyContent="center" mt={2}>
                      <Button
                        component={Link}
                        to={`/admin/banner/${banner}`}
                        variant="contained"
                        color={index === 0 ? "primary" : index === 1 ? "secondary" : "success"}
                        startIcon={<ViewCarousel />}
                        sx={{ width: "100%" }}
                      >
                        View Banner
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
            

            {/* Divider */}
            <Divider sx={{ my: 4 }} />

            {/* Logo Section */}
            <Card sx={{ maxWidth: 400, mx: "auto", boxShadow: 5, borderRadius: 3, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                  Logo Section
                </Typography>

                {/* Update Logo Button */}
                <Box display="flex" justifyContent="center" alignItems="center" my={2}>
                  <Button
                    component={Link}  // Fix: Add component={Link} for navigation
                    to={`/admin/banner/company-info`}  // Fix: Removed extra `}`
                    variant="contained"
                    color="secondary"
                    startIcon={<Image />}
                    sx={{ width: "100%" }}
                  >
                    Update Logo
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </main>
    </div>
  );
};

export default Banners;
