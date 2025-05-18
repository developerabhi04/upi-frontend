import  { useState } from 'react';
import { server } from '../server.js';

const API_URL = `${server}/payment/config`;

const AdminVpaConfig = () => {
  const [payeeVpa, setPayeeVpa] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payeeVpa, payeeName })
      });

      const data = await res.json();
      if (res.ok) {
        setMsg(`Saved: ${data.payeeVpa} (${data.payeeName})`);
      } else {
        setMsg(data.error || 'Error saving VPA');
      }
    } catch (err) {
      setMsg('Network error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3>Configure UPI VPA</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="VPA (e.g., mystore@ybl)"
          value={payeeVpa}
          onChange={e => setPayeeVpa(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Payee Name"
          value={payeeName}
          onChange={e => setPayeeName(e.target.value)}
          required
        />
        <button type="submit">Save VPA</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default AdminVpaConfig;
