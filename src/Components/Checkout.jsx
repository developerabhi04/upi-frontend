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
  const orderId = `ORDER_${Date.now()}`;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${server}/payment/config`);
        if (!res.ok) throw new Error('Failed to fetch config');
        const data = await res.json();
        
        if (!data?.payeeVpa || !data?.payeeName) {
          throw new Error('Merchant configuration incomplete');
        }
        
        setConfig({
          payeeVpa: data.payeeVpa,
          payeeName: data.payeeName,
          mcc: data.mcc || '6012'
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
        body: JSON.stringify({ amount, orderId })
      });

      if (!sessionRes.ok) {
        const errorData = await sessionRes.json();
        throw new Error(errorData.error || 'Payment initiation failed');
      }

      const { sessionId } = await sessionRes.json();
      const upiLinks = generateUpiLink(config, amount, orderId, sessionId);

      // Special handling for IDFC accounts
      const isIdfcAccount = config.payeeVpa.endsWith('@idfcbank');
      
      // App-specific handling
      if (app === 'phonepe' && isIdfcAccount) {
        // PhonePe deep link with special parameters for IDFC
        window.location.href = `phonepe://pay?${new URLSearchParams({
          pa: config.payeeVpa,
          pn: encodeURIComponent(config.payeeName),
          am: amount.toFixed(2),
          tn: `Payment for ${orderId}`.substring(0, 50),
          tr: sessionId,
          cu: 'INR',
          mode: '02',
          orgid: '000393'
        }).toString()}`;
      } 
      else if (app === 'gpay') {
        // Google Pay specific handling
        window.open(`tez://upi/pay?${new URLSearchParams({
          pa: config.payeeVpa,
          pn: encodeURIComponent(config.payeeName),
          am: amount.toFixed(2),
          tn: `Payment for ${orderId}`.substring(0, 50),
          tr: sessionId
        }).toString()}`);
      }
      else {
        // Default UPI handling with IDFC workaround
        const upiParams = new URLSearchParams({
          pa: config.payeeVpa,
          pn: encodeURIComponent(config.payeeName),
          am: amount.toFixed(2),
          tn: `Payment for ${orderId}`.substring(0, 50),
          mc: isIdfcAccount ? '6012' : config.mcc,
          tr: sessionId,
          cu: 'INR',
          ...(isIdfcAccount ? { mode: '02', orgid: '000393' } : {})
        });

        const paymentWindow = window.open(`upi://pay?${upiParams.toString()}`, '_blank');
        
        // Fallback after 1 second
        setTimeout(() => {
          if (!paymentWindow || paymentWindow.closed || paymentWindow.location.href === 'about:blank') {
            window.location.href = `https://upilink.in/pay?${upiParams.toString()}`;
          }
        }, 1000);
      }

      navigate(`/status/${sessionId}`);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading payment options...</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Make a Payment</h2>
      
      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}
      
      <div className="amount-section">
        <label htmlFor="amount">Enter Amount (₹):</label>
        <input
          id="amount"
          value={amount}
          onChange={(e) => setAmount(Math.min(2000, Math.max(1, e.target.value)))}
          placeholder="2000"
        />
      </div>

      {config && (
        <div className="merchant-details">
          <h4>Merchant Information:</h4>
          <p><strong>Name:</strong> {config.payeeName}</p>
          <p><strong>UPI ID:</strong> {config.payeeVpa}</p>
        </div>
      )}

      <div className="payment-options">
        <h4>Select Payment Method:</h4>
        
        <div className="upi-apps">
          <button 
            className={`app-button ${selectedApp === 'phonepe' ? 'selected' : ''}`}
            onClick={() => setSelectedApp('phonepe')}
            disabled={isPaying}
          >
            {/* <img src={PhonePeLogo} alt="PhonePe" /> */}
            PhonePe
          </button>
          
          <button 
            className={`app-button ${selectedApp === 'gpay' ? 'selected' : ''}`}
            onClick={() => setSelectedApp('gpay')}
            disabled={isPaying}
          >
            {/* <img src={GooglePayLogo} alt="Google Pay" /> */}
            Google Pay
          </button>
          
          <button 
            className={`app-button ${selectedApp === 'paytm' ? 'selected' : ''}`}
            onClick={() => setSelectedApp('paytm')}
            disabled={isPaying}
          >
            {/* <img src={PaytmLogo} alt="Paytm" /> */}
            Paytm
          </button>
          
          <button 
            className={`app-button ${selectedApp === 'bhim' ? 'selected' : ''}`}
            onClick={() => setSelectedApp('bhim')}
            disabled={isPaying}
          >
            {/* <img src={BHIMLogo} alt="BHIM" /> */}
            BHIM
          </button>
        </div>

        <button 
          className="pay-now-button"
          onClick={() => handlePayment(selectedApp)}
          disabled={isPaying || !selectedApp}
        >
          {isPaying ? (
            <>
              <span className="spinner-small"></span> Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </button>
      </div>

    
    </div>
  );
};

export default Checkout;