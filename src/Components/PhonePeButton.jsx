import React, { useEffect, useState } from 'react';
import { generateUpiDeeplink } from '../Utils/UpiUtils.js';
import { server } from '../server.js';




const PhonePeButton = ({ amount, orderId }) => {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${server}/api/v1/payment/config`);
        const data = await res.json();
        if (res.ok) setConfig(data);
        else setError(data.error || 'Payment configuration error');
      } catch (err) {
        setError('Payment service unavailable');
      }
    };
    fetchConfig();
  }, []);

  const handlePayment = () => {
    if (!config || error) return;

    const { direct, webFallback } = generateUpiDeeplink({
      payeeVpa: config.payeeVpa,
      payeeName: config.payeeName,
      amount,
      note: `Order ${orderId}`,
      mcc: config.mcc
    });

    window.location.href = direct;
    setTimeout(() => {
      window.location.href = webFallback;
    }, 1000);
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
