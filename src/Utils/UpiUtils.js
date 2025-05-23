export const generateUpiLink = (config, sessionData) => {
  const txnNote = `${sessionData.txnNote}-${sessionData.orderId}`.substring(0, 50);
  
  const params = new URLSearchParams({
    pa: config.payeeVpa,
    pn: encodeURIComponent(config.payeeName.substring(0, 30)),
    am: sessionData.amount.toFixed(2),
    tn: txnNote,
    tr: sessionData.sessionId,
    cu: 'INR',
    mc: config.mcc,
    mode: '02',
    orgid: '000393',
    ver: '01',
    sign: '', // Leave empty for apps to fill
    cuid: sessionData.customerRef
  });

  return {
    universal: `upi://pay?${params}`,
    webFallback: `https://upilink.in/pay?${params}`,
    apps: {
      phonepe: `phonepe://pay?${params}`,
      gpay: `tez://upi/pay?${params}`,
      paytm: `paytmmp://pay?${params}`,
      bhim: `upi://pay?${params}`
    }
  };
};