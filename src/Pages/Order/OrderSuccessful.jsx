import { CheckCircle } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useDispatch } from "react-redux";
import { resetNewOrderSuccess } from "../../redux/slices/orderSlices";

const OrderSuccessful = () => {
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        // Stop confetti effect after 9 seconds
        setTimeout(() => setShowConfetti(false), 9000);
    }, []);


    

    // Reset the order placed flag when the component mounts
    useEffect(() => {
        dispatch(resetNewOrderSuccess());
    }, [dispatch]);

    return (
        <div className="order-success">
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

            <div className="success-box">
                <CheckCircle className="success-icon" />
                <h1>Order Confirmed! 🎉</h1>
                <p>Your order has been placed successfully. Get ready for the excitement!</p>
                <Button
                    variant="contained"
                    className="home-button"
                    onClick={() => navigate("/")}
                >
                    Go to Home
                </Button>
            </div>
        </div>
    );
};

export default OrderSuccessful;
