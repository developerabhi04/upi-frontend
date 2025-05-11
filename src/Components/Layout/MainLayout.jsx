import { lazy } from "react";

const Header = lazy(() => import("../../Components/Layout/Header"));
const Footer = lazy(() => import("../../Components/Layout/Footer"));

const MainLayout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};

export default MainLayout;
