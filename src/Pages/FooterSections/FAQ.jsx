import { useState } from 'react';
import { ArrowDropDown, ArrowRightAlt } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

const FAQ = () => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const faqData = {
        general: [
            {
                question: 'What is your return policy?',
                answer: 'We accept returns within 30 days of purchase. Items must be in original condition.',
            },
            {
                question: 'Do you offer international shipping?',
                answer: 'Yes, we ship to most countries worldwide. Shipping fees may apply.',
            },
        ],
        orders: [
            {
                question: 'How can I track my order?',
                answer: 'Once your order is shipped, you will receive a tracking link via email.',
            },
            {
                question: 'Can I cancel my order?',
                answer: 'Please contact us immediately if you wish to cancel. We will assist if possible.',
            },
        ],
        returns: [
            {
                question: 'How do I initiate a return?',
                answer: 'Contact our customer service to receive a return merchandise authorization (RMA) number.',
            },
            {
                question: 'Do I need to pay for return shipping?',
                answer: 'Yes, unless the return is due to a defective item or our error.',
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

    return (
        <>
            <Helmet>
                <title>FAQ | Fem Cartel</title>
                <meta
                    name="description"
                    content="Frequently Asked Questions about shipping, returns, orders and more at Fem Cartel. Find quick answers here."
                />
                <link rel="canonical" href="https://www.femcartel.com/faq" />
                <meta property="og:title" content="FAQ – Fem Cartel" />
                <meta
                    property="og:description"
                    content="Get answers to your most common questions about orders, returns, shipping, and more at Fem Cartel."
                />
                <meta property="og:url" content="https://www.femcartel.com/faq" />
                <script type="application/ld+json">
                    {JSON.stringify({
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
                    })}
                </script>
            </Helmet>

            <div className="faq-section">
                <h1 className="faq-title">Frequently Asked Questions</h1>



                {/* Categories */}
                <div className="faq-categories">
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
                <div className="faq-items">
                    {filteredQuestions.length > 0 ? (
                        filteredQuestions.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <h2
                                    className={`faq-question ${expandedQuestion === index ? 'expanded' : ''}`}
                                    onClick={() => toggleQuestion(index)}
                                >
                                    {faq.question}
                                    {expandedQuestion === index ? (
                                        <ArrowRightAlt />
                                    ) : (
                                        <ArrowDropDown />
                                    )}
                                </h2>
                                {expandedQuestion === index && (
                                    <p className="faq-answer">{faq.answer}</p>
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

export default FAQ;
