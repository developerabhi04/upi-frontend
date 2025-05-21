// components/PhonePeButton.jsx
import React, { useEffect, useState } from 'react';
import { generateUpiDeeplink } from '../Utils/UpiUtils.js';
import {server} from "../server.js"

const PhonePeButton = ({ amount, orderId }) => {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const res = await fetch(`${server}/payment/verify-config`);
        const { valid } = await res.json();
        if (!valid) throw new Error('Merchant account not configured');
        
        const configRes = await fetch(`${server}/payment/config`);
        setConfig(await configRes.json());
      } catch (err) {
        setError('Valid merchant account required');
      }
    };
    checkConfig();
  }, []);

  const handlePayment = async () => {
    setStatus('processing');
    try {
      const deeplink = generateUpiDeeplink({
        ...config,
        amount,
        note: `Order ${orderId}`,
      });

      window.location.href = deeplink;
      
      // Check payment status every 5 seconds
      const interval = setInterval(async () => {
        const res = await fetch(`${server}/payment/status/${orderId}`);
        const { status } = await res.json();
        
        if (status === 'success') {
          clearInterval(interval);
          setStatus('success');
        }
      }, 5000);

    } catch (err) {
      setStatus('error');
      setError('Payment initiation failed');
    }
  };

  if (error) return <div className="error">{error}</div>;
  
  return (
    <div>
      <button 
        onClick={handlePayment}
        disabled={status === 'processing'}
      >
        {status === 'processing' ? 'Processing...' : `Pay ₹${amount}`}
      </button>
      
      {status === 'success' && <div>Payment successful!</div>}
      {status === 'error' && <div>Payment failed. Please try again.</div>}
    </div>
  );
};


export default PhonePeButton;