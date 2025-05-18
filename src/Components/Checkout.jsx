import React from 'react';
import PhonePeButton from './PhonePeButton';


const Checkout = () => {
  const amount = 4;
  const orderId = 'ORDER12345';

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Checkout</h2>
      <p>Order Amount: ₹{amount}</p>
      <PhonePeButton amount={amount} orderId={orderId} />
    </div>
  );
};

export default Checkout;
