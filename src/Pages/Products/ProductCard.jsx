import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

// Custom Arrow Components for the slider
const CustomNextArrow = ({ onClick }) => (
    <button className="custom-arrow next" onClick={onClick}>
        <ArrowForwardIos />
    </button>
);

const CustomPrevArrow = ({ onClick }) => (
    <button className="custom-arrow prev" onClick={onClick}>
        <ArrowBackIos />
    </button>
);

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    // Use the first image from the first color variant as the default product image.
    const defaultImage =
        product.colors?.[0]?.photos?.[0]?.url || "https://via.placeholder.com/50";

    const [hoveredImage, setHoveredImage] = useState(defaultImage);

    const colorSettings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
    };

    // Navigate to product details page when main image is clicked
    const navigateToProduct = () => {
        window.scrollTo(0, 0);
        navigate(`/product-details/${product._id}`);
    };

    // Helper function: Return the full product image for a variant (from its photos array)
    const getVariantImage = (color) => {
        return color.photos?.[0]?.url || defaultImage;
    };

    return (
        <div className="product-card">
            {/* <div className="wishlist">
                <FavoriteBorder />
            </div> */}

            {/* Main product image */}
            <div
                className="product-image"
                onClick={navigateToProduct}
                onMouseLeave={() => setHoveredImage(defaultImage)}
            >
                <img src={hoveredImage} alt={product.name} />
            </div>

            {/* Color variants slider */}
            {product.colors?.length > 0 && (
                <div className="colors">
                    <Slider {...colorSettings}>
                        {product.colors.map((color, index) => (
                            <div key={index} className="color-slide">
                                <img
                                    src={
                                        // Display the dedicated color image if available;
                                        // otherwise, use the first image from the photos array or a placeholder.
                                        color.colorImage?.url ||
                                        (color.photos && color.photos[0]?.url) ||
                                        "https://via.placeholder.com/30"
                                    }
                                    alt={color.colorName || `Color ${index + 1}`}
                                    className="color"
                                    onMouseEnter={() => setHoveredImage(getVariantImage(color))}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            )}

            {/* Product details */}
            <div className="product-details">
                <h4>{product.name}</h4>
                <span className="span">
                    <p className="price">${product.price?.toFixed(2)}</p>
                </span>
            </div>
        </div>
    );
};

export default ProductCard;
