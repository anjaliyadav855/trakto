import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Fix default marker icon issue with Leaflet + React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null)
  const [address, setAddress] = useState('')
  const [locating, setLocating] = useState(false)

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await res.json()
      const shortAddress = data.display_name?.split(',').slice(0, 3).join(',') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      setAddress(shortAddress)
      onLocationSelect({ lat, lng, address: shortAddress })
    } catch (err) {
      console.error(err)
      const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      setAddress(fallback)
      onLocationSelect({ lat, lng, address: fallback })
    }
  }

  const handlePick = (lat, lng) => {
    setPosition([lat, lng])
    reverseGeocode(lat, lng)
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Aapka browser location support nahi karta')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        handlePick(latitude, longitude)
        setLocating(false)
      },
      (err) => {
        console.error(err)
        alert('Location access nahi mila. Permission allow karo ya map pe tap karke select karo.')
        setLocating(false)
      }
    )
  }

  useEffect(() => {
    detectLocation()
  }, [])

  const defaultCenter = [28.4744, 77.5040] // Greater Noida fallback

  return (
    <div className="rounded-xl overflow-hidden border border-black/10">
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--pine)]/5">
        <p className="text-xs text-[var(--muted)] truncate flex-1">
          📍 {address || 'Location detect ho rahi hai...'}
        </p>
        <button
          type="button"
          onClick={detectLocation}
          disabled={locating}
          className="text-[10px] font-medium text-[var(--pine)] whitespace-nowrap ml-2 hover:underline"
        >
          {locating ? '...' : '🎯 Refresh'}
        </button>
      </div>

      <div style={{ height: '180px' }}>
        <MapContainer
          center={position || defaultCenter}
          zoom={position ? 15 : 11}
          style={{ height: '100%', width: '100%' }}
          key={position ? position.join(',') : 'default'}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {position && <Marker position={position} />}
          <ClickHandler onPick={handlePick} />
        </MapContainer>
      </div>

      <p className="text-[10px] text-[var(--muted)] px-3 py-1.5 bg-black/[0.02]">
        Map pe tap karke bhi location badal sakte ho
      </p>
    </div>
  )
}

export default LocationPicker