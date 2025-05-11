import { Link } from "react-router-dom";
import { Box, Button, Typography, Card, CardContent, Divider } from "@mui/material";
import { Image } from "@mui/icons-material";
import AdminSidebar from "../../Components/Admin/AdminSidebar";

const EventPage = () => {
  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="banner-sections">
        <Box display="flex">
          <Box flex={1} p={4}>
            <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
              Manage Events
            </Typography>


            {/* Divider */}
            <Divider sx={{ my: 4 }} />

            {/* Logo Section */}
            <Card sx={{ maxWidth: 400, mx: "auto", boxShadow: 5, borderRadius: 3, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                  Navbar, Banner Heading
                </Typography>

                {/* Update Logo Button */}
                <Box display="flex" justifyContent="center" alignItems="center" my={2}>
                  <Button
                    component={Link}  // Fix: Add component={Link} for navigation
                    to={`/admin/event-banner`}  // Fix: Removed extra `}`
                    variant="contained"
                    color="secondary"
                    startIcon={<Image />}
                    sx={{ width: "100%" }}
                  >
                    Add Update 
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ maxWidth: 400, mx: "auto", boxShadow: 5, borderRadius: 3, textAlign: "center", marginTop: "40px" }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                  Product Card Images
                </Typography>

                {/* Update Logo Button */}
                <Box display="flex" justifyContent="center" alignItems="center" my={2}>
                  <Button
                    component={Link}  // Fix: Add component={Link} for navigation
                    to={`/admin/event-product-card`}  // Fix: Removed extra `}`
                    variant="contained"
                    color="secondary"
                    startIcon={<Image />}
                    sx={{ width: "100%" }}
                  >
                    Add Update
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

export default EventPage;
