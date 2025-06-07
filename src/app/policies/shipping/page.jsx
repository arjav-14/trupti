export default function ShippingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-orange-800 mb-6">Shipping & Delivery Policy</h1>
      
      <div className="space-y-4">
        <section>
          <h2 className="text-xl font-semibold mb-2">Delivery Timeline</h2>
          <p>Orders are typically processed within 24-48 hours and delivered within 5-7 business days across India.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Shipping Charges</h2>
          <p>Free shipping on orders above ₹499. Standard shipping charges apply for orders below ₹499.</p>
        </section>

        {/* Add more sections */}
      </div>
    </div>
  );
}