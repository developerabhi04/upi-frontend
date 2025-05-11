
import Slider from "react-slick";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Custom arrow components for the slider
const NextArrow = ({ onClick }) => (
    <div className="similar-arrow next" onClick={onClick}>
        <ArrowForwardIos />
    </div>
);

const PrevArrow = ({ onClick }) => (
    <div className="similar-arrow prev" onClick={onClick}>
        <ArrowBackIos />
    </div>
);

const SimilarProduct = () => {
    const { similarProducts, loading } = useSelector((state) => state.products);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        pauseOnHover: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div className="similar-products">
            <h2>Similar Products</h2>
            {loading ? (
                <p>Loading similar products...</p>
            ) : similarProducts && similarProducts.length > 0 ? (
                <Slider {...settings}>
                    {similarProducts.map((prod) => (
                        <div key={prod._id} className="similar-product-card">
                            <Link to={`/product/${prod._id}`}>
                                <div className="img-container">
                                    <img
                                        src={
                                            prod.colors?.[0]?.photos?.[0]?.url ||
                                            "https://via.placeholder.com/200"
                                        }
                                        alt={prod.name}
                                    />
                                </div>
                                <div className="product-info">
                                    <p className="product-name">{prod.name}</p>
                                    <p className="product-price">${prod.price.toFixed(2)}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </Slider>
            ) : (
                <p>No similar products found.</p>
            )}
        </div>
    );
};

export default SimilarProduct;
