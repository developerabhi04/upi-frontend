import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlices";
import { fetchCategories } from "../../redux/slices/categorySlices";
import { useSearchParams } from "react-router-dom";
import { Skeleton, Stack } from "@mui/material";
import ProductCard from "../Products/ProductCard";
import { fetchBanners } from "../../redux/slices/BannerEventSlices";
import { fetchProductsEvent } from "../../redux/slices/ProductEventSlices";
import { Helmet } from "react-helmet-async";



const Event = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Initialize filters with keyword and category from the URL
  const initialFilters = {
    keyword: searchParams.get("keyword") || "",
    category: searchParams.get("category")
      ? [searchParams.get("category")]
      : [],
    size: [],
    seamSize: [],
    color: [],
    priceRange: [0, 1000],
    sort: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  const { products, loading: prodLoading } = useSelector((state) => state.products);
  const { banners } = useSelector((state) => state.bannerEvent);
  const { products: eventProduct } = useSelector((state) => state.productEvent);

  const { categories, loading: catLoading } = useSelector((state) => state.categories);




  // Compute unique filter options from fetched products
  const { colorOptions, sizeOptions, seamOptions } = useMemo(() => {
    const colorMap = {};
    const sizeSet = new Set();
    const seamSet = new Set();

    products.forEach((prod) => {
      prod.colors?.forEach((color) => {
        const name = color.colorName;
        const url = color.colorImage?.url || color.photos?.[0]?.url || "";
        if (name && !colorMap[name]) {
          colorMap[name] = url;
        }
        // collect sizes
        color.sizes?.forEach((sz) => sizeSet.add(sz.size));
        // collect seam sizes
        color.seamSizes?.forEach((sz) => seamSet.add(String(sz.seamSize)));
      });
    });

    return {
      colorOptions: Object.entries(colorMap).map(([name, url]) => ({
        name,
        url,
      })),
      sizeOptions: Array.from(sizeSet).sort(),
      seamOptions: Array.from(seamSet).sort((a, b) => Number(a) - Number(b)),
    };
  }, [products]);


  // UI toggles for filter groups (collapse/expand)
  const [filterUI, setFilterUI] = useState({
    category: true,
    sizeAlphabet: true,
    sizeNumber: false,
    color: false,
    price: false,
  });


  // Fetch products whenever filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  // Fetch categories for filters and lookup
  useEffect(() => {
    dispatch(fetchBanners());
    dispatch(fetchProductsEvent());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Toggle UI collapse/expand for filter groups
  const toggleFilterUI = (filter) => {
    setFilterUI((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  // Generic handler for checkbox changes (multi-select filters)
  const handleCheckboxChange = (e, filterKey) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      let updated = prev[filterKey] || [];
      if (checked) {
        updated = [...updated, value];
      } else {
        updated = updated.filter((item) => item !== value);
      }
      return { ...prev, [filterKey]: updated };
    });
  };

  // Handler for price range slider changes
  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], value],
    }));
  };

  // Handler for sort selection changes
  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value }));
  };


  // SEO metadata
  const pageTitle = 'Event Specials & Deals | Your Store';
  const pageDesc = 'Explore our limited-time event collections featuring exclusive banners and product campaigns.';
  const pageUrl = window.location.href;
  const ogImage = banners[0]?.banner?.url || window.location.origin + '/og-event.jpg';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin + '/' },
      { '@type': 'ListItem', position: 2, name: 'Event', item: pageUrl },
    ],
  };


  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <link rel="canonical" href={pageUrl} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <section className="products-sections">
        <section className="event-page">
          {/* Hero Banner */}
          {banners.map((event) => (
            <div className="event-hero" key={event.id}>
              <img src={event?.banner?.url} alt="Event Hero" />
              <div className="hero-overlay">
                <h1>{event.heading}</h1>
                <p>{event.description}</p>
              </div>
            </div>
          ))}


          {/* Campaign Strip */}
          <div className="event-campaign-strip">
            {eventProduct.map((b, i) => (
              <div
                key={i}
                className="campaign-card"
                onClick={() => navigate("/products")}
              >
                <img src={b.photos[0]?.url} alt={b.title} />
                <div className="campaign-overlay">
                  <h4>{b.heading}</h4>
                  <span>{b.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="container">
          {/* Filter Sidebar */}
          <aside className="filter-sidebar">
            <h2>Filters</h2>

            {/* Category Filter */}
            <div className="filter-group">
              <h3 onClick={() => toggleFilterUI("category")}>
                Category {filterUI.category ? <Remove /> : <Add />}
              </h3>
              {filterUI.category && (
                <ul className="filter-options">
                  {catLoading ? (
                    <>
                      <Skeleton />
                      <Skeleton />
                    </>
                  ) : (
                    categories.map((cat) => (
                      <label key={cat._id}>
                        <input
                          type="checkbox"
                          value={cat._id}
                          onChange={(e) => handleCheckboxChange(e, "category")}
                          // Check if this category is already selected
                          checked={filters.category.includes(cat._id)}
                        />{" "}
                        {cat.name}
                      </label>
                    ))
                  )}
                </ul>
              )}
            </div>

            {/* Size Filter */}
            <div className="filter-group">
              <h3 onClick={() => toggleFilterUI("sizeAlphabet")}>
                Size {filterUI.sizeAlphabet ? <Remove /> : <Add />}
              </h3>
              {filterUI.sizeAlphabet && (
                <div className="filter-options sizes">
                  {sizeOptions.map((size) => (
                    <label key={size}>
                      <input
                        type="checkbox"
                        value={size}
                        onChange={(e) => handleCheckboxChange(e, "size")}
                        checked={filters.size.includes(size)}
                      />{" "}
                      {size}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Inseam Size Filter */}
            <div className="filter-group">
              <h3 onClick={() => toggleFilterUI("sizeNumber")}>
                Inseam Size {filterUI.sizeNumber ? <Remove /> : <Add />}
              </h3>
              {filterUI.sizeNumber && (
                <div className="filter-options sizes">
                  {seamOptions.map((inseam) => (
                    <label key={inseam}>
                      <input
                        type="checkbox"
                        value={inseam}
                        onChange={(e) => handleCheckboxChange(e, "seamSize")}
                        checked={filters.seamSize.includes(inseam)}
                      />{" "}
                      {inseam}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="filter-group">
              <h3 onClick={() => toggleFilterUI("color")}>
                Color {filterUI.color ? <Remove /> : <Add />}
              </h3>
              {filterUI.color && (
                <div className="filter-options colors">
                  {colorOptions.length === 0 ? (
                    <p>No colors available</p>
                  ) : (
                    colorOptions.map((col) => (
                      <label
                        key={col.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="checkbox"
                          value={col.name}
                          onChange={(e) => handleCheckboxChange(e, "color")}
                          checked={filters.color.includes(col.name)}
                        />
                        <img
                          src={col.url}
                          alt={col.name}
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <span>{col.name}</span>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h3 onClick={() => toggleFilterUI("price")}>
                Price {filterUI.price ? <Remove /> : <Add />}
              </h3>
              {filterUI.price && (
                <div className="price-range">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={handlePriceChange}
                  />
                  <div className="price-values">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Products and Sort */}
          <div className="products-section-main">
            <div className="sort-bar">
              <h3>All Items</h3>
              <label>Sort by:</label>
              <select onChange={handleSortChange} value={filters.sort}>
                <option value="">Featured</option>
                <option value="createdAt">New Arrivals</option>
                <option value="averageRating">Top Rated</option>
                <option value="-price">Price: High to Low</option>
                <option value="price">Price: Low to High</option>
              </select>
            </div>

            <div className="products-grid">
              {prodLoading ? (
                <>
                  <Stack spacing={"1rem"}>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <Skeleton key={index} variant="rounded" height={"2rem"} />
                    ))}
                  </Stack>
                  <Stack spacing={"1rem"}>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <Skeleton key={index} variant="rounded" height={"2rem"} />
                    ))}
                  </Stack>
                  <Stack spacing={"1rem"}>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <Skeleton key={index} variant="rounded" height={"2rem"} />
                    ))}
                  </Stack>
                </>
              ) : products.length === 0 ? (
                <p>No products found</p>
              ) : (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Event;
