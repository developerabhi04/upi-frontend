// Updated UpiUtils.js with IDFC workaround
export const generateUpiLink = (config, amount, orderId, sessionId) => {
  // Workaround for IDFC accounts
  const isIdfcAccount = config.payeeVpa.endsWith('@idfcbank');
  
  const params = new URLSearchParams({
    pa: config.payeeVpa,
    pn: encodeURIComponent(config.payeeName),
    am: amount.toFixed(2),
    tn: `Payment for ${orderId}`.substring(0, 50),
    mc: isIdfcAccount ? '6012' : config.mcc, // Force MCC for IDFC
    tr: sessionId,
    cu: 'INR',
    mode: isIdfcAccount ? '02' : '00', // Special mode for problematic accounts
    orgid: isIdfcAccount ? '000393' : '000000' // IDFC bank org code
  });

  return {
    upiIntent: `upi://pay?${params.toString()}`,
    // Special PhonePe deep link for IDFC
    phonePeLink: isIdfcAccount ? 
      `phonepe://pay?${params.toString()}` : 
      null
  };
};