import { createClient } from '@/lib/supabase/server'
import { Plus, MapPin, Trash2, Home, Building2, Briefcase, Globe } from 'lucide-react'
import { addAddress, deleteAddress } from './actions'
import { AddressFormClient } from './AddressFormClient'

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
        <div className="space-y-12 max-w-6xl">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold font-serif text-gray-900">Address Book</h2>
                <p className="text-muted-foreground text-sm">Manage your shipping addresses for a faster checkout experience.</p>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {/* New Map-Integrated Form */}
                <AddressFormClient />

                {/* List Addresses */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold font-serif text-gray-800 flex items-center gap-2">
                        Saved Addresses <span className="text-xs font-sans font-normal text-muted-foreground">({addresses?.length || 0})</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {addresses?.map((addr) => (
                            <div key={addr.id} className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                    <form action={async () => {
                                        'use server'
                                        await deleteAddress(addr.id)
                                    }}>
                                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>

                                <div className="flex items-start gap-4 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                                        {addr.full_name.toLowerCase().includes('home') ? <Home className="h-5 w-5" /> :
                                            addr.full_name.toLowerCase().includes('office') || addr.full_name.toLowerCase().includes('work') ? <Briefcase className="h-5 w-5" /> :
                                                <Building2 className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">{addr.full_name}</span>
                                            {addr.is_default && (
                                                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Shipping Destination</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-gray-600 text-sm">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                                        <p className="flex-1 leading-relaxed">
                                            {addr.street_address}<br />
                                            <span className="font-medium text-gray-900">{addr.city}, {addr.state} {addr.postal_code}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 pl-6 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                        <Globe className="h-3 w-3" /> {addr.country}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!addresses || addresses.length === 0) && (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                                    <MapPin className="h-8 w-8 text-gray-300" />
                                </div>
                                <p className="text-gray-500 font-medium">Your address book is empty.</p>
                                <p className="text-gray-400 text-sm mt-1">Add your first address using the form above.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
