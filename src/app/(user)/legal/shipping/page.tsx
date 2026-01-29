export default function ShippingPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 font-sans text-gray-800">
            <h1 className="text-4xl font-bold mb-8 text-[#191970]">Shipping Policy</h1>
            <p className="mb-4">We act fast! Here is how we get your gear to you.</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Processing Time</h2>
            <p>All orders are processed within 1-2 business days.</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Shipping Rates</h2>
            <p>Standard shipping is free for orders over ₹2000. Express options available at checkout.</p>
            <p className="mt-12 text-sm text-gray-500 italic">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
    )
}
