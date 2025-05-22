// src/Components/AdminVpaConfig.jsx
import { useState } from 'react';
import { server } from '../server.js';


const AdminVpaConfig = () => {
  const [formData, setFormData] = useState({
    payeeVpa: '9599516256@idfcbank',
    payeeName: '',
    mcc: '6012',
    isMerchantAccount: true,
    gstin: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Saving...');
    
    try {
      const res = await fetch(`${server}/api/v1/payment/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      setMessage(res.ok ? 'Configuration saved!' : data.error || 'Save failed');
    } catch (err) {
      setMessage('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="config-form">
      <div className="form-group">
        <label>Merchant VPA:</label>
        <input
          value={formData.payeeVpa}
          onChange={(e) => setFormData({...formData, payeeVpa: e.target.value})}
          pattern="^[0-9]{10}@[a-zA-Z0-9]+$"
          required
        />
      </div>
      
      <div className="form-group">
        <label>Merchant Name:</label>
        <input
          value={formData.payeeName}
          onChange={(e) => setFormData({...formData, payeeName: e.target.value})}
          maxLength="50"
          required
        />
      </div>

      <div className="form-group">
        <label>MCC Code:</label>
        <input
          value={formData.mcc}
          onChange={(e) => setFormData({...formData, mcc: e.target.value})}
          pattern="\d{4}"
          required
        />
      </div>

      <button type="submit">Save Configuration</button>
      {message && <div className="message">{message}</div>}
    </form>
  );
};

export default AdminVpaConfig;

