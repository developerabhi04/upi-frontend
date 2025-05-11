import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../../../Components/Admin/AdminSidebar.jsx";
import { FaCloudUploadAlt, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addSecondBanner, deleteBanner, fetchSecondBanners, updateSecondBanner } from "../../../../redux/slices/secondBannerSlices.js";



const SecondBanner = () => {
    const dispatch = useDispatch();
    const { banners, loading } = useSelector((state) => state.secondBanner);

    const [formData, setFormData] = useState({
        headingOne: "",
        photos: [],
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [previewPhotos, setPreviewPhotos] = useState([]);

    useEffect(() => {
        dispatch(fetchSecondBanners());
    }, [dispatch]);

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle File Upload
    const handlePhotoUpload = (e) => {
        const files = Array.from(e?.target?.files || []);
        setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, ...files]
        }));
        setPreviewPhotos((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    };

    // ✅ Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.photos.length) {
            toast.error("Please upload at least one image.");
            return;
        }

        const data = new FormData();
        data.append("headingOne", formData.headingOne);
        formData.photos.forEach((photo) => data.append("photos", photo));

        try {
            if (isEditing) {
                await dispatch(updateSecondBanner({ id: editingId, data })).unwrap();
                toast.success("Banner updated successfully!");
            } else {
                await dispatch(addSecondBanner(data)).unwrap();
                toast.success("Banner added successfully!");
            }

            // Fetch updated banners immediately to update UI
            dispatch(fetchSecondBanners());
            resetForm();
        } catch (error) {
            toast.error(error || "Something went wrong!");
        }
    };

    // ✅ Handle Reset Form after Add/Edit
    const resetForm = () => {
        setFormData({ headingOne: "", photos: [] });
        setPreviewPhotos([]);
        setIsEditing(false);
        setEditingId(null);
    };

    // ✅ Handle Edit
    const handleEdit = (secondBanner) => {
        setFormData({
            headingOne: secondBanner.headingOne,
            photos: [], // Clear the photos for editing
        });
        setPreviewPhotos(secondBanner.photos.map((photo) => photo.url));
        setIsEditing(true);
        setEditingId(secondBanner._id);
    };



    // ✅ Handle Banner Deletion
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            dispatch(deleteBanner(id));
            toast.success("Banner deleted successfully!");
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar />

            <main className="banner-sections">
                <h2>Manage Second Banner</h2>

                {/* ✅ Toast Notification Container */}
                <ToastContainer />

                {/* ✅ Banner Upload Form */}
                <form onSubmit={handleSubmit} className="banner-form">
                    {banners.length !== 1 && (
                        <div className="input-group">
                            <label> Heading</label>
                            <input
                                type="text"
                                name="headingOne"
                                placeholder="Enter Banner Heading"
                                value={formData.headingOne}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="upload-section">
                        <label className="file-upload">
                            <FaCloudUploadAlt className="upload-icon" />
                            <span>Click to upload banner images</span>
                            <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} required />
                        </label>

                        {/* ✅ Show Uploaded Images */}
                        <div className="preview-images">
                            {previewPhotos.map((src, index) => (
                                <div key={index} className="preview-container">
                                    <img src={src} alt="preview" />
                                    <FaTimes
                                        className="remove-icon"
                                        onClick={() => {
                                            setPreviewPhotos(previewPhotos.filter((_, i) => i !== index));
                                            setFormData({ ...formData, photos: formData.photos.filter((_, i) => i !== index) });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="add-btn"
                    >
                        Add Banner
                    </motion.button>
                </form>

                {/* ✅ Banner List */}
                {loading && <p className="loading">Loading banners...</p>}
                {!loading && banners.length === 0 && <p className="no-banner">No banners available.</p>}
                {!loading && banners.length > 0 && (
                    <div className="banner-list">
                        {banners.map((banner) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="banner-item"
                                key={banner._id}
                            >
                                <h3>{banner.headingOne}</h3>
                                <div className="banner-images-flex">
                                    <div className="banner-images">
                                        {banner.photos.map((photo) => (
                                            <img key={photo.public_id} src={photo?.url} alt="Banner" />
                                        ))}
                                    </div>
                                </div>


                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="edit-btn"
                                    onClick={() => handleEdit(banner)}
                                >
                                    <FaEdit /> Edit
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="delete-btn"
                                    onClick={() => handleDelete(banner._id)}
                                >
                                    <FaTrash /> Delete
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SecondBanner;
