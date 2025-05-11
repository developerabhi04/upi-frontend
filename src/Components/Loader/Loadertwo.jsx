import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";

const Loadertwo = ({ loading = true, message = ".....", size = 100, color = "#c8102e" }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={styles.loaderContainer}
        >
            <div style={styles.loaderBox}>
                <ClipLoader color={color} loading={loading} size={size} />
                <p style={styles.text}>{message}</p>
                <div style={styles.dotsContainer}>
                    <motion.span
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                        style={styles.dot}
                    />
                    <motion.span
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.2 }}
                        style={styles.dot}
                    />
                    <motion.span
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.4 }}
                        style={styles.dot}
                    />
                    <motion.span
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.4 }}
                        style={styles.dot}
                    />
                    <motion.span
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.4 }}
                        style={styles.dot}
                    />
                </div>
            </div>
        </motion.div>
    );
};

const styles = {
    loaderContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        // backgroundColor: "tranparent",
        backdropFilter: "blur(50px)", // Glassmorphism effect
    },
    loaderBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        borderRadius: "15px",
        // boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        // background: "red",
        // backdropFilter: "blur(20px)", // Glassmorphism effect
        // padding: "30px",
    },
    text: {
        marginTop: "15px",
        fontSize: "18px",
        color: "white",
        fontWeight: "500",
    },
    dotsContainer: {
        display: "flex",
        marginTop: "10px",
    },
    dot: {
        width: "8px",
        height: "8px",
        backgroundColor: "#c8102e",
        borderRadius: "50%",
        margin: "0 4px",
    },
};

export default Loadertwo;
