export const generateUpiLink = (config, amount, orderId, sessionId) => {
  // Enhanced validation
  if (!config || typeof config !== 'object') {
    throw new Error('Configuration must be an object');
  }

  const requiredFields = ['payeeVpa', 'payeeName'];
  for (const field of requiredFields) {
    if (!config[field] || typeof config[field] !== 'string') {
      throw new Error(`Missing or invalid ${field} in configuration`);
    }
  }

  // Validate amount
  if (isNaN(amount) || amount <= 0 || amount > 2000) {
    throw new Error('Amount must be between ₹1 and ₹2000');
  }

  // Create UPI parameters
  const params = new URLSearchParams({
    pa: config.payeeVpa.trim(),
    pn: encodeURIComponent(config.payeeName.trim().substring(0, 50)),
    am: amount.toFixed(2),
    tn: `Payment for order ${orderId}`.substring(0, 50),
    mc: config.mcc || '6012', // Default MCC if not provided
    tr: sessionId,
    cu: 'INR',
    url: `${window.location.origin}/status/${sessionId}`
  });

  return {
    upiIntent: `upi://pay?${params.toString()}`,
    fallbackUrl: `https://upilink.in/pay?${params.toString()}`
  };
};