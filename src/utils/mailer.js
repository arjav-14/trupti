import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendOrderConfirmationEmail(order) {
  const itemsList = order.items.map(item => {
    // Get product name from populated data
    const productName = item.productId?.name || 'Product';
    
    console.log('Product details:', {
      name: productName,
      price: item.price,
      quantity: item.quantity
    });

    return `
      <li style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
        <strong>${productName}</strong><br>
        Quantity: ${item.quantity}<br>
        Price per item: ₹${Number(item.price).toFixed(2)}<br>
        Subtotal: ₹${(Number(item.price) * item.quantity).toFixed(2)}
      </li>
    `;
  }).join('');

  const mailOptions = {
    from: `"Trupti Foodz" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `Order Confirmation - Order #${order.orderId}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #ea580c; text-align: center;">Thank you for your order!</h1>
        <p>Your order has been confirmed. Here are your order details:</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #ea580c; margin-top: 0;">Order Summary</h2>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount.toFixed(2)}</p>
          
          <h3 style="color: #ea580c;">Items Ordered:</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0;">
            ${itemsList}
          </ul>
          
          <div style="margin-top: 20px; background-color: #fff; padding: 15px; border-radius: 4px;">
            <h3 style="color: #ea580c; margin-top: 0;">Shipping Address:</h3>
            <p style="margin: 0;">${order.shippingAddress}</p>
          </div>
        </div>
        
        <p>We'll send you another email when your order ships.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <div style="margin-top: 30px; text-align: center; color: #666; border-top: 1px solid #eee; padding-top: 20px;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0;"><strong>Trupti Foodz</strong></p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to:', order.customerEmail);
    return true;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return false;
  }
}