import { useState, useEffect } from 'react';
import { generateUpiLink } from '../Utils/UpiUtils.js';
import { server } from '../server.js';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState(2000);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${server}/payment/config`);
        const data = await res.json();
        if (!data?.payeeVpa) throw new Error('Merchant not configured');
        setConfig(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePayment = async (app = null) => {
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
      const sessionRes = await fetch(`${server}/payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId: `ORDER_${Date.now()}` })
      });
      if (!sessionRes.ok) {
        const errData = await sessionRes.json();
        throw new Error(errData.error || 'Payment initiation failed');
      }

      // Destructure safeOrderId and sessionId
      const { sessionId, orderId: safeOrderId } = await sessionRes.json();

      const { appLinks, upiIntent, webFallback } = generateUpiLink(
        config,
        amount,
        safeOrderId,
        sessionId
      );

      // Delay slightly so UPI app registers each tap as distinct
      const delay = 1000 + Math.random() * 2000;
      setTimeout(() => {
        if (app === 'phonepe') {
          window.location.href = appLinks.phonepe;
        } else if (app === 'gpay') {
          window.open(appLinks.gpay, '_blank');
        } else if (app === 'paytm') {
          window.location.href = appLinks.paytm;
        } else {
          // default UPI intent
          const win = window.open(upiIntent, '_blank');
          setTimeout(() => {
            if (!win || win.closed || win.location === 'about:blank') {
              window.location.href = webFallback;
            }
          }, 800);
        }
      }, delay);

      navigate(`/status/${sessionId}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) return <div>Loading payment options...</div>;
  if (error)  return <div className="error">{error}</div>;

  return (
    <div className="checkout-container">
      <h2>Make a Payment</h2>
      <div>
        <label>Amount (₹):</label>
        <input
          type="number"
          min="1"
          max="2000"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />
      </div>
      <div>
        <p>Payee: {config.payeeName} ({config.payeeVpa})</p>
      </div>
      <div className="apps">
        {['phonepe','gpay','paytm'].map(app => (
          <button
            key={app}
            onClick={() => setSelectedApp(app)}
            disabled={isPaying}
            className={selectedApp === app ? 'selected' : ''}
          >
            {app.toUpperCase()}
          </button>
        ))}
      </div>
      <button
        onClick={() => handlePayment(selectedApp)}
        disabled={isPaying || !selectedApp}
      >
        {isPaying ? 'Processing…' : 'Pay Now'}
      </button>
    </div>
  );
};

export default Checkout;
