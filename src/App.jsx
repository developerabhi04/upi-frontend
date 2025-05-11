import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import MainLayout from "./Components/Layout/MainLayout";
import "react-toastify/dist/ReactToastify.css"; // ✅ Toastify CSS
import Loadertwo from "./Components/Loader/Loadertwo";
import NotFound from "./Components/Notfound";
import ProductPage from "./Pages/Products/ProductCategory";
import ScrollTop from "./Components/Loader/ScrollTop";
import ChatSupport from "./Pages/Order/Contact";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import FirstBanners from "./Pages/Admin/Management/Banner/FirstBanners";
import Event from "./Pages/Events/Event";
import EventPage from "./Pages/Admin/EventPage";
import EventProductsCard from "./Pages/Admin/EventProductsCard";
import EventBanner from "./Pages/Admin/EventBanner";

// Lazy load pages
const Home = lazy(() => import("./Pages/Home/Home"));
const Products = lazy(() => import("./Pages/Products/Products"));
const ProductDetails = lazy(() =>
  import("./Pages/ProductsDetails/ProductDetails")
);
const Cart = lazy(() => import("./Pages/Cart/Cart"));
const Wishlist = lazy(() => import("./Pages/Wishlist/Wishlist"));
const Checkout = lazy(() => import("./Pages/User/Checkout"));
const Profile = lazy(() => import("./Pages/User/Profile"));
const Order = lazy(() => import("./Pages/Order/Order"));
const OrderDetails = lazy(() => import("./Pages/Order/OrderDetails"));
const OrderSuccessful = lazy(() => import("./Pages/Order/OrderSuccessful"));
const SignIn = lazy(() => import("./Pages/User/SignIn"));
const Signup = lazy(() => import("./Pages/User/Signup"));

// Help & Policy
const FAQ = lazy(() => import("./Pages/FooterSections/FAQ"));
const AccessibilityStatement = lazy(() =>
  import("./Pages/FooterSections/AccessibilityStatement")
);
const ServicesPage = lazy(() => import("./Pages/FooterSections/Services"));
const Ordering = lazy(() => import("./Pages/FooterSections/Ordering"));
const ShippingPolicy = lazy(() =>
  import("./Pages/FooterSections/ShippingPolicy")
);
const PrivacyPolicy = lazy(() =>
  import("./Pages/FooterSections/PrivacyPolicy")
);

// Admin Pages
const AdminDashboard = lazy(() => import("./Pages/Admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./Pages/Admin/Products"));
const Customers = lazy(() => import("./Pages/Admin/Customers"));
const Transaction = lazy(() => import("./Pages/Admin/Transaction"));
const BarCharts = lazy(() => import("./Pages/Admin/Charts/BarCharts"));
const PieCharts = lazy(() => import("./Pages/Admin/Charts/PieCharts"));
const LineCharts = lazy(() => import("./Pages/Admin/Charts/LineCharts"));
const ProductManagement = lazy(() =>
  import("./Pages/Admin/Management/ProductManagement")
);

const TransactionManagement = lazy(() =>
  import("./Pages/Admin/Management/TransactionManagement")
);
const Banners = lazy(() => import("./Pages/Admin/Banners"));
const NewProduct = lazy(() => import("./Pages/Admin/Management/NewProduct"));
const Category = lazy(() => import("./Pages/Admin/Category"));
const FirstBanner = lazy(() =>
  import("./Pages/Admin/Management/Banner/FirstBanner")
);
const SecondBanner = lazy(() =>
  import("./Pages/Admin/Management/Banner/SecondBanner")
);
const ThirdBanner = lazy(() =>
  import("./Pages/Admin/Management/Banner/ThirdBanner")
);
const CompanyInfo = lazy(() =>
  import("./Pages/Admin/Management/Company/CompanyInfo")
);
const Coupons = lazy(() => import("./Pages/Admin/Coupon"));
const NewCoupon = lazy(() => import("./Pages/Admin/Management/NewCoupon"));
const CouponManagement = lazy(() =>
  import("./Pages/Admin/Management/CouponManagement")
);

