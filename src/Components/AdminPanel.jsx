import { useState, useEffect } from 'react';
import { server } from '../server.js';

const AdminPanel = () => {
  const [form, setForm] = useState({
    payeeVpa: '',
    payeeName: '',
    mcc: '6012',
    gstin: '',
    merchantCategory: 'RETAIL'
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch(`${server}/payment/config`);
        const data = await res.json();
        if (data && !data.error) {
          setForm({
            payeeVpa: data.payeeVpa || '',
            payeeName: data.payeeName || '',
            mcc: data.mcc || '6012',
            gstin: data.gstin || '',
            merchantCategory: data.merchantCategory || 'RETAIL'
          });
        }
      } catch (err) {
        setMessage({ text: 'Failed to load configuration', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate VPA format
      if (!/^\d{10}@idfcbank$/.test(form.payeeVpa)) {
        throw new Error('VPA must be 10 digits followed by @idfcbank');
      }

      const res = await fetch(`${server}/payment/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setMessage({ text: 'Configuration saved successfully!', type: 'success' });
      } else {
        throw new Error(result.error || 'Failed to save configuration');
      }
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading-spinner">Loading configuration...</div>;

  return (
    <div className="admin-container">
      <h2>Merchant Configuration</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="config-form">
        <div className="form-group">
          <label>Merchant VPA (IDFC Bank):</label>
          <input
            type="text"
            value={form.payeeVpa}
            onChange={(e) => setForm({...form, payeeVpa: e.target.value})}
            placeholder="e.g. 9876543210@idfcbank"
            pattern="\d{10}@idfcbank"
            required
          />
          <small>Must be 10 digits followed by @idfcbank</small>
        </div>

        <div className="form-group">
          <label>Merchant Name:</label>
          <input
            type="text"
            value={form.payeeName}
            onChange={(e) => setForm({...form, payeeName: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>MCC Code:</label>
          <select
            value={form.mcc}
            onChange={(e) => setForm({...form, mcc: e.target.value})}
            required
          >
            <option value="6012">6012 - Financial Services</option>
            <option value="6051">6051 - Non-FI Money Services</option>
            <option value="6211">6211 - Security Brokers</option>
          </select>
        </div>

        <div className="form-group">
          <label>Merchant Category:</label>
          <select
            value={form.merchantCategory}
            onChange={(e) => setForm({...form, merchantCategory: e.target.value})}
            required
          >
            <option value="RETAIL">Retail</option>
            <option value="EDUCATION">Education</option>
            <option value="SERVICES">Services</option>
          </select>
        </div>

        <div className="form-group">
          <label>GSTIN (Optional):</label>
          <input
            type="text"
            value={form.gstin}
            onChange={(e) => setForm({...form, gstin: e.target.value})}
            placeholder="22AAAAA0000A1Z5"
          />
        </div>

        <button type="submit" disabled={isLoading} className="save-button">
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>

      <div className="instructions">
        <h3>Configuration Instructions:</h3>
        <ol>
          <li>Ensure your IDFC Bank account is enabled for UPI merchant payments</li>
          <li>Contact IDFC Bank to activate your account as a merchant account</li>
          <li>Select the appropriate MCC code for your business type</li>
          <li>Test with small amounts (₹1-₹10) before processing real payments</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminPanel;