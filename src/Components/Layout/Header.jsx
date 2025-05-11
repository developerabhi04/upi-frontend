// src/Components/Layout/Header.jsx
import  { useState, useEffect, useRef, Fragment } from "react";
import { Link, Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanyInfo,
} from "../../redux/slices/companyDetailsSlices";
import { fetchWishlistItems } from "../../redux/slices/wishlistSlices";
import { fetchCartItems } from "../../redux/slices/cartSlices";
import { fetchCategories } from "../../redux/slices/categorySlices";
import { fetchBanners } from "../../redux/slices/BannerEventSlices";

import TopNav from "./TopNav";
import IconSection from "./HeaderIconSection";

import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.user);
  const { companys } = useSelector((s) => s.company);
  const { categories } = useSelector((s) => s.categories);
  const { banners } = useSelector((s) => s.bannerEvent);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Desktop hover dropdown
  const [hoveredCat, setHoveredCat] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hoverTimeout = useRef(null);

  // Mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);

  useEffect(() => {
    dispatch(fetchCompanyInfo());
    dispatch(fetchWishlistItems(user?._id));
    dispatch(fetchCartItems(user?._id));
    dispatch(fetchCategories());
    dispatch(fetchBanners());
  }, [dispatch, user?._id]);

  // Desktop hover handlers
  const onMouseEnter = (catId) => {
    clearTimeout(hoverTimeout.current);
    setHoveredCat(catId);
    setDropdownOpen(true);
  };
  const onMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
      setHoveredCat(null);
    }, 150);
  };

  // Mobile category expand/collapse
  const handleExpand = (catId) => {
    setExpandedCat((prev) => (prev === catId ? null : catId));
  };

  return (
    <header>
      <TopNav showTopNav={true} companys={companys} />

      <div className="Header">
        <div className="Header-container">
          {/* Logo */}
          <div className="logo">
            <Link to="/">
              {companys.map((c) =>
                c.logo[0]?.url ? (
                  <img
                    key={c._id}
                    src={c.logo[0].url}
                    alt={c.name || "Logo"}
                  />
                ) : null
              )}
            </Link>
          </div>

          {/* Desktop nav stays unchanged */}
          {!isMobile && (
            <nav className="middle">
              <ul className="nav-list">
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    className="nav-item"
                    onMouseEnter={() => onMouseEnter(cat._id)}
                    onMouseLeave={onMouseLeave}
                  >
                    <Link to={`/products?category=${cat._id}`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li className="nav-item active">
                  {banners.map((evt) => (
                    <Link to="/event-campaign" key={evt._id}>
                      {evt.title}
                    </Link>
                  ))}
                </li>
              </ul>
            </nav>
          )}

          {/* Right‐hand icons */}
          <IconSection />

          {/* Mobile menu button */}
          {/* {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ ml: 1 }}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          )} */}

          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen((prev) => !prev)}
              sx={{ ml: 1 }}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
            >
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </div>

        {/* Desktop subcategory dropdown */}
        {!isMobile && dropdownOpen && hoveredCat && (
          <div
            className="full-width-dropdown open"
            onMouseEnter={() => onMouseEnter(hoveredCat)}
            onMouseLeave={onMouseLeave}
          >
            <div className="dropdown-content">
              <div className="dropdown-sections">
                {(
                  categories.find((c) => c._id === hoveredCat)
                    ?.subcategories || []
                ).map((sub) => (
                  <div className="dropdown-section" key={sub._id}>
                    <h4>{sub.name}</h4>
                    <ul>
                      <li>
                        <Link to={`/products?subcategory=${sub._id}`}>
                          Shop {sub.name}
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            top: 0,
            height: "100vh",
            zIndex: (theme) => theme.zIndex.appBar + 1,
          },
        }}
        ModalProps={{
          keepMounted: true, // better performance on mobile
        }}
      >
        <Box sx={{ width: 280, p: 2, pt: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {categories.map((cat) => (
              <Fragment key={cat._id}>
                <ListItem button onClick={() => handleExpand(cat._id)}>
                  <ListItemText primary={cat.name} />
                  {expandedCat === cat._id ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  in={expandedCat === cat._id}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {cat.subcategories.map((sub) => (
                      <ListItem
                        key={sub._id}
                        button
                        sx={{ pl: 4 }}
                        component={Link}
                        to={`/products?subcategory=${sub._id}`}
                        onClick={() => setDrawerOpen(false)}
                      >
                        <ListItemText sx={{
                          color: "#c8102e",
                          textDecoration: "none",
                          
                        }} primary={sub.name} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Fragment>
            ))}

            {/* Optional: event campaigns in mobile menu */}
            <ListItem>
              <ListItemText
                primary={
                  <Box>
                    {banners.map((evt) => (
                      <MuiLink
                        key={evt._id}
                        component={RouterLink}
                        to="/event-campaign"
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                          color: "#c8102e",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" }
                        }}
                      >
                        {evt.title}
                      </MuiLink>
                    ))}
                  </Box>
                }
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </header>
  );
};

export default Header;
