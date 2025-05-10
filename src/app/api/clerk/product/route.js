import { connectToDB } from '../../../../config/db';
import Product from '../../../../models/Product';

export async function GET() {
  try {
    await connectToDB();
    const products = await Product.find();
    return Response.json({ products }, { status: 200 });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return Response.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}
