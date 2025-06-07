import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDB } from '../../../../../config/db';
import Order from '../../../../../models/Orders';
import Product from '../../../../../models/Product';
import { sendOrderConfirmationEmail } from '../../../../../utils/mailer';

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = await req.json();

    console.log('Received payment verification request:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      orderData
    });

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      console.error('Signature verification failed');
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Create order in database
    await connectToDB();

    // Format the order data
    const orderPayload = {
      userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentDetails: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature
      }
    };

    console.log('Creating order with payload:', orderPayload);

    // Create the order
    const order = await Order.create(orderPayload);

    // Populate product details
    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: 'items.productId',
        model: 'Product',
        select: 'name price image'
      });

    console.log('Populated order:', JSON.stringify(populatedOrder, null, 2));

    // Send email with populated data
    await sendOrderConfirmationEmail(populatedOrder);

    // Verify order was created
    const savedOrder = await Order.findById(order._id);
    console.log('Order saved successfully:', savedOrder);

    // Send detailed response
    return NextResponse.json({
      success: true,
      message: 'Payment verified and order created successfully',
      order: {
        _id: order._id,
        orderId: order.orderId,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Payment verification failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}