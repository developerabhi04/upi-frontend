import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { server } from '../server.js';

const PaymentStatus = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState({
    status: 'loading',
    amount: null,
    utr: null,
    timestamp: null,
    payeeVpa: null,
    payeeName: null
  });
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch(`${server}/payment/status/${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch payment status');
        }

        const data = await response.json();
        
        setPayment({
          status: data.status,
          amount: data.amount,
          utr: data.utr,
          timestamp: data.timestamp,
          payeeVpa: data.payeeVpa,
          payeeName: data.payeeName
        });

        // Continue polling if pending
        if (data.status === 'pending' && retryCount < 10) {
          setTimeout(() => {
            setRetryCount(retryCount + 1);
            checkStatus();
          }, 3000);
        }
      } catch (err) {
        console.error('Status check error:', err);
        setError(err.message);
        
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(retryCount + 1);
            checkStatus();
          }, 5000);
        } else {
          setPayment(prev => ({ ...prev, status: 'error' }));
        }
      }
    };

    checkStatus();

    return () => {
      // Cleanup
    };
  }, [sessionId, retryCount, navigate]);

  const handleRetry = () => {
    setRetryCount(0);
    setPayment(prev => ({ ...prev, status: 'loading' }));
    setError('');
  };

  return (
    <div className="status-container">
      <h2>Payment Status</h2>
      
      {payment.status === 'loading' && (
        <div className="status-loading">
          <div className="spinner"></div>
          <p>Checking payment status...</p>
        </div>
      )}

      {payment.status === 'pending' && (
        <div className="status-pending">
          <div className="spinner"></div>
          <h3>Payment Processing</h3>
          <p>Amount: ₹{payment.amount}</p>
          <p>To: {payment.payeeName} ({payment.payeeVpa})</p>
          <p>This may take a few moments...</p>
          <p>Attempt: {retryCount + 1}/10</p>
        </div>
      )}

      {payment.status === 'success' && (
        <div className="status-success">
          <div className="success-icon">✓</div>
          <h3>Payment Successful!</h3>
          <div className="receipt">
            <p><strong>Amount:</strong> ₹{payment.amount}</p>
            <p><strong>To:</strong> {payment.payeeName}</p>
            <p><strong>VPA:</strong> {payment.payeeVpa}</p>
            <p><strong>UTR:</strong> {payment.utr}</p>
            <p><strong>Date:</strong> {new Date(payment.timestamp).toLocaleString()}</p>
          </div>
          <button onClick={() => navigate('/')} className="home-button">
            Back to Home
          </button>
        </div>
      )}

      {payment.status === 'error' && (
        <div className="status-error">
          <div className="error-icon">✗</div>
          <h3>Payment Verification Failed</h3>
          <p>{error || 'Unable to verify payment status'}</p>
          <p>Session ID: {sessionId}</p>
          
          <div className="action-buttons">
            <button onClick={handleRetry} className="retry-button">
              Retry Verification
            </button>
            <button onClick={() => navigate('/')} className="home-button">
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;