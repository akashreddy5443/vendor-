import { createClient } from '@/lib/supabase/server'
import { Plus, MapPin, Trash2 } from 'lucide-react'
import { addAddress, deleteAddress } from './actions'

export default async function AddressesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch addresses
    const { data: addresses } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-serif">Address Book</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Add New Card */}
                <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-zinc-900/50 transition-colors group">
                    {/* Simple Form embedded for now, usually would be a modal or separate route */}
                    {/* For simplicity in this iteration, keeping it as a form block */}
                    <form action={async (formData) => {
                        'use server'
                        await addAddress(formData)
                    }} className="w-full space-y-3 text-left">
                        <h3 className="text-lg font-medium text-orange-500 mb-4 flex items-center gap-2">
                            <Plus className="h-5 w-5" /> Add New Address
                        </h3>
                        <input name="fullName" placeholder="Label (e.g. Home)" className="w-full rounded bg-zinc-800 p-2 text-sm text-white border border-zinc-700" required />
                        <input name="street" placeholder="Street Address" className="w-full rounded bg-zinc-800 p-2 text-sm text-white border border-zinc-700" required />
                        <div className="grid grid-cols-2 gap-2">
                            <input name="city" placeholder="City" className="w-full rounded bg-zinc-800 p-2 text-sm text-white border border-zinc-700" required />
                            <input name="zip" placeholder="Zip Code" className="w-full rounded bg-zinc-800 p-2 text-sm text-white border border-zinc-700" required />
                        </div>
                        <input name="state" placeholder="State" className="w-full rounded bg-zinc-800 p-2 text-sm text-white border border-zinc-700" />
                        <button className="w-full rounded bg-white py-2 text-sm font-bold text-black hover:bg-gray-200 mt-2">
                            Save Address
                        </button>
                    </form>
                </div>

                {/* List Addresses */}
                {addresses?.map((addr) => (
                    <div key={addr.id} className="relative rounded-xl border border-zinc-800 bg-zinc-900 p-6 group">
                        <div className="absoulte top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Delete Button Form */}
                            <form action={async () => {
                                'use server'
                                await deleteAddress(addr.id)
                            }}>
                                <button className="p-2 text-gray-500 hover:text-red-500 absolute top-4 right-4">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </form>
                        </div>

                        <div className="flex items-center gap-3 mb-4 text-orange-500">
                            <MapPin className="h-5 w-5" />
                            <span className="font-bold">{addr.full_name}</span>
                            {addr.is_default && <span className="text-xs bg-orange-500/10 px-2 py-0.5 rounded text-orange-500 border border-orange-500/20">Default</span>}
                        </div>

                        <div className="space-y-1 text-gray-400 text-sm">
                            <p>{addr.street_address}</p>
                            <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                            <p>{addr.country}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
