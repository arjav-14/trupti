// // import { Webhook } from "svix";
// // import { headers } from "next/headers";
// // import { NextResponse } from "next/server";

// // const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

// // export async function POST(req) {
// //   const payload = await req.text();
// //   const headerPayload = headers();

// //   const svixHeaders = {
// //     "svix-id": headerPayload.get("svix-id"),
// //     "svix-timestamp": headerPayload.get("svix-timestamp"),
// //     "svix-signature": headerPayload.get("svix-signature"),
// //   };

// //   const webhook = new Webhook(WEBHOOK_SECRET);

// //   let event;
// //   try {
// //     event = webhook.verify(payload, svixHeaders);
// //   } catch (err) {
// //     console.error("❌ Webhook signature invalid", err);
// //     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
// //   }

// //   const { type, data } = event;

// //   if (type === "user.created") {
// //     console.log("✅ Clerk user created:", data);
// //     // Optionally save to DB here
// //   }

// //   return NextResponse.json({ received: true });
// // }
// import { Webhook } from 'svix';
// import { headers } from 'next/headers';
// import { NextResponse } from 'next/server';
// import { connectToDB } from '../../../config/db';
// import User from '../../../models/User'; 

// const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

// export async function POST(req) {
//   try {
//     if (!WEBHOOK_SECRET) {
//       throw new Error('Missing CLERK_WEBHOOK_SECRET in environment variables.');
//     }

  
//     const payload = await req.text();

    
//     const svixHeaders = {
//       'svix-id': headers().get('svix-id'),
//       'svix-timestamp': headers().get('svix-timestamp'),
//       'svix-signature': headers().get('svix-signature'),
//     };

    
//     if (!svixHeaders['svix-id'] || !svixHeaders['svix-timestamp'] || !svixHeaders['svix-signature']) {
//       console.error('❌ Missing Svix headers');
//       return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
//     }

    
//     const webhook = new Webhook(WEBHOOK_SECRET);
//     let event;

//     try {
//       event = webhook.verify(payload, svixHeaders);
//     } catch (err) {
//       console.error('❌ Webhook signature verification failed:', err.message);
//       return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
//     }

//     const { type, data } = event;

    
//     await connectToDB();

   
//     const userData = {
//       clerkId: data.id,
//       email: data.email_addresses?.[0]?.email_address || '',
//       firstName: data.first_name || '',
//       lastName: data.last_name || '',
//       imageUrl: data.image_url || '',
//     };

    
//     switch (type) {
//       case 'user.created':
//         await User.create(userData);
//         console.log('✅ User created:', userData.clerkId);
//         break;
//       case 'user.updated':
//         await User.findOneAndUpdate({ clerkId: data.id }, userData, { upsert: true });
//         console.log('📝 User updated:', userData.clerkId);
//         break;
//       case 'user.deleted':
//         await User.findOneAndDelete({ clerkId: data.id });
//         console.log('❌ User deleted:', data.id);
//         break;
//       default:
//         console.warn('⚠️ Unhandled Clerk event type:', type);
//     }

//     return NextResponse.json({ success: true, message: `Webhook processed: ${type}` });
//   } catch (error) {
//     console.error('❌ Webhook processing error:', error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }


import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectToDB } from '../../../config/db';
import User from '../../../models/User'; 

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    if (!WEBHOOK_SECRET) {
      throw new Error('Missing CLERK_WEBHOOK_SECRET in environment variables.');
    }

    const payload = await req.text();

    const svixHeaders = {
      'svix-id': headers().get('svix-id'),
      'svix-timestamp': headers().get('svix-timestamp'),
      'svix-signature': headers().get('svix-signature'),
    };

    if (!svixHeaders['svix-id'] || !svixHeaders['svix-timestamp'] || !svixHeaders['svix-signature']) {
      console.error('❌ Missing Svix headers');
      return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
    }

    const webhook = new Webhook(WEBHOOK_SECRET);
    let event;

    try {
      event = webhook.verify(payload, svixHeaders);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { type, data } = event;

    const db = await connectToDB();

    // 🔍 Confirm collection is registered
    const collections = await db.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    if (collectionNames.includes('users')) {
      console.log("📦 'users' collection exists");
    } else {
      console.log("🆕 'users' collection not yet created – will be created on first insert");
    }

    const userData = {
      clerkId: data.id,
      email: data.email_addresses?.[0]?.email_address || '',
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      imageUrl: data.image_url || '',
    };

    switch (type) {
      case 'user.created':
        const newUser = await User.create(userData);
        console.log('✅ User document created:', newUser._id);
        break;
      case 'user.updated':
        const updatedUser = await User.findOneAndUpdate({ clerkId: data.id }, userData, { upsert: true });
        console.log('📝 User document updated:', updatedUser?._id || '(upserted)');
        break;
      case 'user.deleted':
        await User.findOneAndDelete({ clerkId: data.id });
        console.log('❌ User document deleted:', data.id);
        break;
      default:
        console.warn('⚠️ Unhandled Clerk event type:', type);
    }

    return NextResponse.json({ success: true, message: `Webhook processed: ${type}` });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
