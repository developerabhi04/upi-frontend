import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  addCategory,
  addSubCategory,
  deleteCategory,
  deleteSubCategory,
  fetchCategories,
  updateCategory,
  updateSubCategory
} from "../../redux/slices/categorySlices";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import { Skeleton } from "@mui/material";

const Category = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  // State for category inputs
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // State for subcategory inputs
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle Image Selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle Category Submission
  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) return toast.error("Category name cannot be empty!");

    const formData = new FormData();
    formData.append("name", categoryName);
    if (image) {
      formData.append("photos", image);
    }

    if (editingCategory) {
      formData.append("id", editingCategory._id);
      dispatch(updateCategory({ id: editingCategory._id, formData })).then(() => {
        toast.success("Category updated successfully!");
        resetCategoryForm();
      });
    } else {
      dispatch(addCategory(formData)).then(() => {
        toast.success("Category added successfully!");
        resetCategoryForm();
      });
    }
  };

  // Handle Subcategory Submission
  const handleSubcategorySubmit = (e) => {
    e.preventDefault();

    if (!subcategoryName.trim()) return toast.error("Subcategory name cannot be empty!");
    if (!selectedCategory) return toast.error("Please select a category!");

    if (editingSubcategory) {
      dispatch(updateSubCategory({
        id: editingSubcategory._id,
        name: subcategoryName,
        categoryId: selectedCategory
      })).then(() => {
        toast.success("Subcategory updated successfully!");
        resetSubcategoryForm();
      });
    } else {
      dispatch(addSubCategory({ name: subcategoryName, categoryId: selectedCategory })).then(() => {
        toast.success("Subcategory added successfully!");
        resetSubcategoryForm();
      });
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(id)).then(() => toast.success("Category deleted successfully!"));
    }
  };

  // Handle Delete Subcategory
  const handleDeleteSubcategory = (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      dispatch(deleteSubCategory(id)).then(() => toast.success("Subcategory deleted successfully!"));
    }
  };

  // Reset Forms
  const resetCategoryForm = () => {
    setCategoryName("");
    setImage(null);
    setEditingCategory(null);
  };

  const resetSubcategoryForm = () => {
    setSubcategoryName("");
    setSelectedCategory("");
    setEditingSubcategory(null);
  };

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="category-containers">
        {/* CATEGORY MANAGEMENT */}
        <section className="category-section">
          <h2>Manage Categories</h2>

          {/* Add or Edit Category Form */}
          <form onSubmit={handleCategorySubmit} encType="multipart/form-data">
            <input
              type="text"
              placeholder="Enter Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />

            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button type="submit" disabled={!categoryName.trim()}>
              {editingCategory ? "Update Category" : "Add Category"}
            </button>
          </form>

          {/* Category List */}
          {loading ? (
            <Skeleton />
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <ul className="category-list">
              {categories.map((category) => (
                <li key={category._id}>
                  {category.photos?.[0]?.url && (
                    <img
                      src={category.photos[0]?.url}
                      alt={category.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  )}
                  <span>{category.name}</span>
                  <div className="actions">
                    <FaEdit
                      className="edit-icon"
                      onClick={() => {
                        setEditingCategory(category);
                        setCategoryName(category.name);
                        setImage(null);
                      }}
                    />
                    <FaTrash className="delete-icon" onClick={() => handleDeleteCategory(category._id)} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* SUBCATEGORY MANAGEMENT */}
        <section className="subcategory-section">
          <h2>Manage Subcategories</h2>

          {/* Add or Edit Subcategory Form */}
          <form onSubmit={handleSubcategorySubmit}>
            <select required value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter Subcategory Name"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              required
            />
            <button type="submit" disabled={!subcategoryName.trim() || !selectedCategory}>
              {editingSubcategory ? "Update Subcategory" : "Add Subcategory"}
            </button>
          </form>

          {/* Subcategory List */}
          {loading ? (
            <p>Loading subcategories...</p>
          ) : (
            <ul className="subcategory-list">
              {categories.map((category) =>
                category.subcategories?.map((sub) => (
                  <li key={sub._id}>
                    <span>{sub.name} (Under {category.name})</span>
                    <div className="actions">
                      <FaEdit
                        className="edit-icon"
                        onClick={() => {
                          setEditingSubcategory(sub);
                          setSubcategoryName(sub.name);
                          setSelectedCategory(category._id);
                        }}
                      />
                      <FaTrash className="delete-icon" onClick={() => handleDeleteSubcategory(sub._id)} />
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Category;
