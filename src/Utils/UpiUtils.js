export const generateUpiLink = (config, amount, orderId, sessionId) => {
  const params = new URLSearchParams({
    pa: config.payeeVpa,
    pn: config.payeeName,
    am: amount.toFixed(2),
    tn: `Payment for Order ${orderId}`.substring(0, 50), // Max 50 chars
    mc: config.mcc,
    tr: `TXN${Date.now()}${Math.random().toString(36).substr(2, 4)}`, // Unique TXN ID
    cu: 'INR',
    url: window.location.href // Redirect back URL
  });

  // Universal UPI intent
  return `upi://pay?${params.toString()}&mode=00&orgid=000000`; // Add merchant mode
};