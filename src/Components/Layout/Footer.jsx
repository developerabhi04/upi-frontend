import { Call, Facebook, Instagram, Mail, X, YouTube } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCompanyInfo } from '../../redux/slices/companyDetailsSlices';
import { Link } from 'react-router-dom';
import { logout } from '../../redux/slices/userSlices';



const Footer = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { companys } = useSelector((state) => state.company);


  useEffect(() => {
    dispatch(fetchCompanyInfo())
  }, [dispatch])

  return (
    <>
      {companys.map((company, index) => (

        <div className="footer-section" key={index}>
          <div className="footer-container">

            {/* get-in-touch */}
            <div className="footer-get-in-touch">

              <ul>
                <h1>Contact Us</h1>
                <li>
                  {/*1 */}
                  <span>We’d love to hear from you! For inquiries,
                    collaborations, or support,
                    feel free to reach out using the details below.
                  </span>
                </li>

                {/* 2 */}
                <h1>General Inquiries:</h1>
                <li>
                  <Mail />Email:
                  <span>{company.email}</span>
                </li>

                <li>
                  <Call />Phone:
                  <span>{company.phone}</span>
                </li>

                {/* 3 */}
                {/* <h1>Customer Support:</h1>
                <li>
                  <Mail />Email:
                  <span>support@femcartel.com</span>
                </li> */}

                {/* <li>
                  <Call />Phone
                  <span>(+139) 353-1107</span>
                </li> */}

                {/* <li>
                  <span>Support hours: Monday - Friday | 9:00 AM - 6:00 PM (EST)</span>
                </li> */}


                {/* 4 */}
                {/* <h1>Press & Media:</h1>
                <li>
                  <Mail /> Email:
                  <span>media@femcartel.com</span>
                </li> */}

                {/* <li>
                  <span>For interviews, press releases, and media-related inquiries.</span>
                </li> */}

                {/* 5 */}
                <h1>Collaborations & Partnerships:</h1>
                <li>
                  <Mail /> Email:
                  <span>partnership@femcartel.com</span>
                </li>

                <li>
                  <span>Interested in collaborating? {"Let’s"} create something amazing together.</span>
                </li>
              </ul>
            </div>

            {/* categories */}
            <div className="footer-categories">
              <h1>Help</h1>
              <ul>
                <li>
                  <Link to="/faq">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to={"/accessibility-statement"}>
                    Accessibility Statement
                  </Link>
                </li>
                <li>
                  <Link to={"/services"}>
                    Services
                  </Link>
                </li>
                <li>
                  <Link to={"/ordering"}>
                    Ordering
                  </Link>
                </li>

                <li>
                  <Link to={"/shipping-policy"}>
                    Shipping Policy
                  </Link>
                </li>

                <li>
                  <Link to="/privacy-policy">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* our-policy */}
            <div className="footer-policy">
              <h1>My Account</h1>
              <ul>
                {user && (
                  <>
                    <li>
                      <Link to="/profile">
                        Profile
                      </Link>
                    </li>

                    <li>
                      <Link to="/orders">
                        Order
                      </Link>
                    </li>
                  </>
                )}

                {!user && (
                  <>
                    <li>
                      <Link to="/sign-in">
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link to="/sign-up">
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}


                {/* ✅ Show Logout only when user is logged in */}
                {user && (
                  <li>
                    <Link onClick={() => dispatch(logout())}>
                      Logout
                    </Link>
                  </li>
                )}

              </ul>
            </div>



            {/* follow-us */}
            <div className="footer-follow-us">
              {/* <h1>Our Products</h1>
              <ul>
                <li>
                  <span>About Us</span>
                </li>
                <li>
                  <span>Our Business</span>
                </li>
                <li>
                  <span>Media</span>
                </li>
                <li>
                  <span>Investor</span>
                </li>
                <li>
                  <span>Strategic Sale</span>
                </li>
                <li>
                  <span>Affiliates and Creators</span>
                </li>
                <li>
                  <span>Contact Us</span>
                </li>
                <li>
                  <span>Customer Service</span>
                </li>

              </ul> */}

              <h1>Follow Us</h1>
              <ul>
                <li>
                  <Link to={company.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook />
                    <span>Meta</span>
                  </Link>

                </li>
                <li>
                  <Link to={company.twitter} target="_blank" rel="noopener noreferrer">
                    <X />
                    <span>Tiktok</span>
                  </Link>
                </li>

                <li>
                  <Link to={company.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram />
                    <span>Instagram</span>
                  </Link>
                </li>
                <li>
                  <Link to={company.linkedin} target="_blank" rel="noopener noreferrer">
                    <YouTube />
                    <span>Youtube</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='footer-copyright'>
            <div className='footers-container'>
              {/* right */}
              <div className='footer-copyright-right'>
                <ul>
                  <li>
                    <img src={company.logo[0]?.url} />
                  </li>

                </ul>
              </div>
            </div>
          </div>
        </div>


      ))}

      <footer>
        <div className='footer-copyright'>
          <p>Copyright © 2025. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default Footer