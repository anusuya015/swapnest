import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const InvoicePage = ({ location }) => {
  const history = useHistory();
  const { paymentResponse } = location.state || {}; // Capture Razorpay response

  useEffect(() => {
    // If no payment response is available, redirect to home
    if (!paymentResponse) {
      history.push('/');
    }
  }, [paymentResponse, history]);

  // Calculate total price (in INR) from the Razorpay response (in paise)
  const calculateAmountPaid = () => {
    if (paymentResponse && paymentResponse.amount) {
      return (paymentResponse.amount / 100).toFixed(2); // Convert paise to INR
    } else {
      return '0.00'; // If the amount is not available
    }
  };

  // Calculate expected delivery date (e.g., 5 days from now)
  const calculateDeliveryDate = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5); // Assume 5 days delivery time
    return deliveryDate.toLocaleDateString();
  };

  return (
    <div>
      <h1>Invoice</h1>
      {paymentResponse ? (
        <>
          <p><strong>Payment ID:</strong> {paymentResponse.razorpay_payment_id}</p>
          <p><strong>Amount Paid:</strong> Rs {calculateAmountPaid()}</p>
          <p><strong>Expected Delivery Date:</strong> {calculateDeliveryDate()}</p>
        </>
      ) : (
        <p>Payment details not available</p>
      )}
      <button onClick={() => history.push('/')}>Go to Home</button>
    </div>
  );
};

export default InvoicePage;
