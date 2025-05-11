import { useState } from "react";
import {
  AdminPanelSettings,
  Dashboard,
  PersonPin,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

const Profile = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  // Default Google profile picture URL format
  const googleProfilePicture = user?.avatar.url;

  // console.log(googleProfilePicture);

  const [activeSection, setActiveSection] = useState("profile"); // Default section

  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: googleProfilePicture || user?.avatar[0]?.url, // Get avatar URL or default
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // alert("Changes saved successfully!");
  };

  const navigateLink = () => {
    navigate("/admin/dashboard");
  };


   // SEO metadata
   const pageTitle = 'My Profile | Your Store';
   const pageDescription = `Manage your account details, view and update your profile information at Your Store.`;
   const pageUrl = window.location.href;
 
   const breadcrumbSchema = {
     '@context': 'https://schema.org',
     '@type': 'BreadcrumbList',
     itemListElement: [
       { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin + '/' },
       { '@type': 'ListItem', position: 2, name: 'Profile', item: pageUrl },
     ],
   };
 
   const personSchema = {
     '@context': 'https://schema.org',
     '@type': 'Person',
     name: user.name,
     email: user.email,
     image: updatedUser.avatar,
     url: pageUrl,
   };
 


  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email ID</label>
              <input
                type="text"
                name="email"
                value={updatedUser.email}
                disabled
              />
            </div>
            {/* <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={updatedUser.phone}
                onChange={handleChange}
              />
            </div> */}
            <button type="submit" className="save-changes">
              Save Changes
            </button>
          </form>
        );

      case "address":
        return (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={user.address}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
            <button type="submit" className="save-changes">
              Save Address
            </button>
          </form>
        );

      case "changePassword":
        return (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" name="currentPassword" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" name="confirmPassword" />
            </div>
            <button type="submit" className="save-changes">
              Change Password
            </button>
          </form>
        );

      case "forgotPassword":
        return (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={user.email} disabled />
            </div>
            <button type="submit" className="save-changes">
              Reset Password
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>
    <section className="profile-page">
      <div className="container">
        <h1 className="page-heading">My Profile</h1>

        <div className="profile-section">
          {/* Left Section */}
          <div className="profile-left">
            <h2>Profile</h2>
            <div className="profile-photo">
              <img src={updatedUser.avatar} alt="" />
              {/* <button className="update-photo">Change Photo</button> */}
            </div>

            <div className="profile-info">{renderSection()}</div>
          </div>

          {/* Right Section */}
          <div className="profile-right">
            <h2>Account Options</h2>
            <ul>
              <li onClick={() => setActiveSection("profile")}>
                <PersonPin />
                Profile
              </li>
              {/* <li onClick={() => setActiveSection("address")}>
                <Home />
                Address
              </li>
              <li onClick={() => setActiveSection("changePassword")}>
                <LockOpen /> Change Password
              </li>
              <li onClick={() => setActiveSection("forgotPassword")}>
                <LockReset /> Forgotten Password
              </li> */}
            </ul>

            {user?.role === "admin" && (
              <div className="admin-section">
                <h3>
                  <AdminPanelSettings /> Admin Dashboard
                </h3>
                <ul>
                  <li onClick={navigateLink}>
                    <Dashboard /> Manage Admin
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Profile;
