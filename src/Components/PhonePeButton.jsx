import React, { useEffect, useState } from 'react';
import { generateUpiDeeplink } from '../Utils/UpiUtils.js';
import { server } from '../server.js';




const PhonePeButton = ({ amount, orderId }) => {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${server}/payment/config`);
        const data = await res.json();
        if (res.ok) setConfig(data);
        else setError(data.error || 'Payment configuration error');
      } catch (err) {
        setError('Payment service unavailable');
      }
    };
    fetchConfig();
  }, []);

  const handlePayment = async () => {
  if (!config) return;

  try {
    // Start payment session
    const sessionRes = await fetch(`${server}/payment/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, orderId })
    });
    
    const { sessionId } = await sessionRes.json();
    
    const deeplink = generateUpiDeeplink({
      payeeVpa: config.payeeVpa,
      payeeName: config.payeeName,
      amount,
      note: `Order:${orderId}|Session:${sessionId}`,
      mcc: config.mcc
    });

    // Open UPI intent
    window.location.href = deeplink;
    
    // Payment verification polling
    const pollStatus = setInterval(async () => {
      const res = await fetch(`${server}/payment/status/${sessionId}`);
      const { status } = await res.json();
      
      if (status === 'success') {
        clearInterval(pollStatus);
        // Handle success
      }
    }, 3000);

  } catch (error) {
    setError('Payment initiation failed');
  }
};

  return (
    <button 
      onClick={handlePayment}
      disabled={!config || error}
      className="payment-button"
    >
      {error || `Pay ₹${amount} via UPI`}
    </button>
  );
};

export default PhonePeButton;
