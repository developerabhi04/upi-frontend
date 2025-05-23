export const generateUpiLink = (config, sessionData) => {
  const params = new URLSearchParams({
    pa: config.payeeVpa,
    pn: encodeURIComponent(config.payeeName.substring(0, 50)),
    am: sessionData.amount.toFixed(2), // Use exact backend amount
    tn: `Payment-${sessionData.orderId}`, // Enhanced transaction note
    tr: sessionData.sessionId,
    cu: 'INR',
    mc: config.mcc, // Use configured MCC
    ...(config.isIDFC && {
      mode: '02',
      orgid: '000393',
      ver: '01' // Add version parameter
    })
  });

  return {
    universal: `upi://pay?${params}`,
    webFallback: `https://upilink.in/pay?${params}`,
    apps: {
      phonepe: `phonepe://pay?${params}&sign=1`, // Add signature placeholder
      gpay: `tez://upi/pay?${params}`,
      paytm: `paytmmp://pay?${params}`
    }
  };
};