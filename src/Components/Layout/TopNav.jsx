import { Mail, Phone } from "@mui/icons-material";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";

const TopNav = ({ showTopNav }) => {
  // Pull both the list and loading flag from Redux
  const { companys, loading } = useSelector((state) => state.company);

  if (!showTopNav) return null;

  return (
    <nav className="wapper-header">
      {loading
        ? // Single skeleton row
          <div className="nav">
            <div className="nav-div">
              <ul className="nav-ul" style={{ display: 'flex', gap: '1rem' }}>
                <li className="nav-li" style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                  <Phone />
                  <Skeleton width={100} height={20} />
                </li>
                <li className="nav-li" style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                  <Mail />
                  <Skeleton width={150} height={20} />
                </li>
              </ul>
            </div>
            <div className="social-div">
              <ul className="social-media" style={{ display: 'flex', gap: '0.5rem' }}>
                {Array.from({length:4}).map((_, i) => (
                  <li key={i} className="link">
                    <Skeleton variant="circular" width={22} height={22} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        : // Real data
          companys.map((com, idx) => (
            <div className="nav" key={idx}>
              <div className="nav-div">
                <ul className="nav-ul">
                  <li className="nav-li">
                    <Phone />
                    <span className="nav-span">{com.phone || ""}</span>
                  </li>
                  <li className="nav-li">
                    <Mail />
                    <span className="nav-span">{com.email || ""}</span>
                  </li>
                </ul>
              </div>
              <div className="social-div">
                <ul className="social-media">
                  <li className="link" style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                    <a href={com.facebook} target="_blank" rel="noopener noreferrer">
                      <FaFacebook style={{ fontSize: "1rem" }} />
                    </a>
                  </li>
                  <li className="link" style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                    <a href={com.instagram} target="_blank" rel="noopener noreferrer">
                      <FaInstagram style={{ fontSize: "1rem" }} />
                    </a>
                  </li>
                  <li className="link" style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                    <a href={com.twitter} target="_blank" rel="noopener noreferrer">
                      <FaTiktok style={{ fontSize: "1rem" }} />
                    </a>
                  </li>
                  <li className="link" style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                    <a href={com.linkedin} target="_blank" rel="noopener noreferrer">
                      <FaYoutube style={{ fontSize: "1rem" }} />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ))
      }
    </nav>
  );
};

export default TopNav;
