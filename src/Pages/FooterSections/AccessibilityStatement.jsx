import { Helmet } from "react-helmet-async";

const AccessibilityStatement = () => {
    return (
        <>
        <Helmet>
          <title>Accessibility Statement | Fem Cartel</title>
          <meta
            name="description"
            content="Learn about Fem Cartel’s commitment to accessibility and the features we offer to ensure an inclusive online shopping experience for everyone."
          />
          <link
            rel="canonical"
            href="https://www.femcartel.com/accessibility-statement"
          />
          <meta
            property="og:title"
            content="Accessibility Statement – Fem Cartel"
          />
          <meta
            property="og:description"
            content="Discover how Fem Cartel meets WCAG 2.1 AA standards and the tools we provide for an accessible website."
          />
          <meta
            property="og:url"
            content="https://www.femcartel.com/accessibility-statement"
          />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Accessibility Statement",
              "url": "https://www.femcartel.com/accessibility-statement",
              "description":
                "Learn about Fem Cartel’s commitment to accessibility and the features we offer to ensure an inclusive online shopping experience for everyone.",
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://www.femcartel.com"
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Accessibility Statement",
                    item: "https://www.femcartel.com/accessibility-statement"
                  }
                ]
              }
            })}
          </script>
        </Helmet>
        <div className="accessibility-statement">
            <h1 className="title">Accessibility Statement</h1>
            <p className="intro">
                At <strong>Fem Cartel</strong>, we are committed to ensuring that our online shopping experience is accessible to all users, including individuals with disabilities. We strive to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
            </p>

            <div className="content">
                <section className="section">
                    <h2>Our Commitment</h2>
                    <p>
                        We are continuously improving the usability and accessibility of our website to provide an inclusive experience for all users. Our efforts include:
                    </p>
                    <ul>
                        <li>Providing alternative text for images and non-text content.</li>
                        <li>Ensuring keyboard-friendly navigation for all interactive elements.</li>
                        <li>Maintaining sufficient contrast between text and background colors.</li>
                        <li>Designing forms and checkout processes that are easy to use with assistive technologies.</li>
                    </ul>
                </section>

                <section className="section">
                    <h2>Accessibility Features</h2>
                    <p>Our website includes the following accessibility features:</p>
                    <ul>
                        <li>Screen reader compatibility for all key elements.</li>
                        <li>Adjustable font sizes and scalable text for better readability.</li>
                        <li>Support for voice navigation tools.</li>
                        <li>Responsive design for seamless browsing on all devices.</li>
                    </ul>
                </section>

                {/* <section className="section">
                    <h2>Feedback and Support</h2>
                    <p>
                        If you encounter any accessibility barriers while using our website, please let us know so we can address the issue promptly. You can reach out to us via:
                    </p>
                    <ul className="contact-info">
                        <li>Email: support@yourstore.com</li>
                        <li>Phone: +1 (800) 123-4567</li>
                        <li>Live Chat: Available 24/7 on our website</li>
                    </ul>
                </section> */}

                <section className="section">
                    <h2>Third-Party Tools and Content</h2>
                    <p>
                        Some third-party content on our website may not fully comply with accessibility standards. We are actively working with these providers to improve accessibility.
                    </p>
                </section>

                {/* <footer className="footer">
                    Last updated: March 16, 2025
                </footer> */}
            </div>
        </div>
        </>
    );
};

export default AccessibilityStatement;
