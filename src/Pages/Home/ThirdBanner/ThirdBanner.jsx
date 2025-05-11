import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchThirdBanners } from "../../../redux/slices/thirdBannerSlices";
import {useNavigate} from "react-router-dom"

const ThirdBanner = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { thirdBanners } = useSelector((state) => (state.thirdbanners));

    useEffect(() => {
        dispatch(fetchThirdBanners())
    }, [dispatch])

    const HandleUrl = () => {
        navigate("/products")
    }

    return (
        <section className="third-banner">
            {thirdBanners.map((banner) => (
                <>
                    <div className="container">
                        <img src={banner.photos[0]?.url} alt="banner" />


                        <div className="new-to-website">
                            <div className="row">
                                <div>
                                    <h2>New to the website?</h2>
                                </div>

                                <div>
                                    <h2>Get familiar, get inspired, and get moving.</h2>
                                </div>

                                <div>
                                    <button onClick={HandleUrl}>Start Here</button>
                                </div>
                            </div>
                        </div>

                        <img src={banner.photos[1]?.url} alt="banners" />

                        {/* <div className="bags-content">
                            <h1>Essentially effortless.</h1>
                            <p>The Leather Alternative Mini Bag - storage and style for everywhere you go.</p>
                            <button>Shop bags</button>
                        </div> */}

                        {/* section img3 */}
                        <div className="img3">
                            <img src={banner.photos[2]?.url} alt="banners" />
                            <div className="contents">
                                <h1>Essentially effortless.</h1>
                                <p>The Leather Alternative Mini Bag - storage and style for everywhere you go.</p>
                                <button onClick={HandleUrl}>Shop bags</button>
                            </div>

                        </div>



                    </div>
                </>
            ))}



        </section>
    )
}

export default ThirdBanner