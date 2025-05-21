import  { useState } from 'react';
import { server } from '../server.js';


const AdminVpaConfig = () => {
  const [formData, setFormData] = useState({
    payeeVpa: '',
    payeeName: '',
    mcc: '',
    isMerchant: false
  });

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await fetch(`${server}/payment/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        isMerchantAccount: true
      })
    });
    // No need to use 'res' if you don't care about the response
  } catch (err) {
    alert('Network error');
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Merchant VPA (e.g., business@ybl)"
        value={formData.payeeVpa}
        onChange={e => setFormData({...formData, payeeVpa: e.target.value})}
        pattern="^[\w.-]+@(ok\w+|ybl|axl|ibl|sbi)$"
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
    </form>
  );
};


export default AdminVpaConfig;
