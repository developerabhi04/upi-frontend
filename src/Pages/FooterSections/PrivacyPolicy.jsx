import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy | Fem Cartel</title>
                <meta
                    name="description"
                    content="Read Fem Cartel’s Privacy Policy to learn how we collect, use, share, and protect your personal data in compliance with GDPR, CCPA, and other regulations."
                />
                <link
                    rel="canonical"
                    href="https://www.femcartel.com/privacy-policy"
                />
                <meta property="og:title" content="Privacy Policy – Fem Cartel" />
                <meta
                    property="og:description"
                    content="Learn how Fem Cartel handles your personal information responsibly and securely."
                />
                <meta
                    property="og:url"
                    content="https://www.femcartel.com/privacy-policy"
                />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: "Privacy Policy",
                        url: "https://www.femcartel.com/privacy-policy",
                        description:
                            "Read Fem Cartel’s Privacy Policy to learn how we collect, use, share, and protect your personal data in compliance with GDPR, CCPA, and other regulations.",
                        breadcrumb: {
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                {
                                    "@type": "ListItem",
                                    position: 1,
                                    name: "Home",
                                    item: "https://www.femcartel.com"
                                },
                                {
                                    "@type": "ListItem",
                                    position: 2,
                                    name: "Privacy Policy",
                                    item: "https://www.femcartel.com/privacy-policy"
                                }
                            ]
                        }
                    })}
                </script>
            </Helmet>
            <div className="privacy-policy">
                <h1 className="title">Privacy Policy</h1>
                <p className="intro">
                    At <strong>Fem Catel</strong>, we are committed to protecting your privacy and ensuring that your personal data is handled responsibly. Below, you will find details about our privacy practices.
                </p>

                <div className="policy-content">
                    <section className="section">
                        <h2>Introduction</h2>
                        <p>
                            This Privacy Policy outlines how we collect, use, share, and safeguard your personal information when you visit our website, [insert your website URL], and use our services.
                        </p>
                    </section>

                    <section className="section">
                        <h2>Data Collection</h2>
                        <p>
                            We collect personal information that you provide to us when you use our services or interact with us. This includes:
                        </p>
                        <ul>
                            <li>First and last name</li>
                            <li>Physical or email address</li>
                            <li>Website logins</li>
                            <li>IP address</li>
                            <li>Credit card details (processed securely through third-party gateways)</li>
                        </ul>
                    </section>

                    <section className="section">
                        <h2>Data Usage</h2>
                        <p>
                            We use your data to:
                        </p>
                        <ul>
                            <li>Process transactions and fulfill orders</li>
                            <li>Improve our services and website functionality</li>
                            <li>Send marketing communications (with your consent)</li>
                        </ul>
                    </section>

                    <section className="section">
                        <h2>Data Sharing</h2>
                        <p>
                            We may share your data with third-party service providers to assist in the operation of our business. These providers are contractually obligated to maintain confidentiality and comply with applicable data protection laws.
                        </p>
                    </section>

                    <section className="section">
                        <h2>Cookie Policy</h2>
                        <p>
                            Our website uses cookies to enhance your browsing experience. You can manage cookie settings through your browser preferences.
                        </p>
                    </section>

                    <section className="section">
                        <h2>Security Measures</h2>
                        <p>
                            We implement robust security measures to protect your data from unauthorized access, including SSL encryption for all transactions.
                        </p>
                    </section>

                    <section className="section">
                        <h2>Compliance with Data Protection Laws</h2>
                        <p>
                            Our Privacy Policy is designed to comply with major data protection laws, including GDPR and CCPA.
                        </p>
                    </section>

                    <section className="section">
                        <h2>Changes to This Policy</h2>
                        <p>
                            We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page, and we will notify you via email if you have opted-in for notifications.
                        </p>
                    </section>

                    {/* <section className="section">
                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions or concerns about our Privacy Policy, please contact us at <a href="mailto:support@yourstore.com">support@yourstore.com</a> or +1 (800) 123-4567.
                    </p>
                </section> */}
                </div>

                {/* <footer className="footer">
                Last updated: March 16, 2025
            </footer> */}
            </div>
        </>
    );
};

export default PrivacyPolicy;
