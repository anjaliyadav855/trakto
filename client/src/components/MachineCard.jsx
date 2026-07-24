import { useState } from 'react'
import { API_URL } from '../config'

const typeStyles = {
  Tractor: { icon: '🚜', gradient: 'from-[#1F4D3B] to-[#3B7A5A]' },
  Harvester: { icon: '🌾', gradient: 'from-[#D9A441] to-[#B8842E]' },
  Sprayer: { icon: '💧', gradient: 'from-[#3B6E8F] to-[#2A5068]' },
  Seeder: { icon: '🌱', gradient: 'from-[#6B9E5E] to-[#4C7D42]' },
}

function MachineCard({ id, name, owner, distance, price, type, index = 0 }) {
  const [booked, setBooked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [farmerName, setFarmerName] = useState('')
  const [farmerPhone, setFarmerPhone] = useState('')
  const [location, setLocation] = useState('')

  const style = typeStyles[type] || typeStyles.Tractor

  const handleBooking = async () => {
    if (!farmerName || !farmerPhone) {
      alert('Naam aur phone number zaroori hai')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
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
    <div
      className="fade-up bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 mb-3"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Illustrated gradient banner */}
      <div className={`relative h-24 bg-gradient-to-br ${style.gradient} flex items-center justify-center overflow-hidden`}>
        <span className="text-5xl drop-shadow-md transition-transform duration-500 hover:scale-110">
          {style.icon}
        </span>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10"></div>
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/10"></div>
        <span className="absolute top-2 left-3 text-[10px] font-mono uppercase tracking-wider text-white/80 bg-black/20 px-2 py-0.5 rounded-full">
          {type}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h2 className="font-display font-semibold text-[var(--ink)] truncate">{name}</h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">{owner} · {distance} door</p>
          </div>
        </div>

        {showForm && !booked && (
          <div className="mt-3 space-y-2 fade-up" style={{ animationDelay: '0ms' }}>
            <input
              type="text"
              placeholder="Aapka naam"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--pine)]/20 focus:border-[var(--pine)] transition-all"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={farmerPhone}
              onChange={(e) => setFarmerPhone(e.target.value)}
              className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--pine)]/20 focus:border-[var(--pine)] transition-all"
            />
            <input
              type="text"
              placeholder="Location / Gaon ka naam"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--pine)]/20 focus:border-[var(--pine)] transition-all"
            />
          </div>
        )}

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/5">
          <p className="font-mono font-semibold text-lg text-[var(--ink)]">
            ₹{price}<span className="text-[10px] font-sans font-normal text-[var(--muted)]">/bigha</span>
          </p>

          {booked ? (
            <span className="bg-[var(--pine)]/10 text-[var(--pine)] px-4 py-2 rounded-lg text-sm font-medium">
              ✅ Booked!
            </span>
          ) : showForm ? (
            <button
              onClick={handleBooking}
              disabled={loading}
              className="bg-[var(--pine)] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:bg-gray-300 flex items-center gap-2 hover:bg-[var(--pine-dark)] active:scale-95 transition-all"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Booking..." : "Confirm"}
            </button>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="bg-[var(--pine)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--pine-dark)] active:scale-95 transition-all"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MachineCard