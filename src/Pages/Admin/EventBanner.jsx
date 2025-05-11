// src/pages/Admin/EventBanner.jsx

import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../Components/Admin/AdminSidebar.jsx";
import { FaCloudUploadAlt, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBanner, deleteBanner, fetchBanners, updateBanner } from "../../redux/slices/BannerEventSlices.js";


const EventBanner = () => {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state) => state.bannerEvent);

  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    description: "",
    banner: null,        // ← single File
  });
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // load on mount
  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  // handle text inputs
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // handle file selection
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, banner: file }));
    setPreviewPhotos([URL.createObjectURL(file)]);
  };

  // submit for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.banner && !isEditing) {
      toast.error("Please upload a banner image.");
      return;
    }

    // build FormData
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("heading", formData.heading);
    payload.append("description", formData.description);
    if (formData.banner) {
      payload.append("banner", formData.banner);
    }

    try {
      if (isEditing) {
        // *** KEY FIX ***: Pass under the key `formData` to match your thunk
        await dispatch(updateBanner({ id: editingId, formData: payload })).unwrap();
        toast.success("Banner updated!");
      } else {
        await dispatch(createBanner(payload)).unwrap();
        toast.success("Banner created!");
      }

      // reload the list
      dispatch(fetchBanners());
      resetForm();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  // reset back to blank
  const resetForm = () => {
    setFormData({ title: "", heading: "", description: "", banner: null });
    setPreviewPhotos([]);
    setIsEditing(false);
    setEditingId(null);
  };

  // prefill form for editing
  const handleEdit = (evt) => {
    setFormData({
      title: evt.title,
      heading: evt.heading,
      description: evt.description,
      banner: null,    // user can optionally upload a new one
    });
    setPreviewPhotos(evt.banner?.url ? [evt.banner.url] : []);
    setIsEditing(true);
    setEditingId(evt._id);
  };

  // delete
  const handleDelete = (id) => {
    if (window.confirm("Delete this banner?")) {
      dispatch(deleteBanner(id));
      toast.success("Deleted!");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="banner-sections">
        <h2>Manage Banner</h2>
        <ToastContainer />

        <form onSubmit={handleSubmit} className="banner-form">
          <div className="input-group">
            <label>Navbar Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter Navbar Title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Banner Heading</label>
            <input
              type="text"
              name="heading"
              placeholder="Enter Banner Heading"
              value={formData.heading}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Banner Description</label>
            <textarea
              name="description"
              placeholder="Enter Banner Description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="upload-section">
            <label className="file-upload">
              <FaCloudUploadAlt className="upload-icon" />
              <span>
                {isEditing ? "Upload new banner (optional)" : "Click to upload banner image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                // only required on create
                required={!isEditing}
              />
            </label>

            <div className="preview-images">
              {previewPhotos.map((src, idx) => (
                <div key={idx} className="preview-container">
                  <img src={src} alt="preview" width={200} />
                  <FaTimes
                    className="remove-icon"
                    onClick={() => {
                      setPreviewPhotos([]);
                      setFormData((prev) => ({ ...prev, banner: null }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <motion.button type="submit" className="add-btn">
            {isEditing ? "Update Banner" : "Add Banner"}
          </motion.button>
        </form>

        <div className="banner-list">
          {loading && <p>Loading…</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {banners.map((evt) => (
            <motion.div
              key={evt._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="banner-item"
            >
              <h3>{evt.title}</h3>
              <h3>{evt.heading}</h3>
              <p>{evt.description}</p>

              {evt.banner?.url && (
                <div
                  className="banner-images"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  <img src={evt.banner.url} alt="Banner" width={300} />
                </div>
              )}

              <motion.button
                className="edit-btn"
                onClick={() => handleEdit(evt)}
              >
                <FaEdit /> Edit
              </motion.button>
              <motion.button
                className="delete-btn"
                onClick={() => handleDelete(evt._id)}
              >
                <FaTrash /> Delete
              </motion.button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EventBanner;
