import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DebugPage() {
    const supabase = await createClient()

    // 1. Check User
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Count All Products (Ignorning Status)
    const { count: totalProducts, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    // 3. Get first 5 products (Raw)
    const { data: rawProducts, error: fetchError } = await supabase
        .from('products')
        .select('id, title, status, stock')
        .limit(5)

    // 4. Check RLS Policy Test (Active Only)
    const { count: activeProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    return (
        <div className="p-10 bg-black text-white font-mono space-y-6">
            <h1 className="text-3xl font-bold text-red-500">DATABASE DIAGNOSTICS</h1>

            <div className="border border-gray-800 p-4 rounded">
                <h2 className="text-xl font-bold text-blue-400">1. Authentication</h2>
                <p>User ID: {user?.id || 'Not Logged In (Guest)'}</p>
                <p>Role: {user?.role || 'N/A'}</p>
            </div>

            <div className="border border-gray-800 p-4 rounded">
                <h2 className="text-xl font-bold text-blue-400">2. Database Content</h2>
                <p>Total Products (Any Status): <strong>{totalProducts ?? 'Error'}</strong></p>
                <p>Active Products (Publicly Visible): <strong>{activeProducts ?? 'Error'}</strong></p>
                {countError && <p className="text-red-500">Count Error: {JSON.stringify(countError)}</p>}
            </div>

            <div className="border border-gray-800 p-4 rounded">
                <h2 className="text-xl font-bold text-blue-400">3. Raw Data Sample (Max 5)</h2>
                {fetchError ? (
                    <p className="text-red-500">Fetch Error: {JSON.stringify(fetchError)}</p>
                ) : (
                    <pre className="bg-gray-900 p-4 rounded overflow-auto">
                        {JSON.stringify(rawProducts, null, 2)}
                    </pre>
                )}
            </div>

            <div className="border border-gray-800 p-4 rounded">
                <h2 className="text-xl font-bold text-blue-400">4. Diagnosis</h2>
                <ul className="list-disc pl-5 space-y-2">
                    {totalProducts === 0 && (
                        <li className="text-red-500">CRITICAL: The products table is virtually empty. Data was deleted or never inserted.</li>
                    )}
                    {(totalProducts || 0) > 0 && activeProducts === 0 && (
                        <li className="text-yellow-500">ISSUE: Products exist but none are 'active'. Run the activation script.</li>
                    )}
                    {(totalProducts || 0) > 0 && activeProducts === totalProducts && (
                        <li className="text-green-500">OK: All products are active. If not visible, check 'products/page.tsx' code again.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
