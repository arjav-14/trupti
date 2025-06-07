export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-orange-800 mb-6">Contact Us</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Our Location</h2>
        <p className="mb-4">
          Trupti Foodz<br />
          Badi Sadak<br />
          Jalna, Maharashtra - 431203<br />
          India
        </p>

        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <p className="mb-2">
          <strong>Phone:</strong> +91 9373024521
        </p>
        <p className="mb-2">
          <strong>Email:</strong> info@truptifoodz.com
        </p>
        <p className="mb-4">
          <strong>Business Hours:</strong> Monday - Saturday, 9:00 AM - 7:00 PM
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
        
      </div>
    </div>
  );
}