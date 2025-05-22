import { useState, useEffect } from 'react';
import { generateUpiLink } from '../Utils/UpiUtils.js';
import { server } from '../server.js';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState(100); // Default amount
  const [isPaying, setIsPaying] = useState(false);
  const orderId = `ORDER_${Date.now()}`;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${server}/payment/config`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setConfig(data);
      } catch (err) {
        setError('Failed to load payment configuration. Please try again later.');
        console.error('Config load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handlePayment = async () => {
    if (!config) {
      setError('Payment system not configured');
      return;
    }

    if (amount > 2000 || amount <= 0) {
      setError('Amount must be between ₹1 and ₹2000');
      return;
    }

    setIsPaying(true);
    setError('');

    try {
      // Initiate payment session
      const sessionRes = await fetch(`${server}/payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId })
      });

      if (!sessionRes.ok) {
        throw new Error('Failed to initiate payment');
      }

      const { sessionId, payeeVpa, payeeName } = await sessionRes.json();
      
      // Generate UPI link with proper merchant details
      const upiLinks = generateUpiLink(
        { payeeVpa, payeeName, mcc: config.mcc },
        amount,
        orderId,
        sessionId
      );

      // Try to open UPI app directly
      const paymentWindow = window.open(upiLinks.upiIntent, '_blank');
      
      // Fallback mechanism
      setTimeout(() => {
        if (!paymentWindow || paymentWindow.closed || paymentWindow.location.href === 'about:blank') {
          window.location.href = upiLinks.fallbackUrl;
        }
      }, 1000);

      // Navigate to status page
      navigate(`/status/${sessionId}`);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment initiation failed. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading payment options...</div>;

  return (
    <div className="checkout-container">
      <h2>Make a Payment</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="amount-selector">
        <label htmlFor="amount">Amount (₹):</label>
        <input
          id="amount"
          type="number"
          min="1"
          max="2000"
          value={amount}
          onChange={(e) => setAmount(Math.min(2000, Math.max(1, e.target.value)))}
        />
      </div>

      <div className="merchant-info">
        {config && (
          <>
            <p>Merchant: {config.payeeName}</p>
            <p>VPA: {config.payeeVpa}</p>
          </>
        )}
      </div>

      <button 
        onClick={handlePayment} 
        disabled={isPaying || !config}
        className="pay-button"
      >
        {isPaying ? 'Processing...' : 'Pay via UPI'}
      </button>

      {/* <div className="upi-apps">
        <p>Supported UPI Apps:</p>
        <div className="app-icons">
          <img src="/icons/gpay.png" alt="Google Pay" />
          <img src="/icons/phonepe.png" alt="PhonePe" />
          <img src="/icons/paytm.png" alt="Paytm" />
          <img src="/icons/bhim.png" alt="BHIM" />
        </div>
      </div> */}
    </div>
  );
};

export default Checkout;