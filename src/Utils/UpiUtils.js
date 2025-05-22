export const generateUpiLink = (config, amount, orderId, sessionId) => {
  const params = new URLSearchParams({
    pa: config.payeeVpa,
    pn: config.payeeName,
    am: amount.toFixed(2),
    tn: `Order:${orderId}`,
    mc: config.mcc,
    tr: `TXN${Date.now()}`,
    cu: 'INR'
  });

  return {
    upi: `upi://pay?${params}`,
    apps: {
      phonepe: `phonepe://pay?${params}`,
      gpay: `tez://upi/pay?${params}`,
      paytm: `paytmmp://pay?${params}`
    }
  };
};