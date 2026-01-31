'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
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
            map.flyTo(e.latlng, 18)
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
    const [pois, setPois] = useState<any[]>([])

    const lastPositionRef = useRef<L.LatLng>(position)
    const lastPoiFetchPos = useRef<L.LatLng | null>(null)

    const fetchPOIs = useCallback(async (lat: number, lon: number) => {
        // Only fetch if moved more than 150m from last POI fetch
        if (lastPoiFetchPos.current && lastPoiFetchPos.current.distanceTo(new L.LatLng(lat, lon)) < 150) return

        try {
            // Expanded Overpass query for nodes and ways (buildings) within 500m
            const query = `[out:json];(node["shop"](around:500,${lat},${lon});node["amenity"](around:500,${lat},${lon});node["tourism"](around:500,${lat},${lon});way["shop"](around:500,${lat},${lon});way["amenity"](around:500,${lat},${lon});way["building"="retail"](around:500,${lat},${lon}););out center 40;`
            const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
            const data = await response.json()
            if (data.elements) {
                const formattedPois = data.elements.map((el: any) => ({
                    id: el.id,
                    lat: el.lat || el.center?.lat,
                    lon: el.lon || el.center?.lon,
                    name: el.tags.name || el.tags.shop || el.tags.amenity || el.tags.building || 'Landmark'
                })).filter((el: any) => el.lat && el.lon)
                setPois(formattedPois)
                lastPoiFetchPos.current = new L.LatLng(lat, lon)
            }
        } catch (error) {
            console.error('POI Fetch error:', error)
        }
    }, [])

    const reverseGeocode = useCallback(async (lat: number, lon: number) => {
        // Prevent calls if position hasn't actually changed significantly
        if (lastPositionRef.current.lat === lat && lastPositionRef.current.lng === lon) return

        setLoading(true)
        try {
            // zoom=18 gives the most granular address possible (building/house level)
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&zoom=18`)
            const data = await response.json()

            if (data.address) {
                const addr = data.address

                // Construct a pixel-perfect street address matching Google Maps hierarchy
                const streetParts = []

                // 1. Primary Area / District (e.g., St Thomas Town)
                const district = addr.city_district || addr.town || addr.village
                if (district && !/^\d+$/.test(district) && district !== 'Bengaluru') streetParts.push(district)

                // 2. Layout / Neighborhood (e.g., Ramaiah Layout)
                const neighborhood = addr.neighbourhood || addr.suburb_district || addr.allotments
                if (neighborhood && neighborhood !== district) streetParts.push(neighborhood)

                // 3. Suburb / Area (e.g., Kacharakahalli)
                const suburb = addr.suburb || addr.residential || addr.community
                if (suburb && suburb !== neighborhood && suburb !== district) streetParts.push(suburb)

                // 4. Landmark / Building Name (if not already included)
                const landmark = data.name || addr.amenity || addr.shop || addr.building || addr.office
                if (landmark && !/^\d+$/.test(landmark) && !streetParts.includes(landmark) && landmark.toLowerCase() !== 'home') {
                    // Prepend landmark for better visibility
                    streetParts.unshift(landmark)
                }

                // 5. House Number / Road
                const roadInfo = []
                if (addr.house_number) roadInfo.push(`#${addr.house_number}`)
                if (addr.road) roadInfo.push(addr.road)
                if (roadInfo.length > 0) streetParts.push(roadInfo.join(', '))

                const streetAddress = streetParts.join(', ')

                // Intelligent Label Suggestion (Professional labels only)
                let suggestedLabel = landmark || neighborhood || suburb || ''
                if (!suggestedLabel || suggestedLabel.toLowerCase().includes('location') || /^\d+$/.test(suggestedLabel)) {
                    suggestedLabel = 'Home'
                }

                onAddressSelect({
                    street: streetAddress || addr.road || '',
                    city: addr.city || addr.town || addr.village || addr.county || '',
                    state: addr.state || '',
                    zip: addr.postcode || '',
                    country: addr.country || '',
                    label: suggestedLabel
                })
                lastPositionRef.current = new L.LatLng(lat, lon)
                fetchPOIs(lat, lon)
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error)
        } finally {
            setLoading(false)
        }
    }, [onAddressSelect, fetchPOIs])

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

    const poiIcon = L.divIcon({
        html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
        className: '',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    })

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

            <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-border relative z-0 shadow-inner">
                <MapContainer center={position} zoom={18} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />

                    {pois.map((poi, idx) => (
                        <Marker
                            key={`${poi.id}-${idx}`}
                            position={[poi.lat, poi.lon]}
                            icon={poiIcon}
                            eventHandlers={{
                                click: () => {
                                    setPosition(new L.LatLng(poi.lat, poi.lon))
                                }
                            }}
                        >
                            <Popup offset={[0, -5]}>
                                <div className="text-[11px] font-bold text-blue-600 max-w-[180px] text-center p-1">
                                    {poi.name}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur px-2 py-1 rounded-lg border border-border text-[9px] font-bold text-muted-foreground shadow-sm">
                    {pois.length} Locations Nearby
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-[1000] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    </div>
                )}
            </div>

            <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                <MapPin className="h-3 w-3 text-blue-600" /> Click on the map or blue landmark dots to pin your exact location
            </p>
        </div>
    )
}
