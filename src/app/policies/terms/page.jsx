export default function TermsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-orange-800 mb-6">Terms & Conditions</h1>
      
      <div className="space-y-4">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and placing an order with Trupti Foodz, you confirm that you are in agreement with our Terms and Conditions.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Prices and Payment</h2>
          <p>All prices are in Indian Rupees (INR). Payment can be made through available payment methods. Prices may change without prior notice.</p>
        </section>

        {/* Add more sections as needed */}
      </div>
    </div>
  );
}