import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCloudUploadAlt, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addCompanyInfo, deleteCompanyInfo, fetchCompanyInfo,  updateCompanyInfo } from "../../../../redux/slices/companyDetailsSlices.js";
import AdminSidebar from "../../../../Components/Admin/AdminSidebar.jsx";



const CompanyInfo = () => {
    const dispatch = useDispatch();
    const { companys, loading } = useSelector((state) => state.company);

    const [formData, setFormData] = useState({
        address: "",
        phone: "",
        email: "",
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        logo: [],
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [previewPhotos, setPreviewPhotos] = useState([]);

    useEffect(() => {
        dispatch(fetchCompanyInfo());
    }, [dispatch]);

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle File Upload
    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, logo: files });

        // ✅ Generate Image Previews
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewPhotos(previews);
    };

    // ✅ Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.logo.length) {
            toast.error("Please upload at least one image.");
            return;
        }

        const data = new FormData();
        data.append("address", formData.address);
        data.append("phone", formData.phone);
        data.append("email", formData.email);
        data.append("facebook", formData.facebook);
        data.append("twitter", formData.twitter);
        data.append("instagram", formData.instagram);
        data.append("linkedin", formData.linkedin);
        if (formData.logo.length > 0) {
            data.append("logo", formData.logo[0]);  // ✅ Ensures single file is sent
        }

        if (isEditing && editingId) {
            // ✅ Ensure `editingId` is properly set before calling update API
            console.log("Updating Company with ID:", editingId); // Debugging log
            dispatch(updateCompanyInfo({ id: editingId, data }))
                .unwrap()
                .then(() => {
                    toast.success("Updated successfully!");
                    resetForm();
                })
                .catch((error) => console.error("Update failed:", error));
        } else {
            // ✅ Add New Company Info
            dispatch(addCompanyInfo(data))
                .unwrap()
                .then(() => {
                    toast.success("Created successfully!");
                    resetForm();
                })
                .catch((error) => console.error("Creation failed:", error));
        }
    
    };

    // ✅ Handle Reset Form after Add/Edit
    const resetForm = () => {
        setFormData({ address: "", phone: "", email: "", facebook: "", twitter: "", instagram: "", linkedin: "", logo: [] });
        setPreviewPhotos([]);
        setIsEditing(false);
        setEditingId(null);
    };

    // ✅ Handle Edit
    const handleEdit = (company) => {
        if (!company || !company._id) {
            console.error("Invalid company info for editing:", company);
            return;
        }

        setFormData({
            address: company.address,
            phone: company.phone,
            email: company.email,
            facebook: company.facebook,
            twitter: company.twitter,
            instagram: company.instagram,
            linkedin: company.linkedin,
            logo: [], // Clear the photos for editing
        });
        setPreviewPhotos(company.logo.map((logo) => logo.url));
        setIsEditing(true);
        setEditingId(company._id);
    };



    // ✅ Handle Banner Deletion
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this Field?")) {
            dispatch(deleteCompanyInfo(id));
            toast.success("Deleted successfully!");
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar />

            <main className="banner-sections">
                <h2>Manage Logo Section</h2>

                {/* ✅ Toast Notification Container */}
                <ToastContainer />

                {/* ✅ Banner Upload Form */}
                <form onSubmit={handleSubmit} className="banner-form">
                    <div className="input-group">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Enter Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>phone</label>
                        <input
                            type="number"
                            name="phone"
                            placeholder="Enter Phone No"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Facebook Link</label>
                        <input
                            type="text"
                            name="facebook"
                            placeholder="Enter Facebook Link"
                            value={formData.facebook}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Instagram Link</label>
                        <input
                            type="text"
                            name="instagram"
                            placeholder="Enter Instagram Link"
                            value={formData.instagram}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Tiktok Link</label>
                        <textarea
                            type="text"
                            name="twitter"
                            placeholder="Enter Tiktok Link"
                            value={formData.twitter}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Youtube Link</label>
                        <textarea
                            type="text"
                            name="linkedin"
                            placeholder="Enter Youtube Link"
                            value={formData.linkedin}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="upload-section">
                        <label className="file-upload">
                            <FaCloudUploadAlt className="upload-icon" />
                            <span>Click to upload Logo images</span>
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
                                            setFormData({ ...formData, logo: formData.logo.filter((_, i) => i !== index) });
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
                        Add
                    </motion.button>
                </form>

                {/* ✅ Banner List */}
                {loading ? (
                    <p className="loading">Loading Profile..</p>
                ) : companys.length === 0 ? (
                    <p className="no-banner">No Profile available.</p>
                ) : (
                    <div className="banner-list">
                        {companys.map((logo) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="banner-item"
                                key={logo._id}
                            >
                                <h3>{logo.address}</h3>
                                <h3>{logo.phone}</h3>
                                <h3>{logo.email}</h3>
                                <h3>{logo.facebook}</h3>
                                <h3>{logo.twitter}</h3>
                                <h3>{logo.instagram}</h3>
                                <h3>{logo.linkedin}</h3>


                                <div className="banner-images">
                                    {logo.logo.map((photo) => (
                                        <img key={photo.public_id} src={photo.url} alt="Banner" width={100} />
                                    ))}
                                </div>


                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="edit-btn"
                                    onClick={() => handleEdit(logo)}
                                >
                                    <FaEdit /> Edit
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="delete-btn"
                                    onClick={() => handleDelete(logo._id)}
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

export default CompanyInfo;
