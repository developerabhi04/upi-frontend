import { useState } from 'react';// Import Icons
import { Helmet } from 'react-helmet-async';
import { FaChevronDown, FaFontAwesome } from 'react-icons/fa';

const Ordering = () => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const faqData = {
        general: [
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept Visa, MasterCard, American Express, Discover, and PayPal.',
            },
            {
                question: 'How secure is my online order?',
                answer: 'Your online order is highly secure. We use SSL encryption to protect your personal information during transmission.',
            },
        ],
        shipping: [
            {
                question: 'What are the shipping options and delivery times?',
                answer: 'We offer standard, expedited, and express shipping. Delivery times vary based on the option you choose.',
            },
            {
                question: 'How do I track my order after it is shipped?',
                answer: 'Once your order ships, we will send you a tracking number via email, allowing you to monitor its progress.',
            },
        ],
        returns: [
            {
                question: 'What is your return policy for orders?',
                answer: 'We accept returns within 30 days of purchase, provided the items are unused and in their original packaging.',
            },
            {
                question: 'How do I initiate a return for an order?',
                answer: 'To initiate a return, please contact our customer support team. We will provide you with a return authorization number and instructions.',
            },
        ],
        billing: [
            {
                question: 'How can I update my billing information for future orders?',
                answer: 'You can update your billing information in the "My Account" section of our website.',
            },
            {
                question: 'What should I do if I see an error on my billing statement?',
                answer: 'If you notice an error on your billing statement, please contact our support team immediately, and we will investigate the issue.',
            },
        ],
    };

    const filteredQuestions = faqData[activeCategory].filter((faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setSearchTerm('');
        setExpandedQuestion(null);
    };

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    // Build FAQPage structured data
    const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: Object.values(faqData)
            .flat()
            .map(({ question, answer }) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: answer,
                },
            })),
    };


    return (
        <>
            <Helmet>
                <title>Ordering FAQs | Fem Cartel</title>
                <meta
                    name="description"
                    content="Find answers to common questions about ordering, payment, shipping, returns, and billing at Fem Cartel."
                />
                <link
                    rel="canonical"
                    href="https://www.femcartel.com/faq/ordering"
                />
                <meta
                    property="og:title"
                    content="Ordering FAQs – Fem Cartel"
                />
                <meta
                    property="og:description"
                    content="Everything you need to know about ordering, payment options, shipping, and returns."
                />
                <meta
                    property="og:url"
                    content="https://www.femcartel.com/faq/ordering"
                />
                <script type="application/ld+json">
                    {JSON.stringify(faqStructuredData)}
                </script>
            </Helmet>
            <div className="ordering-faq-section">
                <h1 className="ordering-faq-title">Ordering FAQs</h1>

                {/* Categories */}
                <div className="ordering-faq-categories">
                    {Object.keys(faqData).map((category) => (
                        <button
                            key={category}
                            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(category)}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="ordering-faq-items">
                    {filteredQuestions.length > 0 ? (
                        filteredQuestions.map((faq, index) => (
                            <div key={index} className="ordering-faq-item">
                                <h2
                                    className={`ordering-faq-question ${expandedQuestion === index ? 'expanded' : ''}`}
                                    onClick={() => toggleQuestion(index)}
                                >
                                    {faq.question}
                                    <FaFontAwesome icon={FaChevronDown} className="arrow-icon" />
                                </h2>
                                {expandedQuestion === index && (
                                    <p className="ordering-faq-answer">{faq.answer}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No questions found for your search.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Ordering;
