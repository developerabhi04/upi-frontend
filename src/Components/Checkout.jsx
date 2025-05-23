import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { server } from '../server.js';
import phonepeIcon from '../assets/images.png';
import payTmIcon from '../assets/unnamed.png';
import googlePayIcon from '../assets/8dece15cc40aaf66ed47f6591b639d06.jpg';
import bhimIcon from '../assets/images (1).png';
import "./Checkout.css";

const Checkout = () => {
  const [state, setState] = useState({
    config: null,
    amount: 2000,
    selectedApp: null,
    loading: true,
    error: '',
    isProcessing: false,
    sessionData: null
  });
  const navigate = useNavigate();

  // Map app keys to their imported icons
  const appIcons = {
    phonepe: phonepeIcon,
    paytm: payTmIcon,
    gpay: googlePayIcon,
    bhim: bhimIcon
  };

  useEffect(() => {
    const loadMerchantConfig = async () => {
      try {
        const response = await fetch(`${server}/payment/config`);
        const configData = await response.json();

        if (!response.ok) throw new Error(configData.error || 'Invalid merchant configuration');
        if (!configData.payeeVpa) throw new Error('Merchant UPI ID not configured');

        setState(prev => ({
          ...prev,
          config: configData,
          loading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }));
      }
    };

    loadMerchantConfig();
  }, []);

  const handleAmountChange = (value) => {
    const clampedValue = Math.min(2000, Math.max(1, Number(value)));
    setState(prev => ({ ...prev, amount: clampedValue }));
  };

  const initiatePaymentSession = async () => {
    try {
      const orderId = `ORD_${Date.now()}_${window.crypto.randomUUID().slice(0, 6)}`;
      
      const response = await fetch(`${server}/payment/initiate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add if using auth
        },
        body: JSON.stringify({
          amount: Number(state.amount), // Ensure numeric value
          orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment initiation failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Payment initialization error: ${error.message}`);
    }
  };


  const handleAppPayment = async (app) => {
    try {
      setState(prev => ({ ...prev, isProcessing: true, error: '' }));

      // Step 1: Create payment session with backend
      const sessionData = await initiatePaymentSession();
      
      // Step 2: Generate platform-specific UPI links
      const upiParams = new URLSearchParams({
        pa: sessionData.payeeVpa,
        pn: encodeURIComponent(sessionData.payeeName),
        am: sessionData.amount.toFixed(2),
        tn: `Payment-${sessionData.orderId}`.substring(0, 50),
        tr: sessionData.sessionId,
        cu: 'INR',
        mc: '6012', // Force MCC for IDFC
        mode: '02',
        orgid: '000393'
      });

      // Step 3: Handle app-specific deep links
      const appUrls = {
        phonepe: `phonepe://pay?${upiParams}`,
        gpay: `tez://upi/pay?${upiParams}`,
        paytm: `paytmmp://pay?${upiParams}`,
        bhim: `upi://pay?${upiParams}`
      };

      // Step 4: Open payment app
      const popup = window.open(appUrls[app], '_blank');
      
      // Fallback handling
      setTimeout(() => {
        if (!popup || popup.closed) {
          window.location.href = `https://upilink.in/pay?${upiParams}`;
        }
      }, 2500);

      // Step 5: Navigate to status page
      navigate(`/status/${sessionData.sessionId}`);

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message.replace('Payment initialization error: ', ''),
        isProcessing: false
      }));
    }
  };


  if (state.loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading merchant configuration...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Configuration Error</h3>
        <p>{state.error}</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Secure UPI Payment</h1>

      <div className="amount-section">
        <label htmlFor="amountInput">Amount (₹)</label>
        <input
          id="amountInput"
          type="number"
          min="1"
          max="2000"
          value={state.amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          disabled={state.isProcessing}
        />
      </div>

      <div className="merchant-info">
        <h3>Merchant Details</h3>
        <p>Name: {state.config.payeeName}</p>
        <p>UPI ID: {state.config.payeeVpa}</p>
        {state.config.gstin && <p>GSTIN: {state.config.gstin}</p>}
      </div>

      <div className="payment-methods">
        <h3>Select Payment App</h3>
        <div className="app-buttons">
          {['phonepe', 'gpay', 'paytm', 'bhim'].map(app => (
            <button
              key={app}
              className={`app-button ${state.selectedApp === app ? 'selected' : ''}`}
              onClick={() => setState(prev => ({ ...prev, selectedApp: app }))}
              disabled={state.isProcessing}
              
            >
              <img
                src={appIcons[app]}
                alt={`${app} logo`}
                className="app-logo"
                
              />
              {app.charAt(0).toUpperCase() + app.slice(1)}
            </button>
          ))}
        </div>

        <button
          className="pay-button"
          onClick={() => handleAppPayment(state.selectedApp)}
          disabled={!state.selectedApp || state.isProcessing}
        >
          {state.isProcessing ? (
            <>
              <span className="processing-spinner"></span>
              Initiating Payment...
            </>
          ) : (
            'Proceed to Pay'
          )}
        </button>
      </div>

      {state.error && (
        <div className="transaction-error">
          <p>❌ {state.error}</p>
          <button onClick={() => setState(prev => ({ ...prev, error: '' }))}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
