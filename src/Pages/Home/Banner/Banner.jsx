import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBanners } from "../../../redux/slices/bannerSlices";
import { fetchBannerss } from "../../../redux/slices/bannersSlices";

const Banner = () => {
    const dispatch = useDispatch();
    const { banners } = useSelector((state) => state.banners);
    const { banners: bannerss } = useSelector((state) => state.bannerss);

    useEffect(() => {
        dispatch(fetchBanners());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchBannerss());
    }, [dispatch]);



    return (
        <section className="banner-section">
            <div className="banner-container">
                {/* 🚀 Left Content Section */}

                {/* <div className="banner-content">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        loop={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        speed={800}
                    >
                        {banners.flatMap((banner) =>
                            banner.photos.map((photo, index) => (
                                <SwiperSlide key={photo._id}>
                                    <img
                                        src={photo.url}
                                        alt={`Fashion Slide ${index + 1}`}
                                        className="banner-img"
                                    />
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                </div> */}

                {/* 🖼️ Right Image Section - Infinite Slider */}
                <div className="banner-image">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        loop={false}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        speed={800}
                    >
                        {bannerss?.flatMap((bannerss) =>
                            bannerss.photos.map((photo, index) => (
                                <SwiperSlide key={photo._id}>
                                    <img
                                        src={photo.url}
                                        alt={`Fashion Slide ${index + 1}`}
                                        className="banner-img"
                                    />
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                </div>

                <div className="banner-image">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        loop={false}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        speed={800}
                    >
                        {banners.flatMap((banner) =>
                            banner.photos.map((photo, index) => (
                                <SwiperSlide key={photo._id}>
                                    <img
                                        src={photo.url}
                                        alt={`Fashion Slide ${index + 1}`}
                                        className="banner-img"
                                    />
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default Banner;
