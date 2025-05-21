// utils/UpiUtils.js
export function generateUpiDeeplink({ vpa, name, amount, note, mcc }) {
  const params = new URLSearchParams({
    pa: vpa,
    pn: name,
    am: amount.toFixed(2),
    tn: note,
    cu: 'INR',
    mc: mcc, // Mandatory for merchant accounts
    tr: `TXN${Date.now()}`,
    merchant: 'true'
  });
  
  return `phonepe://pay?${params.toString()}&redirectUrl=${encodeURIComponent(window.location.href)}`;
}
