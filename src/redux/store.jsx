import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlices.js";
import productsReducer from "./slices/productSlices.js";
import orderReducer from "./slices/orderSlices.js";
import categoryReducer from "./slices/categorySlices.js";
import bannerReducer from "./slices/bannerSlices.js";
import bannersReducer from "./slices/bannersSlices.js";
import secondBannerReducer from "./slices/secondBannerSlices.js";
import thirdBannerReducer from "./slices/thirdBannerSlices.js";
import companyReducer from "./slices/companyDetailsSlices.js";
import couponReducer from "./slices/couponSlices.js";
import shopCartReducer from "./slices/cartSlices.js";
import wishlistReducer from "./slices/wishlistSlices.js";
import paymentConfigReducer from "./slices/paymentSlices.js";
import reviewReducer from "./slices/paymentSlices.js";
import dashboardReducer from "./slices/AdminChartSlices.js";
import bannerEventReducer from "./slices/BannerEventSlices.js";
import productEventReducer from "./slices/ProductEventSlices.js";


const store = configureStore({
    reducer: {
        user: userReducer,
        products: productsReducer,
        order: orderReducer,
        categories: categoryReducer,
        banners: bannerReducer,
        bannerss: bannersReducer,
        secondBanner: secondBannerReducer,
        thirdbanners: thirdBannerReducer,
        company: companyReducer,
        coupons: couponReducer,

        shopCart: shopCartReducer,
        wishlist: wishlistReducer,
        paymentConfig: paymentConfigReducer,
        review: reviewReducer,
        dashboard: dashboardReducer,
        bannerEvent: bannerEventReducer,
        productEvent: productEventReducer,
    },
});

export default store;