// PayPal config
const initialOptions = {
  "client-id":
    "AWBqUFZvUwKo5MnU57O7qeZka0Yb-PEEOrSOIfliDRrCoIJ1M5Z-OyKZmdtOYh7R9B3Km1ThtgYUTins", // Replace with actual client ID
  currency: "USD",
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Suspense fallback={<Loadertwo />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route path="/products" element={
              <MainLayout>
                <Products />
              </MainLayout>
            }
          />
          <Route path="/event-campaign"
            element={
              <MainLayout>
                <Event />
              </MainLayout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <MainLayout>
                <ProductDetails />
              </MainLayout>
            }
          />
          <Route
            path="/products/:category"
            element={
              <MainLayout>
                <ProductPage />
              </MainLayout>
            }
          />
          <Route
            path="/product-details/:id"
            element={
              <MainLayout>
                <ProductDetails />
              </MainLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <MainLayout>
                <Cart />
              </MainLayout>
            }
          />
          <Route
            path="/wishlist"
            element={
              <MainLayout>
                <Wishlist />
              </MainLayout>
            }
          />
          <Route
            path="/chat-support"
            element={
              <MainLayout>
                <ChatSupport />
              </MainLayout>
            }
          />

          {/* User Routes */}
          <Route
            path="/checkout-user"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PayPalScriptProvider options={initialOptions}>
                    <Checkout />
                  </PayPalScriptProvider>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Order />
                </MainLayout>{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders-details/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <OrderDetails />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders-success"
            element={
              <ProtectedRoute>
                <OrderSuccessful />
              </ProtectedRoute>
            }
          />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<Signup />} />

          {/* Help & Policy Pages */}
          <Route
            path="/faq"
            element={
              <MainLayout>
                <FAQ />
              </MainLayout>
            }
          />
          <Route
            path="/accessibility-statement"
            element={
              <MainLayout>
                <AccessibilityStatement />
              </MainLayout>
            }
          />
          <Route
            path="/services"
            element={
              <MainLayout>
                <ServicesPage />
              </MainLayout>
            }
          />
          <Route
            path="/ordering"
            element={
              <MainLayout>
                <Ordering />
              </MainLayout>
            }
          />
          <Route
            path="/shipping-policy"
            element={
              <MainLayout>
                <ShippingPolicy />
              </MainLayout>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <MainLayout>
                <PrivacyPolicy />
              </MainLayout>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/banner"
            element={
              <AdminRoute>
                <Banners />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/event"
            element={
              <AdminRoute>
                <EventPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/event-banner"
            element={
              <AdminRoute>
                <EventBanner />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/event-product-card"
            element={
              <AdminRoute>
                <EventProductsCard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/banner/first-banner"
            element={
              <AdminRoute>
                <FirstBanner />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/banner/first-banner-seconds"
            element={
              <AdminRoute>
                <FirstBanners />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/banner/second-banner"
            element={
              <AdminRoute>
                <SecondBanner />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/banner/third-banner"
            element={
              <AdminRoute>
                <ThirdBanner />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/banner/company-info"
            element={
              <AdminRoute>
                <CompanyInfo />{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <AdminRoute>
                <Coupons />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/category"
            element={
              <AdminRoute>
                <Category />{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <AdminRoute>
                <Customers />{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/transaction"
            element={
              <AdminRoute>
                <Transaction />{" "}
              </AdminRoute>
            }
          />

          {/* Charts */}
          <Route
            path="/admin/chart/bar"
            element={
              <AdminRoute>
                <BarCharts />{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/chart/pie"
            element={
              <AdminRoute>
                <PieCharts />{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/chart/line"
            element={
              <AdminRoute>
                {" "}
                <LineCharts />{" "}
              </AdminRoute>
            }
          />

          {/* Admin Management */}
          <Route
            path="/admin/products/new"
            element={
              <AdminRoute>
                <NewProduct />{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/coupons/new"
            element={
              <AdminRoute>
                <NewCoupon />{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/product/:productId"
            element={
              <AdminRoute>
                <ProductManagement />{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/coupon/:id"
            element={
              <AdminRoute>
                <CouponManagement />{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/transaction/:id"
            element={
              <AdminRoute>
                <TransactionManagement />{" "}
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
};

export default App;
