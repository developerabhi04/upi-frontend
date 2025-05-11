import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../Components/Admin/AdminSidebar";
import { toast } from "react-toastify";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { fetchCategories } from "../../../redux/slices/categorySlices";
import { addProduct } from "../../../redux/slices/productSlices";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import Quill styles

const NewProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories } = useSelector((state) => state.categories);
    const { loading, error } = useSelector((state) => state.products);

    // Global product fields
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    // Use ReactQuill for rich text description
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");

    // Color variants state with one default variant including dedicated colour image fields
    const [colorVariants, setColorVariants] = useState([]);
    useEffect(() => {
        setColorVariants([
            {
                colorName: "",
                colorSizes: "",
                colorStocks: "",
                colorSeamSizes: "",
                colorSeamStocks: "",
                files: [], // Additional variant images
                previews: [],
                colorImageFile: null, // Dedicated colour image file
                colorImagePreview: "", // Preview URL for dedicated colour image
            },
        ]);
    }, []);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Handler for dedicated colour image upload
    const handleColorImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setColorVariants((prev) => {
                const newVariants = [...prev];
                newVariants[index].colorImageFile = file;
                newVariants[index].colorImagePreview = preview;
                return newVariants;
            });
        }
        e.target.value = null;
    };

    const removeColorImage = (index) => {
        setColorVariants((prev) => {
            const newVariants = [...prev];
            newVariants[index].colorImageFile = null;
            newVariants[index].colorImagePreview = "";
            return newVariants;
        });
    };

    // Handler for additional variant images upload
    const handleColorVariantFileUpload = (index, e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setColorVariants((prev) => {
            const newVariants = [...prev];
            newVariants[index].files = files;
            newVariants[index].previews = previews;
            return newVariants;
        });
        e.target.value = null;
    };

    const removeColorVariantFile = (variantIndex, fileIndex) => {
        setColorVariants((prev) => {
            const newVariants = [...prev];
            newVariants[variantIndex].previews = newVariants[variantIndex].previews.filter(
                (_, i) => i !== fileIndex
            );
            newVariants[variantIndex].files = newVariants[variantIndex].files.filter(
                (_, i) => i !== fileIndex
            );
            return newVariants;
        });
    };

    const handleColorVariantChange = (index, field, value) => {
        setColorVariants((prev) => {
            const newVariants = [...prev];
            newVariants[index][field] = value;
            return newVariants;
        });
    };

    const addColorVariant = () => {
        setColorVariants((prev) => [
            ...prev,
            {
                colorName: "",
                colorSizes: "",
                colorStocks: "",
                colorSeamSizes: "",
                colorSeamStocks: "",
                files: [],
                previews: [],
                colorImageFile: null,
                colorImagePreview: "",
            },
        ]);
    };

    const removeColorVariant = (index) => {
        setColorVariants((prev) => prev.filter((_, i) => i !== index));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!name || !price || !category || !subcategory || !description) {
            toast.error("Please fill all required fields.");
            return;
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("subcategory", subcategory);
        formData.append("description", description);

        // Append the number of color variants and their respective data
        formData.append("numColorVariants", colorVariants.length);
        colorVariants.forEach((variant, index) => {
            formData.append(`colorName${index}`, variant.colorName || `Color ${index + 1}`);
            formData.append(`colorSizes${index}`, variant.colorSizes || "");
            formData.append(`colorStocks${index}`, variant.colorStocks || "");
            formData.append(`colorSeamSizes${index}`, variant.colorSeamSizes || "");
            formData.append(`colorSeamStocks${index}`, variant.colorSeamStocks || "");
            // Append dedicated colour image if provided
            if (variant.colorImageFile) {
                formData.append(`colorImage${index}`, variant.colorImageFile);
            }
            variant.files.forEach((file) =>
                formData.append(`colorImages${index}`, file)
            );
        });

        dispatch(addProduct(formData)).then((res) => {
            if (!res.error) {
                toast.success("Product created successfully! 🎉");
                setTimeout(() => navigate("/admin/products"), 2000);
            } else {
                toast.error(res.error || "Failed to create product. ❌");
            }
        });
    };

    // React Quill modules and formats (you can customize these as needed)
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "image",
    ];

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="product-container">
                <h2>Create New Product</h2>
                <section className="product-form">
                    <form onSubmit={submitHandler}>
                        <div className="input-group">
                            <label>Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Product Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Price</label>
                            <input
                                required
                                type="number"
                                placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Description</label>
                            {/* Use ReactQuill for rich text description */}
                            <ReactQuill
                                theme="snow"
                                value={description}
                                onChange={setDescription}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Enter product description here..."
                            />
                        </div>
                        <div className="input-group">
                            <label>Category</label>
                            <select
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Subcategory</label>
                            <select
                                required
                                value={subcategory}
                                onChange={(e) => setSubcategory(e.target.value)}
                            >
                                <option value="">Select Subcategory</option>
                                {categories
                                    .find((cat) => cat._id === category)
                                    ?.subcategories.map((sub) => (
                                        <option key={sub._id} value={sub._id}>
                                            {sub.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="color-variants-section">
                            <h3>Color Variants</h3>
                            {colorVariants.map((variant, index) => (
                                <div key={index} className="color-variant">
                                    <div className="variant-header">
                                        <h4>Variant {index + 1}</h4>
                                        {colorVariants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeColorVariant(index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="input-group">
                                        <label>Color Name</label>
                                        <input
                                            type="text"
                                            placeholder={`Enter color name for variant ${index + 1}`}
                                            value={variant.colorName || ""}
                                            onChange={(e) =>
                                                handleColorVariantChange(
                                                    index,
                                                    "colorName",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    {/* Dedicated Colour Image Section */}
                                    <div className="input-group">
                                        <label>Dedicated Colour Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleColorImageUpload(index, e)}
                                        />
                                        {variant.colorImagePreview && (
                                            <div className="preview-container">
                                                <img
                                                    src={variant.colorImagePreview}
                                                    alt={`Dedicated preview for variant ${index + 1}`}
                                                />
                                                <FaTimes
                                                    className="remove-icon"
                                                    onClick={() => removeColorImage(index)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="input-group">
                                        <label>Sizes (comma-separated, e.g., S, M, L)</label>
                                        <input
                                            type="text"
                                            placeholder="E.g. S, M, L, XL"
                                            value={variant.colorSizes || ""}
                                            onChange={(e) =>
                                                handleColorVariantChange(
                                                    index,
                                                    "colorSizes",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Stocks (comma-separated, e.g., 10, 5, 0, 2)</label>
                                        <input
                                            type="text"
                                            placeholder="E.g. 10, 5, 0, 2"
                                            value={variant.colorStocks || ""}
                                            onChange={(e) =>
                                                handleColorVariantChange(
                                                    index,
                                                    "colorStocks",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Seam Sizes (comma-separated, e.g., 28, 30, 32)</label>
                                        <input
                                            type="text"
                                            placeholder="E.g. 28, 30, 32"
                                            value={variant.colorSeamSizes || ""}
                                            onChange={(e) =>
                                                handleColorVariantChange(
                                                    index,
                                                    "colorSeamSizes",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Seam Stocks (comma-separated, e.g., 10, 5, 0)</label>
                                        <input
                                            type="text"
                                            placeholder="E.g. 10, 5, 0"
                                            value={variant.colorSeamStocks || ""}
                                            onChange={(e) =>
                                                handleColorVariantChange(
                                                    index,
                                                    "colorSeamStocks",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="upload-section">
                                        <label className="file-upload">
                                            <FaCloudUploadAlt className="upload-icon" />
                                            <span>Upload additional images for this variant</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => handleColorVariantFileUpload(index, e)}
                                                name={`colorImages${index}`}
                                            />
                                        </label>
                                        <div className="preview-images">
                                            {variant.previews &&
                                                variant.previews.map((src, fileIndex) => (
                                                    <div key={fileIndex} className="preview-container">
                                                        <img src={src} alt={`Variant ${index + 1} preview`} />
                                                        <FaTimes
                                                            className="remove-icon"
                                                            onClick={() =>
                                                                removeColorVariantFile(index, fileIndex)
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addColorVariant}>
                                Add Another Variant
                            </button>
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Product"}
                        </button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </section>
            </main>
        </div>
    );
};

export default NewProduct;
