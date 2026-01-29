export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 font-sans text-gray-800">
            <h1 className="text-4xl font-bold mb-8 text-[#191970]">Terms of Service</h1>
            <p className="mb-4">Welcome to TechDev Store. By using our website, you agree to these terms.</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. General Conditions</h2>
            <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Products and Pricing</h2>
            <p>Prices for our products are subject to change without notice.</p>
            <p className="mt-12 text-sm text-gray-500 italic">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
    )
}
