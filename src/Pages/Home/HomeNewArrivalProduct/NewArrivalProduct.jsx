import { useState, useEffect } from "react";
import Slider from "react-slick";
import {
  ArrowBackIos,
  ArrowForwardIos,
  ArrowLeft,
  ArrowRight,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewArrivalProducts } from "../../../redux/slices/productSlices";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";

// Custom Arrows for the main slider
const NextArrow = ({ onClick }) => (
  <button className="arrow next" onClick={onClick}>
    <ArrowRight />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button className="arrow prev" onClick={onClick}>
    <ArrowLeft />
  </button>
);

// Custom Arrows for the inner color slider
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

const NewArrivalProduct = () => {
  // Maintain a state object to store the selected variant per product (keyed by product ID)
  const [selectedVariants, setSelectedVariants] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error, selectedColor } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchNewArrivalProducts(selectedColor));
  }, [dispatch, selectedColor]);

  if (loading)
    return (
      <>
        {[...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            
          />
        ))}
      </>
    );
  if (error) return <p>Error: {error}</p>;

  // Settings for the main product slider
  const mainSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  // Settings for the inner color slider
  const colorSliderSettings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  // Navigate to ProductDetails, passing the selected variant image as a query parameter.
  const navigateLink = (productId, image) => {
    window.scrollTo(0, 0);
    navigate(
      `/product-details/${productId}?selectedImage=${encodeURIComponent(image)}`
    );
  };

  // Helper: Return the default image (first image from first color variant)
  const getDefaultImage = (product) => {
    return product.colors &&
      product.colors.length > 0 &&
      product.colors[0].photos &&
      product.colors[0].photos.length > 0
      ? product.colors[0].photos[0].url
      : "https://via.placeholder.com/50";
  };

  // Helper: Return the image for a variant (first image from its photos array)
  const getVariantImage = (color) => {
    return color.photos && color.photos[0]?.url
      ? color.photos[0].url
      : "https://via.placeholder.com/50";
  };

  // When a color swatch is hovered, update the selected variant for that product.
  const handleColorHover = (productId, colorVariant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: colorVariant,
    }));
  };

  return (
    <section className="arrival-section">
      <h1>What’s new this week.</h1>
      <div className="bar"></div>
      <div className="slider-container">
        <Slider {...mainSliderSettings}>
          {products.map((product) => {
            const defaultImg = getDefaultImage(product);
            // Use the selected variant if one exists, otherwise the default image.
            const variant = selectedVariants[product._id] || {
              photos: [{ url: defaultImg }],
            };
            const mainImage = variant.photos[0].url;
            return (
              <div key={product._id} className="product-card">
                {/* Main Product Image */}
                <div
                  className="image-container"
                  onClick={() => navigateLink(product._id, mainImage)}
                >
                  <img src={mainImage} alt={product.name} />
                  

                </div>
                {/* Inner Color Slider */}
                {product.colors && product.colors.length > 0 && (
                  <div className="colors">
                    <Slider {...colorSliderSettings}>
                      {product.colors.map((color, index) => {
                        const variantImg = getVariantImage(color);
                        return (
                          <div key={index} className="color-slide">
                            <img
                              src={color.colorImage?.url || variantImg}
                              alt={color.colorName || `Color ${index + 1}`}
                              className="color"
                              onMouseEnter={() =>
                                handleColorHover(product._id, color)
                              }
                              onClick={() =>
                                navigateLink(product._id, variantImg)
                              }
                            />
                            
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                )}
                {/* Product Details */}
                <div className="details">
                  <h3>{product.name}</h3>
                  <span className="span">
                    <p className="price">${product.price.toFixed(2)}</p>
                  </span>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
      <div className="button-div">
        <button className="button" onClick={() => navigate("/products")}>
          SHOP {"WHAT'S"} NEW
        </button>
      </div>
    </section>
  );
};

export default NewArrivalProduct;





