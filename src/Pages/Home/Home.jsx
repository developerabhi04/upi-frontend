import { Helmet } from 'react-helmet-async';
import Banner from './Banner/Banner';
import NewArrivalProduct from './HomeNewArrivalProduct/NewArrivalProduct';
import SecondBanner from './SecondBanner/SecondBanner';
import Category from './Category/Category';
import ThirdBanner from './ThirdBanner/ThirdBanner';

const Home = () => {
    const siteTitle = 'Home Fem Cartel - Premium Products & Deals';
    const siteDescription = 'Discover the latest in electronics, fashion, home & more. Shop top brands with exclusive deals and free shipping.';
    const siteUrl = 'https://www.yourdomain.com/';
    const siteImage = `${siteUrl}images/og-home.jpg`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": siteTitle,
        "url": siteUrl,
        "description": siteDescription,
        "publisher": {
            "@type": "Organization",
            "name": "Your Store",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}images/logo.png`
            }
        }
    };

    return (
        <>
            <Helmet>
                <title>{siteTitle}</title>
                <meta name="description" content={siteDescription} />
                <meta name="keywords" content="electronics, fashion, home, deals, free shipping" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={siteTitle} />
                <meta property="og:description" content={siteDescription} />
                <meta property="og:url" content={siteUrl} />
                <meta property="og:image" content={siteImage} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:image" content={siteImage} />

                <link rel="canonical" href={siteUrl} />

                {/* JSON-LD Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>
            <Banner />
            <NewArrivalProduct />
            <SecondBanner />
            <Category />
            <ThirdBanner />

        </>
    );
};

export default Home;
