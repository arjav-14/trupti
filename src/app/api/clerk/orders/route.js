import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { connectToDB } from '../../../../config/db';
import Order from '../../../../models/Orders';
import User from '../../../../models/User';

export async function GET(request) {
  console.group('Orders API Request');
  try {
    // Log auth details
    const auth = getAuth(request);
    console.log('Auth details:', {
      userId: auth.userId,
      sessionId: auth.sessionId
    });
    
    if (!auth.userId) {
      console.log('Authentication failed: No userId');
      console.groupEnd();
      return Response.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { 
        status: 401 
      });
    }

    // Log database connection attempt
    console.log('Connecting to database...');
    await connectToDB();
    console.log('Database connected successfully');

    // Log query parameters
    console.log('Query parameters:', {
      userId: auth.userId,
      sort: { createdAt: -1 }
    });
    
    // Execute query with error handling
    const orders = await Order.find({ userId: auth.userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name image')
      .lean()
      .catch(err => {
        console.error('Database query error:', err);
        throw err;
      });

    // Log query results
    console.log('Query results:', {
      ordersFound: orders?.length || 0,
      firstOrderId: orders?.[0]?._id,
      sampleOrder: orders?.[0] ? {
        totalAmount: orders[0].totalAmount,
        itemsCount: orders[0].items?.length,
        status: orders[0].status
      } : null
    });

    console.groupEnd();
    return Response.json({ 
      success: true, 
      orders 
    });

  } catch (error) {
    console.error('Orders API error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    console.groupEnd();
    return Response.json({ 
      success: false, 
      error: 'Failed to fetch orders',
      details: error.message,
      code: error.code
    }, { 
      status: 500 
    });
  }
}