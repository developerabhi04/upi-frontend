export const generateUpiLink = (config, amount, safeOrderId, sessionId) => {
  const idfcParams = config.isIDFC
    ? { mode: '02', orgid: '000393', mc: '6012' }
    : {};

  const params = new URLSearchParams({
    pa: config.payeeVpa,
    pn: encodeURIComponent(config.payeeName.substring(0,50)),
    am: amount.toFixed(2),
    tn: `Payment for ${safeOrderId}`.substring(0,50),
    tr: sessionId,
    cu: 'INR',
    ...idfcParams
  });

  return {
    upiIntent: `upi://pay?${params.toString()}`,
    webFallback: `https://upilink.in/pay?${params.toString()}`,
    appLinks: {
      phonepe: `phonepe://pay?${params.toString()}`,
      gpay:    `tez://upi/pay?${params.toString()}`,
      paytm:   `paytmmp://pay?${params.toString()}`
    }
  };
};
