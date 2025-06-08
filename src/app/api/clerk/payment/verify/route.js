

import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "../../../../../config/db";
import { NextResponse } from "next/server";
import Order from "../../../../../models/Orders";
import User from "../../../../../models/User";
import crypto from 'crypto';
import { sendOrderConfirmationEmail } from '../../../../../utils/mailer'

export async function POST(req) {
  console.group('Payment Verification');
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const payload = await req.json();
    console.log('Received payload:', JSON.stringify(payload, null, 2));

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${payload.razorpay_order_id}|${payload.razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== payload.razorpay_signature) {
      throw new Error('Invalid payment signature');
    }

    await connectToDB();

    // Create order with the data from payload, including image and size
    const order = new Order({
      userId,
      orderId: payload.razorpay_order_id,
      paymentId: payload.razorpay_payment_id,
      items: payload.orderData.items.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || '/images/placeholder.jpg', // Add default image
        variantDetails: {
          weight: {
            value: item.variantDetails.weight.value,
            unit: item.variantDetails.weight.unit
          },
          price: item.variantDetails.price
        }
      })),
      totalAmount: payload.orderData.totalAmount,
      status: 'confirmed',
      paymentStatus: 'paid',
      shippingAddress: payload.orderData.shippingAddress,
      customerEmail: payload.orderData.customerEmail,
      customerPhone: payload.orderData.customerPhone,
      paymentDetails: {
        paymentId: payload.razorpay_payment_id,
        orderId: payload.razorpay_order_id,
        signature: payload.razorpay_signature
      }
    });

    // Validate before saving
    const validationError = order.validateSync();
    if (validationError) {
      console.error('Validation Error:', validationError);
      throw new Error(`Order validation failed: ${Object.keys(validationError.errors).join(', ')}`);
    }

    await order.save();

    // Clear user's cart
    await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { cart: [] } }
    );

    // Send confirmation email
    await sendOrderConfirmationEmail(order);

    return NextResponse.json({ 
      success: true, 
      orderId: order._id,
      message: 'Payment successful! Your order has been confirmed.' 
    });

  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      message: 'Payment verification failed. Please contact support.'
    }, { 
      status: 400 
    });
  } finally {
    console.groupEnd();
  }
}
