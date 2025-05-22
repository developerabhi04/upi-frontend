// src/Components/AdminVpaConfig.jsx
import { useState } from 'react';
import { server } from '../server.js';

const AdminVpaConfig = () => {
  const [formData, setFormData] = useState({
    payeeVpa: '',
    payeeName: '',
    mcc: '',
    isMerchantAccount: true
  });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`${server}/payment/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) setMsg('Saved!');
      else setMsg(data.error || 'Error saving VPA');
    } catch (err) {
      setMsg('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth: 400, margin: "2rem auto"}}>
      <input
        placeholder="Merchant VPA (e.g., business@ybl)"
        value={formData.payeeVpa}
        onChange={e => setFormData({...formData, payeeVpa: e.target.value})}
        pattern="^[A-Za-z0-9_.-]+@[A-Za-z0-9]+$"
        required
      />
      <input
        placeholder="Merchant Name"
        value={formData.payeeName}
        onChange={e => setFormData({...formData, payeeName: e.target.value})}
        required
      />
      <input
        placeholder="MCC Code (4 digits)"
        value={formData.mcc}
        onChange={e => setFormData({...formData, mcc: e.target.value})}
        pattern="\d{4}"
        required
      />
      <button type="submit">Save Merchant Config</button>
      {msg && <div style={{marginTop: 10}}>{msg}</div>}
    </form>
  );
};

export default AdminVpaConfig;
