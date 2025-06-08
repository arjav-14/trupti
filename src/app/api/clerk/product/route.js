// import { connectToDB } from '../../../../config/db';
// import Product from '../../../../models/Product';
// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     await connectToDB();
//     const products = await Product.find({ isActive: true }).lean();
    
//     console.log('Products fetched:', products); // Debug log

//     return NextResponse.json({ 
//       success: true,
//       products 
//     });
//   } catch (error) {
//     console.error('GET /api/products error:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: 'Failed to fetch products' 
//     }, { 
//       status: 500 
//     });
//   }
// }

import { connectToDB } from '../../../../config/db';
import Product from '../../../../models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDB();

    // Fetch products with specific fields and sort by creation date
    const products = await Product.find({ isActive: true })
      .select('name description image imageAlt variants isActive')
      .sort({ createdAt: -1 })
      .lean();

    // Transform the variants data for easier client-side handling
    const transformedProducts = products.map(product => ({
      ...product,
      variants: product.variants.map(variant => ({
        weight: {
          value: variant.weight.value,
          unit: variant.weight.unit
        },
        price: variant.price,
        inStock: variant.inStock
      }))
    }));

    console.log('Transformed products:', JSON.stringify(transformedProducts, null, 2));

    return NextResponse.json({ 
      success: true,
      products: transformedProducts
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch products',
      error: error.message
    }, { status: 500 });
  }
}
