import { useState, useEffect } from 'react';
import { generateUpiLink } from '../Utils/UpiUtils.js';
import { server } from '../server.js';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState(100);
  const [isPaying, setIsPaying] = useState(false);
  const orderId = `ORDER_${Date.now()}`;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${server}/payment/config`);
        if (!res.ok) throw new Error('Failed to fetch config');
        const data = await res.json();
        
        // Validate the required config fields
        if (!data.payeeVpa || !data.payeeName) {
          throw new Error('Merchant configuration incomplete');
        }
        
        setConfig({
          payeeVpa: data.payeeVpa,
          payeeName: data.payeeName,
          mcc: data.mcc || '6012' // Default MCC if not provided
        });
      } catch (err) {
        setError(err.message || 'Failed to load payment configuration');
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
      // Initiate payment session with backend
      const sessionRes = await fetch(`${server}/payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId })
      });

      if (!sessionRes.ok) {
        const errorData = await sessionRes.json();
        throw new Error(errorData.error || 'Payment initiation failed');
      }

      const { sessionId } = await sessionRes.json();
      
      // Generate UPI link with the validated config
      const upiLinks = generateUpiLink(config, amount, orderId, sessionId);

      // Try to open UPI app
      const paymentWindow = window.open(upiLinks.upiIntent, '_blank');
      
      // Fallback if UPI app doesn't open
      setTimeout(() => {
        if (!paymentWindow || paymentWindow.closed || paymentWindow.location.href === 'about:blank') {
          window.location.href = upiLinks.fallbackUrl;
        }
      }, 1000);

      navigate(`/status/${sessionId}`);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) return <div className="loading">Loading payment options...</div>;

  return (
    <div className="checkout">
      <h2>Make Payment</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="amount-field">
        <label>Amount (₹):</label>
        <input
          type="number"
          min="1"
          max="2000"
          value={amount}
          onChange={(e) => setAmount(Math.min(2000, Math.max(1, e.target.value)))}
        />
      </div>

      {config && (
        <div className="merchant-info">
          <p>Merchant: {config.payeeName}</p>
          <p>UPI ID: {config.payeeVpa}</p>
        </div>
      )}

      <button 
        onClick={handlePayment} 
        disabled={isPaying || !config}
        className="pay-button"
      >
        {isPaying ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default Checkout;