"use client";
import { useEffect, useState } from "react";

export default function RazorpayCheckoutButton({ amount }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsReady(true);
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    const res = await fetch("/api/clerk/razorpay", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Trupti Foodz",
      description: "Test Transaction",
      order_id: data.id,
      handler: function (response) {
        alert("Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Arjav",
        email: "arjav@example.com",
        contact: "9028003861",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button onClick={handlePayment} disabled={!isReady}>
      Pay ₹{amount / 100}
    </button>
  );
}

