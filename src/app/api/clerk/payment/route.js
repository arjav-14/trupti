import { getAuth } from '@clerk/nextjs/server';
import Razorpay from 'razorpay';

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await req.json();
    if (!amount || amount < 100) {
      return Response.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `order_${Date.now()}`
    });

    return Response.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return Response.json({ 
      success: false, 
      error: error.message || 'Failed to create payment' 
    }, { 
      status: 500 
    });
  }
}
