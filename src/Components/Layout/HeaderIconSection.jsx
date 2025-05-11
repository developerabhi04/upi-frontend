import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Clear,
  Person,
  Login,
  Logout,
  PersonAdd,
  Favorite,
  AddShoppingCart,
  ShoppingBag,
  Face,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchLiveSearchProducts } from "../../redux/slices/productSlices";
import { logout } from "../../redux/slices/userSlices";
import { fetchWishlistItems } from "../../redux/slices/wishlistSlices";
import { fetchCartItems } from "../../redux/slices/cartSlices";
import { toast } from "react-toastify";

const IconSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems = [] } = useSelector((state) => state.shopCart);
  const { liveSearchResults, searchLoading } = useSelector(
    (state) => state.products
  );

  // Search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Profile dropdown state
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Initialize wishlist & cart on user change
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlistItems(user.id));
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user]);

  // Update suggestions
  useEffect(() => {
    setSuggestions(liveSearchResults);
  }, [liveSearchResults]);

  // Debounced live search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim())
        dispatch(fetchLiveSearchProducts(searchQuery.trim()));
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, searchQuery]);

  // Close search on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (prod) => {
    navigate(`/product/${prod._id}`);
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/"); 
  };

  return (
    <div className="icon-section">
      {/* Search */}
      {showSearch ? (
        <div className="search-bar" ref={searchRef}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            placeholder="Search..."
          />
          <button onClick={handleSearchSubmit}>
            <Search />
          </button>
          <button className="close-btn" onClick={() => setShowSearch(false)}>
            <Clear />
          </button>
          {(searchLoading || suggestions.length) && (
            <div className="search-suggestions">
              {searchLoading ? (
                <p style={{ padding: "1rem" }}>Loading...</p>
              ) : (
                suggestions.map((p) => (
                  <div
                    className="search-ans"
                    key={p._id}
                    onClick={() => handleSuggestionClick(p)}
                  >
                    {p.image && (
                      <img src={p.image.url || p.image} alt={p.name} />
                    )}
                    <span>{p.name}</span>
                    <div className="clear-div">
                      <button
                        className="clear-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSuggestions((s) =>
                            s.filter((x) => x._id !== p._id)
                          );
                        }}
                      >
                        <Clear />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="search-icon" onClick={() => setShowSearch(true)}>
          <Search />
        </div>
      )}

      {/* Profile */}
      <div className="profile-dropdown-container" ref={profileRef}>
        <div className="icon-link" onClick={() => setShowProfile((v) => !v)}>
          <Person />
        </div>
        {showProfile && (
          <div className="profile-dropdown">
            <ul>
              {user ? (
                <>
                  <li>
                    <Link to="/profile">
                      <Face /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders">
                      <ShoppingBag /> Orders
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>
                      <Logout /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/sign-in">
                      <Login /> Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/sign-up">
                      <PersonAdd /> Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Wishlist & Cart */}
      <Link to="/wishlist" className="icon-link">
        <Favorite />
        <span className="counts">{wishlistItems.length}</span>
      </Link>
      <Link to="/cart" className="icon-link">
        <AddShoppingCart />
        <span className="count">{cartItems.length}</span>
      </Link>
    </div>
  );
};

export default IconSection;
