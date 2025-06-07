import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { connectToDB } from '../../../../config/db';
import Order from '../../../../models/Orders';
import User from '../../../../models/User';

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();
    
    const orders = await Order.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
        _id: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        shippingAddress: order.shippingAddress,
        items: order.items.map(item => ({
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.image,
          quantity: item.quantity
        }))
      }))
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { items, totalAmount, shippingAddress } = await req.json();

    if (!items || !totalAmount || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDB();

    // Create the order
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending'
    });

    // Populate the order items
    await order.populate('items.productId');

    // Clear the user's cart after successful order
    await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { cart: [] } }
    );

    return NextResponse.json({
      success: true,
      order: {
        _id: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        shippingAddress: order.shippingAddress,
        items: order.items.map(item => ({
          _id: item.productId._id,
          name: item.productId.name,
          price: item.price,
          image: item.productId.image,
          quantity: item.quantity
        }))
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}