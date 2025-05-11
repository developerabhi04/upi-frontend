import { useState, useEffect } from "react";
import { Grid, Rating, Skeleton, Stack } from "@mui/material";
import { Add, FavoriteBorder, Remove } from "@mui/icons-material";
import { Link, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSimilarProducts,
  fetchSingleProduct,
} from "../../redux/slices/productSlices";
import { addToCart } from "../../redux/slices/cartSlices";
import { addToWishlist, fetchWishlistItems } from "../../redux/slices/wishlistSlices";
import { toast } from "react-toastify";
import SimilarProduct from "./SimilarProduct";
import { Helmet } from "react-helmet-async";




const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { product, loading, error } = useSelector((state) => state.products);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].colorName);
      setSelectedSize(null);
      setSelectedThumbnail(0);
      dispatch(fetchSimilarProducts(product._id));
    }
  }, [product, dispatch]);

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      const params = new URLSearchParams(location.search);
      const selectedImageUrl = params.get("selectedImage");
      if (selectedImageUrl) {
        let found = false;
        product.colors.forEach((color) => {
          if (color.photos && color.photos.length > 0) {
            const index = color.photos.findIndex(
              (photo) => photo.url === selectedImageUrl
            );
            if (index !== -1) {
              setSelectedColor(color.colorName);
              setSelectedThumbnail(index);
              found = true;
            }
          }
        });
        if (!found) {
          setSelectedColor(product.colors[0].colorName);
          setSelectedThumbnail(0);
        }
      }
    }
  }, [location.search, product]);

  const selectedVariant = product?.colors?.find(
    (c) => c.colorName === selectedColor
  );
  const mainImageUrl =
    selectedVariant &&
    selectedVariant.photos &&
    selectedVariant.photos.length > 0
      ? selectedVariant.photos[selectedThumbnail]?.url
      : product?.colors?.[0]?.photos?.[0]?.url ||
        "https://via.placeholder.com/500";

  const showSizes = selectedVariant?.sizes && selectedVariant.sizes.length > 0;
  const showSeamSizes =
    !showSizes &&
    selectedVariant?.seamSizes &&
    selectedVariant.seamSizes.length > 0;

  let currentStock = null;
  if (selectedVariant && selectedSize) {
    if (showSizes) {
      const sizeObj = selectedVariant.sizes.find(
        (s) => s.size === selectedSize
      );
      currentStock = sizeObj ? sizeObj.stock : 0;
    } else if (showSeamSizes) {
      const seamObj = selectedVariant.seamSizes.find(
        (s) => s.seamSize.toString() === selectedSize.toString()
      );
      currentStock = seamObj ? seamObj.stock : 0;
    }
  }

  const buttonLabel = selectedSize
    ? currentStock > 0
      ? "Add to Cart"
      : "Out of Stock"
    : "Select Size";
  const buttonDisabled = !selectedSize || currentStock === 0;

  
  const isDuplicateInCart = product && cartItems.some(
    (item) =>
      item.productId === product._id &&
      String(item.selectedColorName) === String(selectedColor) &&
      String(item.selectedSize) === String(selectedSize) &&
      String(item.selectedSeamSize) ===
        String(showSeamSizes ? selectedSize : null)
  );

  const isDuplicateInWishlist = product && wishlistItems.some(
    (item) =>
      item.productId === product._id &&
      String(item.selectedColorName) === String(selectedColor) &&
      String(item.selectedSize) === String(selectedSize) &&
      String(item.selectedSeamSize) ===
        String(showSeamSizes ? selectedSize : null)
  );

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color before adding to cart.");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }
    if (isDuplicateInCart) {
      toast.info("Product is already in the cart.");
      return;
    }
    const payload = {
      userId: user._id,
      productId: product._id,
      quantity,
      sizes: showSizes ? selectedSize : null,
      seamSizes: showSeamSizes ? selectedSize : null,
      colorName: selectedColor,
    };
    dispatch(addToCart(payload))
      .unwrap()
      .then(() => {
        toast.success("Item added to cart successfully! 🛒");
      })
      .catch((error) => {
        toast.error(error?.message || "Failed to add item to cart.");
      });
  };

  const handleAddToWishlist = () => {
    if (!user) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size or inseam before adding to wishlist.");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color before adding to wishlist.");
      return;
    }

    if (isDuplicateInWishlist) {
      toast.info("Product is already in wishlist.");
      return;
    }
    if (isDuplicateInCart) {
      toast.info("Product is already in cart.");
      return;
    }
    const payload = {
      userId: user._id,
      productId: product._id,
      sizes: showSizes ? selectedSize : null,
      seamSizes: showSeamSizes ? selectedSize : null,
      colorName: selectedColor,
    };
    dispatch(addToWishlist(payload))
      .unwrap()
      .then(() => {
        toast.success("Item added to wishlist!");
        dispatch(fetchWishlistItems(user._id))
      })
      .catch((err) => {
        // err may be a string (from rejectWithValue) or an Error
        const msg = typeof err === "string" ? err : err.message;
        if (msg.toLowerCase().includes("already")) {
          toast.info("Product is already in wishlist.");
        } else {
          toast.error(msg || "Failed to add item to wishlist.");
        }
      });
  };

  if (loading)
    return (
      <>
        <Grid item md={5} sm={8} xs={12} lg={12} height={"100%"}>
          <Stack spacing={"1rem"}>
            {Array.from({ length: 18 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={"2rem"} />
            ))}
          </Stack>
        </Grid>
      </>
    );
  if (error) return <p>Error: {error}</p>;
  if (!product || !product.colors || product.colors.length === 0) {
    return <p>No product found or no images available.</p>;
  }

  const categoryName = product.category?.name || "Category";
  const subCategoryName = product.subcategory?.name || "Subcategory";  





  // SEO Meta and JSON-LD
  const seoTitle = `${product.name} | Your Store`;
  const seoDesc = product.description.replace(/<[^>]+>/g, '').slice(0, 160);
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    // image: variant.photos.map((p) => p.url),
    description: seoDesc,
    sku: product._id,
    brand: product.brand || 'Your Brand',
    offers: {
      '@type': 'Offer',
      // url: productUrl,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.ratings || 0,
      reviewCount: product.numOfReviews || 0,
    },
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:image" content={mainImageUrl} />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
    <div className="product-detailss">
      <div className="product-details__container">
        {/* Image Gallery */}
        <div className="product-details__gallery">
          <div className="product-details__main-image">
            <div className="wishlist">
              <FavoriteBorder onClick={handleAddToWishlist} />
            </div>
            <img src={mainImageUrl} alt="Selected Product" />
          </div>
          {selectedVariant &&
            selectedVariant.photos &&
            selectedVariant.photos.length > 0 && (
              <div className="product-details__thumbnails">
                {selectedVariant.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url}
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumbnail ${
                      selectedThumbnail === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedThumbnail(index)}
                  />
                ))}
              </div>
            )}
        </div>

        {/* Product Information */}
        <div className="product-details__info">
          <nav className="breadcrumb">
            <Link to="/">Home</Link> &gt;{" "}
            <Link to={`/products?category=${product.category?._id}`}>
              {categoryName}
            </Link>{" "}
            &gt;{" "}
            <Link to={`/products?subcategory=${product.subcategory?._id}`}>
              {subCategoryName}
            </Link>{" "}
            &gt; <span>{product.name}</span>
          </nav>
          <h1 className="product-details__title">{product.name}</h1>
          <div className="product-details__reviews">
            <Rating value={product.ratings || 0} readOnly precision={0.5} />
            <span>({product.numOfReviews} Reviews)</span>
          </div>
          <p className="product-details__price">${product.price?.toFixed(2)}</p>

          {/* Choose Color */}
          <div className="product-details__colors">
            <p>Choose Color:</p>
            <div className="product-details__color-options">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  className="color-option"
                  onClick={() => {
                    setSelectedColor(color.colorName);
                    setSelectedSize(null);
                    setSelectedThumbnail(0);
                  }}
                >
                  <img
                    src={
                      color.colorImage
                        ? color.colorImage.url
                        : (color.photos && color.photos[0]?.url) ||
                          "https://via.placeholder.com/30"
                    }
                    alt={color.colorName || `Color ${index + 1}`}
                    className={`color-image ${
                      selectedColor === color.colorName ? "selected" : ""
                    }`}
                  />
                  <span className="color-name">{color.colorName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Size Options */}
          {selectedVariant && (
            <div className="product-details__sizes">
              {showSizes ? (
                <>
                  <p>Choose Size:</p>
                  <div className="product-details__size-options">
                    {selectedVariant.sizes.map((item, index) => (
                      <span
                        key={index}
                        className={`size-box ${
                          selectedSize === item.size ? "selected" : ""
                        } ${item.stock === 0 ? "disabled" : ""}`}
                        onClick={() => {
                          if (item.stock === 0) {
                            toast.error("This size is out of stock");
                          } else {
                            setSelectedSize(item.size);
                          }
                        }}
                      >
                        {item.size}
                      </span>
                    ))}
                  </div>
                </>
              ) : showSeamSizes ? (
                <>
                  <p>Choose Seam Size:</p>
                  <div className="product-details__size-options">
                    {selectedVariant.seamSizes.map((item, index) => (
                      <span
                        key={index}
                        className={`size-box ${
                          selectedSize === item.seamSize ? "selected" : ""
                        } ${item.stock === 0 ? "disabled" : ""}`}
                        onClick={() => {
                          if (item.stock === 0) {
                            toast.error("This seam size is out of stock");
                          } else {
                            setSelectedSize(item.seamSize);
                          }
                        }}
                      >
                        {item.seamSize}
                      </span>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* Quantity */}
          <div className="product-details_quantity">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <button
            className="product-details__add-to-cart"
            disabled={buttonDisabled}
            onClick={handleAddToCart}
          >
            {buttonLabel}
          </button>

          <div className="product-details__description">
            <h3 onClick={() => setDescriptionOpen(!descriptionOpen)}>
              Description
              <span className="toggle-arrow">
                {descriptionOpen ? <Remove /> : <Add />}
              </span>
            </h3>
            {descriptionOpen && (
              <div
                className="description-content"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
          </div>
        </div>
      </div>

      <SimilarProduct />

      {/* Reviews Section */}
      <div className="product-details__reviews-section">
        <h2>Customer Reviews</h2>
        {!product.reviews || product.reviews.length === 0 ? (
          <p>No reviews available.</p>
        ) : (
          product.reviews.map((review) => (
            <ReviewItem key={review._id} review={review} />
          ))
        )}
      </div>
    </div>
    </>
  );
};

export default ProductDetails;

// Helper Component to render individual review with read more functionality
const ReviewItem = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const threshold = 150; // Number of characters before truncation

  const commentText =
    review.comment.length > threshold && !expanded
      ? review.comment.substring(0, threshold) + "..."
      : review.comment;

  return (
    <div className="review" style={{ marginBottom: "1rem" }}>
      <div
        className="review-card"
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          className="review-header"
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <img
            src={
              review.user && review.user.avatar && review.user.avatar.length > 0
                ? review.user.avatar[0].url
                : "/default-user.png"
            }
            alt={review.user && review.user.name ? review.user.name : "User"}
            className="review-user-photo"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #c8102e",
              marginRight: "1rem",
            }}
          />
          <div
            className="review-info"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <span
              className="review-username"
              style={{ fontSize: "1rem", fontWeight: "600", color: "#333" }}
            >
              {review.user && review.user.name ? review.user.name : "Anonymous"}
            </span>
            <Rating
              value={review.rating}
              readOnly
              precision={0.5}
              size="small"
              style={{ marginTop: "0.25rem" }}
            />
          </div>
        </div>
        <p
          className="review-comment"
          style={{
            fontSize: "0.95rem",
            color: "#555",
            lineHeight: "1.45",
            display: "",
          }}
        >
          {commentText}
        </p>
        {review.comment.length > threshold && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            style={{
              background: "none",
              border: "none",
              color: "#c8102e",
              cursor: "pointer",
              padding: 0,
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            Read more...
          </button>
        )}
        {expanded && review.comment.length > threshold && (
          <button
            onClick={() => setExpanded(false)}
            style={{
              background: "none",
              border: "none",
              color: "#c8102e",
              cursor: "pointer",
              padding: 0,
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            Show less
          </button>
        )}
        <span
          className="review-date"
          style={{ fontSize: "0.85rem", color: "#aaa", textAlign: "right" }}
        >
          {new Date(review.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  
  );
};
