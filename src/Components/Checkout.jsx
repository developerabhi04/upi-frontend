import { useState, useEffect } from 'react';
import { generateUpiLink } from '../Utils/UpiUtils.js';
import { server } from '../server.js';


const Checkout = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const amount = 1999; // Example amount
  const orderId = `ORDER_${Date.now()}`;

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${server}/payment/config`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setConfig(data);
      } catch (err) {
        setError('Failed to load payment configuration');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

 const handlePayment = async () => {
  try {
    if (amount > 1999) {
      setError('Maximum payment amount is ₹1999');
      return;
    }

    const sessionRes = await fetch(`${server}/payment/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, orderId })
    });
    
    const { sessionId } = await sessionRes.json();
    const links = generateUpiLink(config, amount, orderId, sessionId);

    // Open payment in new tab with fallback
    const paymentWindow = window.open(links.upi, '_blank');
    
    // Fallback handling
    setTimeout(() => {
      if (paymentWindow.closed) return;
      paymentWindow.location.href = `https://upilink.in/${links.upi}`;
    }, 2000);

    // Navigate to status page
    window.location.href = `/status/${sessionId}`;

  } catch (err) {
    setError('Payment initiation failed. Please try again.');
  }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="checkout">
      <h2>Pay ₹{amount}</h2>
      <button onClick={handlePayment} className="pay-button">
        Pay via UPI
      </button>
    </div>
  );
};

export default Checkout;