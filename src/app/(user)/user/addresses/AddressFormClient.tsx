'use client'

import { useState, useCallback } from 'react'
import { Plus, MapPin, Loader2, Map as MapIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { addAddress } from '@/app/(user)/user/addresses/actions'
import { toast } from 'sonner'

// Dynamic import for MapPicker because Leaflet uses 'window'
const MapPicker = dynamic(() => import('@/components/shop/MapPicker'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-2xl flex items-center justify-center text-muted-foreground">Loading Map...</div>
})

export function AddressFormClient() {
    const [showMap, setShowMap] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [address, setAddress] = useState({
        fullName: '',
        street: '',
        city: '',
        zip: '',
        state: '',
        country: 'India'
    })

    const [suggestedLandmark, setSuggestedLandmark] = useState('')

    const handleAddressSelect = useCallback((data: any) => {
        setAddress(prev => ({
            ...prev,
            street: data.street || prev.street,
            city: data.city || prev.city,
            state: data.state || prev.state,
            zip: data.zip || prev.zip,
            country: data.country || prev.country,
            fullName: prev.fullName === '' || prev.fullName === 'Home' || prev.fullName === 'Work' || prev.fullName === 'Office' || prev.fullName === suggestedLandmark ? data.label || prev.fullName : prev.fullName
        }))
        if (data.label && data.label !== 'Home' && data.label !== 'My Address') {
            setSuggestedLandmark(data.label)
        }
        toast.success('Address coordinates captured!')
    }, [suggestedLandmark])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)

        const formData = new FormData(e.currentTarget)
        try {
            await addAddress(formData)
            toast.success('Address saved successfully!')
            // Reset form
            setAddress({
                fullName: '',
                street: '',
                city: '',
                zip: '',
                state: '',
                country: 'India'
            })
            setShowMap(false)
        } catch (error) {
            toast.error('Failed to save address')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 hover:bg-muted/30 transition-all group overflow-hidden">
            <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                <Plus className="h-6 w-6" /> Add New Address
            </h3>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                            <div className="flex justify-between items-end mb-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Label</label>
                                <div className="flex gap-1.5 flex-wrap">
                                    {['Home', 'Office', 'Work'].map((lab) => (
                                        <button
                                            key={lab}
                                            type="button"
                                            onClick={() => setAddress(prev => ({ ...prev, fullName: lab }))}
                                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold transition-all border ${address.fullName === lab
                                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                : "bg-background text-muted-foreground border-border hover:border-blue-300"
                                                }`}
                                        >
                                            {lab}
                                        </button>
                                    ))}
                                    {suggestedLandmark && !['Home', 'Office', 'Work'].includes(suggestedLandmark) && (
                                        <button
                                            type="button"
                                            onClick={() => setAddress(prev => ({ ...prev, fullName: suggestedLandmark }))}
                                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold transition-all border animate-in fade-in zoom-in duration-300 ${address.fullName === suggestedLandmark
                                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                : "bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300"
                                                }`}
                                        >
                                            {suggestedLandmark}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <input
                                name="fullName"
                                value={address.fullName}
                                onChange={(e) => setAddress(prev => ({ ...prev, fullName: e.target.value }))}
                                placeholder="Home / Office / Work or Custom Name"
                                className="w-full rounded-xl bg-background px-4 py-3 text-sm text-foreground border border-border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Street Address</label>
                                <button
                                    type="button"
                                    onClick={() => setShowMap(!showMap)}
                                    className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline mb-1"
                                >
                                    <MapIcon className="h-3 w-3" /> {showMap ? 'Hide Map' : 'Select on Map'}
                                </button>
                            </div>
                            <input
                                name="street"
                                value={address.street}
                                onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                                placeholder="House No, Street Name, Area"
                                className="w-full rounded-xl bg-background px-4 py-3 text-sm text-foreground border border-border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">City</label>
                                <input
                                    name="city"
                                    value={address.city}
                                    onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                                    placeholder="City"
                                    className="w-full rounded-xl bg-background px-4 py-3 text-sm text-foreground border border-border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Zip Code</label>
                                <input
                                    name="zip"
                                    value={address.zip}
                                    onChange={(e) => setAddress(prev => ({ ...prev, zip: e.target.value }))}
                                    placeholder="6 Digits"
                                    className="w-full rounded-xl bg-background px-4 py-3 text-sm text-foreground border border-border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">State</label>
                            <input
                                name="state"
                                value={address.state}
                                onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                                placeholder="State"
                                className="w-full rounded-xl bg-background px-4 py-3 text-sm text-foreground border border-border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        disabled={isPending}
                        type="submit"
                        className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
                        Save Address
                    </button>
                </form>

                {/* Map Section */}
                {showMap && (
                    <div className="flex-1 min-w-[300px] animate-in slide-in-from-right-4 duration-300">
                        <MapPicker onAddressSelect={handleAddressSelect} />
                    </div>
                )}
            </div>
        </div>
    )
}
