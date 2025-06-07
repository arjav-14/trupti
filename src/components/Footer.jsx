import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <p>Trupti Foodz</p>
            <p>Badi Sadak, Jalna</p>
            <p>Maharashtra - 431203</p>
            <p>Phone: +91 9373024521</p>
            <p>Email: info@truptifoodz.com</p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/policies/terms" className="text-gray-600 hover:text-orange-600">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-gray-600 hover:text-orange-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/refund" className="text-gray-600 hover:text-orange-600">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="text-gray-600 hover:text-orange-600">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
            {/* Add social media links */}
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>
            By using our website, you agree to our{' '}
            <Link href="/policies/terms" className="text-orange-600 hover:underline">
              Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link href="/policies/privacy" className="text-orange-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Trupti Foodz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}