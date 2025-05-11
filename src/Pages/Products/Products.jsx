import { useEffect, useMemo, useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlices";
import { fetchCategories } from "../../redux/slices/categorySlices";
import { useSearchParams } from "react-router-dom";
import { Skeleton, Stack } from "@mui/material";
import { Helmet } from "react-helmet-async";

const Products = () => {
  const dispatch = useDispatch();
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

  const { products, loading: prodLoading } = useSelector(
    (state) => state.products
  );

  const { categories, loading: catLoading } = useSelector(
    (state) => state.categories
  );

  // Compute unique color options from fetched products
  // const colorOptions = useMemo(() => {
  //   const map = {};
  //   products.forEach((prod) => {
  //     prod.colors?.forEach((color) => {
  //       const name = color.colorName;
  //       // choose dedicated colorImage or first photo
  //       const url = color.colorImage?.url || color.photos?.[0]?.url || "";
  //       if (name && !map[name]) {
  //         map[name] = url;
  //       }
  //     });
  //   });
  //   return Object.entries(map).map(([name, url]) => ({ name, url }));
  // }, [products]);

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




const getDefaultFilterUI = (isMobile) => ({
    category: !isMobile,
    sizeAlphabet: !isMobile,
    sizeNumber: false,
    color: false,
    price: false,
  });
  const [filterUI, setFilterUI] = useState(getDefaultFilterUI(window.innerWidth <= 768));



   useEffect(() => {
    const onResize = () => {
      const isMobile = window.innerWidth <= 768;
      setFilterUI(getDefaultFilterUI(isMobile));
    };
    window.addEventListener("resize", onResize);
    // run once on mount
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // UI toggles for filter groups (collapse/expand)
  // const [filterUI, setFilterUI] = useState({
  //   category: true,
  //   sizeAlphabet: true,
  //   sizeNumber: false,
  //   color: false,
  //   price: false,
  // });

  // Fetch products whenever filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  // Fetch categories for filters and lookup
  useEffect(() => {
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





  const siteTitle = 'Our Products – Your Store';
  const siteDescription =
    'Browse our collection of products, filter by category, size, color, price, and more.';
  const siteUrl = window.location.origin + window.location.pathname;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: siteTitle,
    url: siteUrl,
    description: siteDescription,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin + '/' },
        { '@type': 'ListItem', position: 2, name: 'Products', item: siteUrl },
      ],
    },
  };

  return (
    <>
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content="products, shopping, filters, categories" />
      <link rel="canonical" href={siteUrl} />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
    <section className="products-section">
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

export default Products;
