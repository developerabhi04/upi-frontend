// src/Utils/UpiUtils.js
export function generateUpiDeeplink({ payeeVpa, payeeName, amount, note, mcc }) {
  const params = new URLSearchParams({
    pa: payeeVpa,
    pn: payeeName,
    am: amount.toFixed(2),
    tn: note,
    cu: 'INR',
    mc: mcc,
    tr: `TXN${Date.now()}`
  });
  return `phonepe://pay?${params.toString()}&redirectUrl=${encodeURIComponent(window.location.href)}`;
}
