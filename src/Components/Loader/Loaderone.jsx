import Lottie from "lottie-react";
import { motion } from "framer-motion";
import loadingAnimation from "../assets/loading.json"; // Replace with your Lottie JSON file

const LoaderOne = ({ message = "Loading, please wait...", size = 200, speed = 1 }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={styles.loaderContainer}
        >
            <Lottie
                animationData={loadingAnimation}
                loop={true}
                style={{ width: size, height: size }}
                speed={speed}
            />
            <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                style={styles.text}
            >
                {message}
            </motion.p>
        </motion.div>
    );
};

const styles = {
    loaderContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
    },
    text: {
        marginTop: "15px",
        fontSize: "18px",
        color: "#555",
        fontWeight: "500",
    },
};

export default LoaderOne;
