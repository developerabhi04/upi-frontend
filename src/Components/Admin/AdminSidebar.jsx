import { useEffect, useState } from "react";
import { AiFillFileText } from "react-icons/ai";
import { FaChartBar, FaChartLine, FaChartPie } from "react-icons/fa";
import { HiMenuAlt4 } from "react-icons/hi";
import { IoIosPeople } from "react-icons/io";
import { RiCoupon2Fill, RiDashboardFill, RiShoppingBag3Fill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { FaRegImages } from "react-icons/fa";
import { MdCategory, MdEvent } from "react-icons/md";

const AdminSidebar = () => {
    const location = useLocation();

    const [showModal, setShowModal] = useState(false);
    const [phoneActive, setPhoneActive] = useState(window.innerWidth < 1100);

    const resizeHandler = () => {
        setPhoneActive(window.innerWidth < 1100);
    };

    useEffect(() => {
        window.addEventListener("resize", resizeHandler);

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, []);

    return (
        <>
            {phoneActive && (
                <button id="hamburger" onClick={() => setShowModal(true)}>
                    <HiMenuAlt4 />
                </button>
            )}

            <aside
                style={ phoneActive
                        ? {
                            width: "20rem",
                            height: "100vh",
                            position: "fixed",
                            top: 0,
                            left: showModal ? "0" : "-20rem",
                            transition: "all 0.5s",
                        }
                        : {}
                }
            >
                {/* <h2 style={{ textAlign: "center", color: "pink" }}>Fem Cartel</h2> */}
                <h2 style={{ textAlign: "center", color: "pink", cursor: "pointer" }}>
                    <Link to="/" style={{ textDecoration: "none", color: "pink" }}>
                        Fem Cartel
                    </Link>
                </h2>
                <div>
                    <h5>Navigation</h5>
                    <ul>
                        <Li
                            url={"/admin/dashboard"}
                            text={"Dashboard"}
                            Icon={RiDashboardFill}
                            location={location}
                        />
                        <Li
                            url={"/admin/event"}
                            text={"Event"}
                            Icon={MdEvent}
                            location={location}
                        />
                        <Li
                            url={"/admin/banner"}
                            text={"Banner"}
                            Icon={FaRegImages}
                            location={location}
                        />
                        <Li
                            url={"/admin/category"}
                            text={"Category"}
                            Icon={MdCategory}
                            location={location}
                        />
                        <Li
                            url={"/admin/products"}
                            text={"Products"}
                            Icon={RiShoppingBag3Fill}
                            location={location}
                        />
                        <Li
                            url={"/admin/coupons"}
                            text={"Coupon"}
                            Icon={RiCoupon2Fill}
                            location={location}
                        />
                        <Li
                            url={"/admin/customers"}
                            text={"Customer"}
                            Icon={IoIosPeople}
                            location={location}
                        />
                        <Li
                            url={"/admin/transaction"}
                            text={"Transaction"}
                            Icon={AiFillFileText}
                            location={location}
                        />
                    </ul>
                </div>

                <DivTwo location={location} />
                {/* <DivThree location={location} /> */}

                {phoneActive && (
                    <button id="close-sidebar" onClick={() => setShowModal(false)}>
                        Close
                    </button>
                )}
            </aside>
        </>
    );
};

////////////////////////////////////////////////////
const DivTwo = ({ location }) => (
    <div>
        <h5>Charts</h5>
        <ul>
            <Li url={"/admin/chart/bar"} text={"Bar"} Icon={FaChartBar} location={location} />
            <Li url={"/admin/chart/pie"} text={"Pie"} Icon={FaChartPie} location={location} />
            <Li url={"/admin/chart/line"} text={"Line"} Icon={FaChartLine} location={location} />
        </ul>
    </div>
);


const Li = ({ url, text, location, Icon }) => (
    <li
        style={{
            backgroundColor: location.pathname.includes(url)
                ? "rgba(0, 115, 255, 0.1)"
                : "#144f67",
        }}
    >  
        <Link
            to={url}
            style={{
                color: location.pathname.includes(url) ? "rgb(0, 115, 255)" : "black",
            }}
        >
            <Icon />
            {text}
        </Link>
    </li>
);

export default AdminSidebar;
