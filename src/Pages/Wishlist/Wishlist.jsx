import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlistItems,
  moveToCart,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Grid, Skeleton, Stack } from "@mui/material";
import { Helmet } from "react-helmet-async";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { wishlistItems, isLoading, error } = useSelector(
    (state) => state.wishlist
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlistItems(user._id));
    }
  }, [dispatch, user]);

  const handleRemoveFromWishlist = async (
    productId,
    sizes,
    seamSizes,
    colorName
  ) => {
    try {
      await dispatch(
        removeFromWishlist({
          userId: user._id,
          productId,
          sizes,
          seamSizes,
          colorName,
        })
      ).unwrap();
      toast.success("Item removed from wishlist!");
      // dispatch(fetchWishlistItems(user._id));
    } catch (error) {
      toast.error(error?.message || "Failed to remove item from wishlist");
    }
  };

  const handleMoveToCart = async (item) => {
    if (!user) {
      toast.error("Please log in to move items to your cart.");
      return;
    }

    const payload = {
      userId: user._id,
      productId: item.productId,
      sizes: item.selectedSize || null,
      seamSizes: item.selectedSeamSize || null,
      colorName: item.selectedColorName,
    };
    try {
      await dispatch(moveToCart(payload)).unwrap();

      toast.success("Item moved to cart successfully!");
    } catch (error) {
      console.error("❌ Move to Cart Error:", error);
      toast.error(error?.message || "Failed to move item to cart.");
    }
  };

  if (isLoading)
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
  if (error)
    return (
      <p style={{ paddingTop: "10rem" }}>Error loading wishlist: {error}</p>
    );

  const navigateLink = (id) => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
    navigate(`/product-details/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>My Wishlist | YourSiteName</title>
        <meta
          name="description"
          content="View and manage your wishlist items on YourSiteName. Move items to cart or remove them at any time."
        />
        <link rel="canonical" href="https://www.yoursite.com/wishlist" />
        <meta property="og:title" content="My Wishlist – YourSiteName" />
        <meta
          property="og:description"
          content="Your saved items are here. Shop smarter by moving favorites to your cart."
        />
        <meta property="og:url" content="https://www.yoursite.com/wishlist" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.yoursite.com"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Wishlist",
                item: "https://www.yoursite.com/wishlist"
              }
            ]
          })}
        </script>
        {wishlistItems.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: wishlistItems.map((item, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                url: `https://www.yoursite.com/product-details/${item.productId}`
              }))
            })}
          </script>
        )}
      </Helmet>

    <section className="wishlist-page">
      <div className="container">
        <h1 className="page-heading">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <p>Your wishlist is empty. Start adding your favorite products!</p>
            <button className="shop-now" onClick={() => navigate("/products")}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div
                className="wishlist-card"
                key={`${item.productId}-${item.selectedSize || "noSize"}-${
                  item.selectedSeamSize || "noSeamSize"
                }-${item.selectedColorName}`}
              >
                <div
                  className="wishlist-image"
                  onClick={() => navigateLink(item.productId)}
                >
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                <div className="wishlist-details">
                  <h3>{item.name}</h3>

                  {item.selectedSize && (
                    <p className="item-variant">
                      Size (Top): {item.selectedSize}
                    </p>
                  )}
                  {item.selectedSeamSize && (
                    <p className="item-variant">
                      Seam Size (Bottom): {item.selectedSeamSize}
                    </p>
                  )}
                  <p className="price">${item.price}.00</p>

                  <div className="wishlist-actions">
                    <button
                      className="move-to-cart"
                      onClick={() => handleMoveToCart(item)}
                    >
                      Move to Cart
                    </button>

                    <button
                      className="remove-item"
                      onClick={() =>
                        handleRemoveFromWishlist(
                          item.productId,
                          item.selectedSize,
                          item.selectedSeamSize,
                          item.selectedColorName
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
    </>
  );
};

export default Wishlist;
