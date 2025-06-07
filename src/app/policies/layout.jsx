export default function PoliciesLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-orange-50 rounded-lg p-4 text-sm text-gray-700">
          <p>
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="mt-2">
            If you have any questions about our policies, please{' '}
            <a href="/contact" className="text-orange-600 hover:underline">
              contact us
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}