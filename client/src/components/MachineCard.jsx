import { useState } from 'react'

const typeIcons = {
  Tractor: '🚜',
  Harvester: '🌾',
  Sprayer: '💧',
  Seeder: '🌱',
  JCB: '🏗️',
}

function MachineCard({ id, name, owner, distance, price, type }) {
  const [booked, setBooked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [farmerName, setFarmerName] = useState('')
  const [farmerPhone, setFarmerPhone] = useState('')
  const [location, setLocation] = useState('')

  const handleBooking = async () => {
    if (!farmerName || !farmerPhone) {
      alert('Naam aur phone number zaroori hai')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineId: id,
          farmerName,
          farmerPhone,
          workType: 'Ploughing',
          location,
        }),
      })
      if (!res.ok) throw new Error('Booking failed')
      setBooked(true)
      setShowForm(false)
    } catch (err) {
      console.error(err)
      alert('Booking fail ho gayi, dobara try karo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-100 transition-all duration-200 mb-3">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl shrink-0">
          {typeIcons[type] || '🚜'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 truncate">{name}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{owner} · {distance} door</p>
        </div>
      </div>

      {showForm && !booked && (
        <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            type="text"
            placeholder="Aapka naam"
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={farmerPhone}
            onChange={(e) => setFarmerPhone(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all"
          />
          <input
            type="text"
            placeholder="Location / Gaon ka naam"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all"
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
        <p className="font-bold text-lg text-gray-900">
          ₹{price}<span className="text-xs font-normal text-gray-400">/bigha</span>
        </p>

        {booked ? (
          <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
            ✅ Booked!
          </span>
        ) : showForm ? (
          <button
            onClick={handleBooking}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:bg-gray-300 flex items-center gap-2 hover:bg-green-700 active:scale-95 transition-all"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Booking..." : "Confirm"}
          </button>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 active:scale-95 transition-all"
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  )
}

export default MachineCard