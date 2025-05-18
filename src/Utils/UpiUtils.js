export function generateUpiDeeplink({ vpa, name, amount, note }) {
  const params = new URLSearchParams({
    pa: vpa,
    pn: name,
    am: amount.toString(),
    tn: note,
    cu: 'INR'
  });
  return `upi://pay?${params.toString()}`;
}
