export function generateUpiDeeplink({ payeeVpa, payeeName, amount, note, mcc }) {
  const params = new URLSearchParams({
    pa: payeeVpa,
    pn: payeeName,
    am: amount.toFixed(2),
    tn: note.substring(0, 50), // Limit note to 50 chars
    cu: 'INR',
    mc: mcc,
    tr: `TXN${Date.now().toString().slice(-6)}`
  });

  return {
    direct: `upi://pay?${params.toString()}`,
    webFallback: `https://upilink.in/pay?${params.toString()}`
  };
}