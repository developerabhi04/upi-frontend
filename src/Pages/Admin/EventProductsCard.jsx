import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminSidebar from '../../Components/Admin/AdminSidebar.jsx';
import { FaCloudUploadAlt, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createProduct, deleteProduct, fetchProductsEvent, updateProduct } from '../../redux/slices/ProductEventSlices.js';


const EventProductsCard = () => {
  const dispatch = useDispatch();
  const { products: eventProducts, loading, error } = useSelector(
    (state) => state.productEvent
  );

  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    photos: [],
  });
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchProductsEvent());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
    setPreviewPhotos((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const resetForm = () => {
    setFormData({ heading: '', description: '', photos: [] });
    setPreviewPhotos([]);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && formData.photos.length === 0) {
      return toast.error('Please upload at least one image.');
    }

    const payload = new FormData();
    payload.append('heading', formData.heading);
    payload.append('description', formData.description);
    formData.photos.forEach((file) => payload.append('photos', file));

    try {
      if (isEditing) {
        await dispatch(
          updateProduct({ id: editingId, formData: payload })
        ).unwrap();
        toast.success('Product updated!');
      } else {
        await dispatch(createProduct(payload)).unwrap();
        toast.success('Product added!');
      }
      dispatch(fetchProductsEvent());
      resetForm();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleEdit = (prod) => {
    setFormData({ heading: prod.heading, description: prod.description, photos: [] });
    setPreviewPhotos(prod.photos.map((p) => p.url));
    setIsEditing(true);
    setEditingId(prod._id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      dispatch(deleteProduct(id));
      toast.success('Deleted!');
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="banner-sections">
        <h2>Manage Product Cards</h2>
        <ToastContainer />

        <form onSubmit={handleSubmit} className="banner-form">
          <div className="input-group">
            <label>Product Heading</label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              placeholder="Enter heading"
            />
          </div>

          <div className="input-group">
            <label>Product Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </div>

          <div className="upload-section">
            <label className="file-upload">
              <FaCloudUploadAlt />
              <span>
                {isEditing
                  ? 'Upload new images (optional)'
                  : 'Click to upload product images'}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                required={!isEditing}
              />
            </label>

            <div className="preview-images">
              {previewPhotos.map((src, idx) => (
                <div key={idx} className="preview-container">
                  <img src={src} width={200} alt="preview" />
                  <FaTimes
                    className="remove-icon"
                    onClick={() => {
                      setPreviewPhotos((p) => p.filter((_, i) => i !== idx));
                      setFormData((f) => ({
                        ...f,
                        photos: f.photos.filter((_, i) => i !== idx),
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <motion.button type="submit" className="add-btn" disabled={loading}>
          {loading ? 'Uploading...' : isEditing ? 'Update' : 'Add'}
          </motion.button>
        </form>

        <div className="banner-list">
          {loading && <p>Uploading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {eventProducts.map((prod) => (
            <motion.div
              key={prod._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="banner-item"
            >
              <h3>{prod.heading}</h3>
              <p>{prod.description}</p>

              <div className="banner-images">
                {prod.photos.map((p) => (
                  <img key={p.public_id} src={p.url} width={150} alt={prod.heading} />
                ))}
              </div>

              <motion.button
                className="edit-btn"
                onClick={() => handleEdit(prod)}
              >
                <FaEdit /> Edit
              </motion.button>
              <motion.button
                className="delete-btn"
                onClick={() => handleDelete(prod._id)}
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

export default EventProductsCard;
