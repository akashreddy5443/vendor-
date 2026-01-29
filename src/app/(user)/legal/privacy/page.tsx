export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 font-sans text-gray-800">
            <h1 className="text-4xl font-bold mb-8 text-[#191970]">Privacy Policy</h1>
            <p className="mb-4">Your privacy is important to us. This policy explains how we collect and use your information.</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account or make a purchase.</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Information</h2>
            <p>We use the information to process your orders and improve our services.</p>
            <p className="mt-12 text-sm text-gray-500 italic">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
    )
}
