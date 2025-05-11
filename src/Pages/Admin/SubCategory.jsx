import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTrash, FaEdit } from "react-icons/fa";
import { addSubCategory, deleteSubCategory, fetchCategories,  updateSubCategory } from "../../redux/slices/categorySlices";

const SubCategory = () => {
    const dispatch = useDispatch();
    const { categories, loading } = useSelector((state) => state.categories);

    // State for category and subcategory inputs
    const [subcategoryName, setSubcategoryName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [editingSubcategory, setEditingSubcategory] = useState(null);

    // Fetch categories when component mounts
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    

    // Handle Subcategory Submission
    const handleSubcategorySubmit = (e) => {
        e.preventDefault();
        if (!selectedCategory) {
            toast.error("Please select a category for the subcategory.");
            return;
        }

        if (editingSubcategory) {
            dispatch(updateSubCategory({ id: editingSubcategory._id, name: subcategoryName, categoryId: selectedCategory })).then(() => {
                toast.success("Subcategory updated successfully!");
                setEditingSubcategory(null);
                setSubcategoryName("");
            });
        } else {
            dispatch(addSubCategory({ name: subcategoryName, categoryId: selectedCategory })).then(() => {
                toast.success("Subcategory added successfully!");
                setSubcategoryName("");
            });
        }
    };
  
    // Handle Delete Subcategory
    const handleDeleteSubcategory = (id) => {
        if (window.confirm("Are you sure you want to delete this subcategory?")) {
            dispatch(deleteSubCategory(id)).then(() => toast.success("Subcategory deleted successfully!"));
        }
    };
    return (
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
                <button type="submit">{editingSubcategory ? "Update Subcategory" : "Add Subcategory"}</button>
            </form>

            {/* Subcategory List */}
            {loading ? (
                <p>Loading subcategories...</p>
            ) : (
                <ul className="subcategory-list">
                    {categories.map((category) =>
                        category.subcategories.map((sub) => (
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
    )
}

export default SubCategory