import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom"; // For redirection
import { MdAccountCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin, registerUser } from "../../redux/slices/userSlices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import { Helmet } from "react-helmet-async";

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Use navigate for redirection

    const { loading, error, user } = useSelector((state) => state.user);

    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };


    const handleGoogleSignUp = async () => dispatch(googleLogin());


    useEffect(() => {
        if (error) toast.error(error);
        if (user) navigate("/");
    }, [error, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!", { position: "top-right" });
            return;
        }

        // Create FormData for file upload
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);

        data.append("password", formData.password);
        if (image) {
            data.append("avatar", image);
        }

        dispatch(registerUser(data));
    };



    // Show success message & redirect after successful registration

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        else if (user) {
            toast.success("Registration successful! Redirecting…");
            setTimeout(() => navigate("/"), 2000);
        }
    }, [error, user, navigate]);



    return (
        <>
            <Helmet>
                <title>Create Account | YourSiteName</title>
                <meta
                    name="description"
                    content="Sign up for a YourSiteName account to access exclusive features, track orders, and more."
                />
                <link rel="canonical" href="https://www.yoursite.com/sign-up" />
                <meta property="og:title" content="Sign Up – YourSiteName" />
                <meta
                    property="og:description"
                    content="Join YourSiteName today for fast checkout, order tracking, and personalized offers."
                />
                <meta property="og:url" content="https://www.yoursite.com/sign-up" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://www.yoursite.com"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Sign Up",
                                "item": "https://www.yoursite.com/sign-up"
                            }
                        ]
                    })}
                </script>
            </Helmet>
            <div className="signup-container">
                <ToastContainer /> {/* Toast container for showing toasts */}

                <div className="signup-card">
                    <h2>Create Account</h2>
                    <form onSubmit={handleSubmit}>
                        <h3 className="upload-heading">Upload Profile</h3>
                        <div className="image-upload">
                            <label htmlFor="profileImage" className="image-label">
                                {image ? (
                                    <img src={URL.createObjectURL(image)} alt="Profile Preview" className="profile-preview" />
                                ) : (
                                    <MdAccountCircle className="avatar-icon" />
                                )}
                            </label>
                            <input type="file" id="profileImage" accept="image/*" onChange={handleImageChange} hidden />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" placeholder="Enter your full name" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" placeholder="Enter your email" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" placeholder="Enter your password" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" placeholder="Confirm your password" required onChange={handleChange} />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="signup-btn" disabled={loading}>
                                {loading ? "Signing Up..." : "Sign Up"}
                            </button>
                        </div>

                        <div className="form-footer">
                            <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
                        </div>
                    </form>

                    <div className="google-signin">
                        <button type="button" className="google-btn" onClick={handleGoogleSignUp} disabled={loading}>
                            <FcGoogle />
                            <span>{loading ? "Signing in..." : "Sign up With Google"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
