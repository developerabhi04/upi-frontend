import React, { useEffect, useState } from 'react';
import { generateUpiDeeplink } from '../utils/UpiUtils';

const API_URL = 'http://localhost:5000/api/v1/payment/config';

const PhonePeButton = ({ amount, orderId }) => {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(async res => {
        const data = await res.json();
        if (res.ok) {
          setConfig(data);
        } else {
          setError(data.error || 'VPA not configured');
        }
      })
      .catch(() => setError('Server unreachable'));
  }, []);

  const handlePayment = () => {
    if (!config) return;
    const deeplink = generateUpiDeeplink({
      vpa: config.payeeVpa,
      name: config.payeeName,
      amount,
      note: `Order #${orderId}`
    });

    // Try PhonePe first
    window.location.href = deeplink.replace('upi://', 'phonepe://');

    // Fallback after 800ms
    setTimeout(() => {
      window.location.href = deeplink;
    }, 800);
  };

  if (error) {
    return <button disabled>{error}</button>;
  }
  if (!config) {
    return <button disabled>Loading...</button>;
  }

  return (
    <button onClick={handlePayment}>
      Pay ₹{amount} with PhonePe / UPI
    </button>
  );
};

export default PhonePeButton;
