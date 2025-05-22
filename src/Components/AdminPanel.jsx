import { useState, useEffect } from 'react';
import { server } from '../server.js';

const AdminPanel = () => {
  const [form, setForm] = useState({
    payeeVpa: '',
    payeeName: '',
    mcc: '6012',
    gstin: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch(`${server}/payment/config`);
        const data = await res.json();
        if (data) setForm(data);
      } catch (err) {
        setMessage('Failed to load configuration');
      }
    };
    loadConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${server}/payment/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const result = await res.json();
      setMessage(res.ok ? 'Configuration saved!' : result.error);
    } catch (err) {
      setMessage('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-group">
        <label>VPA:</label>
        <input
          value={form.payeeVpa}
          onChange={e => setForm({...form, payeeVpa: e.target.value})}
          placeholder="9599516256@idfcbank"
          pattern="\d{10}@idfcbank"
          required
        />
      </div>

      <div className="form-group">
        <label>Merchant Name:</label>
        <input
          value={form.payeeName}
          onChange={e => setForm({...form, payeeName: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>MCC Code:</label>
        <select
          value={form.mcc}
          onChange={e => setForm({...form, mcc: e.target.value})}
        >
          <option value="6012">6012 - Financial Services</option>
          <option value="6051">6051 - Non-FI Money Services</option>
          <option value="6211">6211 - Security Brokers</option>
        </select>
      </div>

      <button type="submit">Save Configuration</button>
      {message && <div className="message">{message}</div>}
    </form>
  );
};

export default AdminPanel;