import { NextResponse } from 'next/server';
import { getAuth } from 'node_modules/@clerk/nextjs/server';
import connectDB from '../../../../config/db';
import User from '../../../../models/User';
import Product from '../../../../models/Product';

await connectDB();

export async function GET(req) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await User.findOne({ clerkId: userId }).populate('cart.productId');
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ cart: user.cart }, { status: 200 });
}

export async function POST(req) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

  const product = await Product.findById(productId);
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  let user = await User.findOne({ clerkId: userId });
  if (!user) {
    user = await User.create({
      clerkId: userId,
      email: '',
      cart: []
    });
  }

  const existingItem = user.cart.find(item => item.productId.equals(productId));
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    user.cart.push({ productId, quantity: 1 });
  }

  await user.save();
  await user.populate('cart.productId');
  return NextResponse.json({ cart: user.cart }, { status: 200 });
}

export async function PUT(req) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { productId, quantity } = await req.json();
  if (!productId || quantity < 1) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const user = await User.findOne({ clerkId: userId });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const item = user.cart.find(item => item.productId.equals(productId));
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  item.quantity = quantity;
  await user.save();
  await user.populate('cart.productId');
  return NextResponse.json({ cart: user.cart }, { status: 200 });
}

export async function DELETE(req) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const productId = url.pathname.split('/').pop();

  const user = await User.findOne({ clerkId: userId });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  user.cart = user.cart.filter(item => !item.productId.equals(productId));
  await user.save();
  await user.populate('cart.productId');
  return NextResponse.json({ cart: user.cart }, { status: 200 });
}
