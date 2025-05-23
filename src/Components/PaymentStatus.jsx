import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { server } from '../server.js';

const PaymentStatus = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState({ status: 'loading' });
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) return navigate('/');

    const check = async () => {
      try {
        const res = await fetch(`${server}/payment/status/${sessionId}`);
        if (!res.ok) throw new Error('Failed to fetch payment status');
        const data = await res.json();
        setPayment(data);

        if (data.status === 'pending' && retry < 10) {
          setTimeout(() => setRetry(r => r + 1), 3000);
        }
      } catch (err) {
        setError(err.message);
        if (retry < 3) {
          setTimeout(() => setRetry(r => r + 1), 5000);
        } else {
          setPayment({ status: 'error' });
        }
      }
    };

    check();
  }, [sessionId, retry, navigate]);

  const retryNow = () => {
    setRetry(0);
    setError('');
    setPayment({ status: 'loading' });
  };

  if (payment.status === 'loading') return <p>Checking payment…</p>;

  if (payment.status === 'pending') {
    return (
      <div>
        <h3>Processing…</h3>
        <p>Amount: ₹{payment.amount}</p>
        <p>Attempt: {retry + 1}/10</p>
      </div>
    );
  }

  if (payment.status === 'success') {
    return (
      <div>
        <h3>✅ Payment Successful!</h3>
        <p><strong>Amount:</strong> ₹{payment.amount}</p>
        <p><strong>To:</strong> {payment.payeeName}</p>
        <p><strong>VPA:</strong> {payment.payeeVpa}</p>
        <p><strong>UTR:</strong> {payment.utr}</p>
        <p><strong>Date:</strong> {new Date(payment.timestamp).toLocaleString()}</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div>
      <h3>❌ Verification Failed</h3>
      <p>{error || 'Unable to verify payment status'}</p>
      <button onClick={retryNow}>Retry</button>
      <button onClick={() => navigate('/')}>Home</button>
    </div>
  );
};

export default PaymentStatus;
