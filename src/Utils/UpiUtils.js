export const generateUpiLink = (config, amount, orderId, sessionId) => {
  // Validate inputs
  if (!config || !config.payeeVpa || !config.payeeName) {
    throw new Error('Invalid merchant configuration');
  }

  const params = new URLSearchParams({
    pa: config.payeeVpa,
    pn: encodeURIComponent(config.payeeName),
    am: amount.toFixed(2),
    tn: `Payment for ${orderId}`.substring(0, 50),
    mc: config.mcc || '6012',
    tr: sessionId,
    cu: 'INR',
    url: `${window.location.origin}/status/${sessionId}`
  });

  // Return both UPI intent and fallback URL
  return {
    upiIntent: `upi://pay?${params.toString()}`,
    fallbackUrl: `https://upilink.in/pay?${params.toString()}`
  };
};