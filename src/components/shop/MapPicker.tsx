'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react'

// Fix Leaflet icon issue
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

interface MapPickerProps {
    onAddressSelect: (address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        label: string;
    }) => void;
}

function LocationMarker({ position, setPosition }: { position: L.LatLng, setPosition: (pos: L.LatLng) => void }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position}></Marker>
    )
}

export default function MapPicker({ onAddressSelect }: MapPickerProps) {
    const [position, setPosition] = useState<L.LatLng>(new L.LatLng(12.9716, 77.5946)) // Default to Bangalore
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')

    const lastPositionRef = useRef<L.LatLng>(position)

    const reverseGeocode = useCallback(async (lat: number, lon: number) => {
        // Prevent calls if position hasn't actually changed significantly
        if (lastPositionRef.current.lat === lat && lastPositionRef.current.lng === lon) return

        setLoading(true)
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`)
            const data = await response.json()

            if (data.address) {
                const addr = data.address

                // Construct a better street address with house number if available
                const streetParts = []
                if (addr.house_number) streetParts.push(addr.house_number)
                if (addr.building) streetParts.push(addr.building)
                if (addr.road) streetParts.push(addr.road)
                const streetAddress = streetParts.join(', ') || addr.suburb || addr.neighbourhood || ''

                // Try to determine a professional label - avoid "My Location" or numeric names
                let suggestedLabel = data.name || addr.building || addr.amenity || addr.office || addr.industrial || ''
                if (!suggestedLabel || /^\d+$/.test(suggestedLabel) || suggestedLabel.toLowerCase().includes('location')) {
                    suggestedLabel = 'Home' // Safer default than "My Location"
                }

                onAddressSelect({
                    street: streetAddress,
                    city: addr.city || addr.town || addr.village || addr.county || '',
                    state: addr.state || '',
                    zip: addr.postcode || '',
                    country: addr.country || '',
                    label: suggestedLabel
                })
                lastPositionRef.current = new L.LatLng(lat, lon)
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error)
        } finally {
            setLoading(false)
        }
    }, [onAddressSelect])

    useEffect(() => {
        const timeout = setTimeout(() => {
            reverseGeocode(position.lat, position.lng)
        }, 500) // Debounce geocoding
        return () => clearTimeout(timeout)
    }, [position, reverseGeocode])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchText) return

        setLoading(true)
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`)
            const data = await response.json()
            if (data && data.length > 0) {
                const newPos = new L.LatLng(parseFloat(data[0].lat), parseFloat(data[0].lon))
                setPosition(newPos)
            }
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setLoading(false)
        }
    }

    const detectLocation = useCallback(() => {
        if (!navigator.geolocation) return

        navigator.geolocation.getCurrentPosition((pos) => {
            const newPos = new L.LatLng(pos.coords.latitude, pos.coords.longitude)
            setPosition(newPos)
        }, (err) => {
            console.error('Geolocation error:', err)
        }, { enableHighAccuracy: true })
    }, [])

    useEffect(() => {
        detectLocation()
    }, [detectLocation])

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search for a location..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </form>
                <button
                    type="button"
                    onClick={detectLocation}
                    className="p-2.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors"
                    title="Detect My Location"
                >
                    <Navigation className="h-4 w-4 text-blue-600" />
                </button>
            </div>

            <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-border relative z-0">
                <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>

                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-[1000] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    </div>
                )}
            </div>

            <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Click on the map to pin your exact delivery location
            </p>
        </div>
    )
}
