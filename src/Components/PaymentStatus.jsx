// frontend/src/components/PaymentStatus.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { server } from '../server.js';

const PaymentStatus = () => {
  const { sessionId } = useParams();
  const [paymentData, setPaymentData] = useState({
    status: 'loading',
    amount: null,
    utr: null,
    timestamp: null
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`${server}/payment/status/${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch status');
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setPaymentData({
            status: 'success',
            amount: data.amount,
            utr: data.utr,
            timestamp: new Date(data.timestamp).toLocaleString()
          });
        } else {
          setPaymentData(prev => ({
            ...prev,
            status: 'pending',
            amount: data.amount
          }));
          
          // Retry after 5 seconds if still pending
          setTimeout(() => checkPaymentStatus(), 5000);
        }
      } catch (err) {
        setError('Failed to verify payment status');
        setPaymentData(prev => ({ ...prev, status: 'error' }));
      }
    };

    if (sessionId) checkPaymentStatus();
  }, [sessionId]);

  return (
    <div className="payment-status-container">
      <h2>Payment Status</h2>
      <div className="status-content">
        {paymentData.status === 'loading' && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Verifying payment status...</p>
          </div>
        )}

        {paymentData.status === 'success' && (
          <div className="success">
            <h3>✅ Payment Successful!</h3>
            <div className="details">
              <p>Amount: ₹{paymentData.amount}</p>
              <p>UTR Number: {paymentData.utr}</p>
              <p>Completed at: {paymentData.timestamp}</p>
            </div>
          </div>
        )}

        {paymentData.status === 'pending' && (
          <div className="pending">
            <div className="loading-spinner"></div>
            <h3>Payment Processing</h3>
            <p>Amount: ₹{paymentData.amount}</p>
            <p>This might take a few minutes...</p>
          </div>
        )}

        {(paymentData.status === 'error' || error) && (
          <div className="error">
            <h3>❌ Payment Verification Failed</h3>
            <p>{error || 'Please contact support with your session ID:'}</p>
            <code>{sessionId}</code>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;