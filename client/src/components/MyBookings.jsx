import { useState } from 'react'
import { API_URL } from '../config'

const STATUS_STEPS = [
  { key: 'requested', label: 'Requested', icon: '📋' },
  { key: 'assigned', label: 'Assigned', icon: '👨‍🌾' },
  { key: 'in-progress', label: 'On the way', icon: '🚜' },
  { key: 'completed', label: 'Completed', icon: '✅' },
]

function StatusTimeline({ status }) {
  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === status)

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500 font-medium py-2">
        ❌ Booking cancelled
      </div>
    )
  }

  return (
    <div className="py-2">
      <div className="flex items-center">
        {STATUS_STEPS.map((step, i) => {
          const done = i <= currentIdx
          const active = i === currentIdx
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-500 ${
                    done
                      ? 'bg-[var(--pine)] text-white'
                      : 'bg-black/5 text-[var(--muted)]'
                  } ${active ? 'ring-4 ring-[var(--pine)]/20 scale-110' : ''}`}
                >
                  {step.icon}
                </div>
                <p className={`text-[9px] mt-1 font-medium whitespace-nowrap ${
                  done ? 'text-[var(--pine)]' : 'text-[var(--muted)]'
                }`}>
                  {step.label}
                </p>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 mb-4 rounded-full overflow-hidden bg-black/5">
                  <div
                    className={`h-full bg-[var(--pine)] transition-all duration-700 ${
                      i < currentIdx ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RouteVisual({ active }) {
  return (
    <div className="relative h-16 bg-[var(--pine)]/5 rounded-xl overflow-hidden mb-3">
      <svg viewBox="0 0 300 60" className="w-full h-full" preserveAspectRatio="none">
        <path
          d="M10,45 Q80,10 150,30 T290,15"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="2"
          strokeDasharray="5 5"
          className="furrow-line"
        />
        <circle cx="10" cy="45" r="4" fill="var(--pine)" />
        <circle cx="290" cy="15" r="4" fill="var(--sky)" />
      </svg>
      {active && (
        <span className="absolute text-lg" style={{ left: '45%', top: '35%' }}>
          🚜
        </span>
      )}
    </div>
  )
}

function MyBookings() {
  const [phone, setPhone] = useState('')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const fetchBookings = async () => {
    if (!phone) {
      alert('Phone number daalo')
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`${API_URL}/api/bookings/phone/${phone}`)
      const data = await res.json()
      setBookings(data)
    } catch (err) {
      console.error(err)
      alert('Kuch galat ho gaya')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 mb-4">
        <p className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-2.5">
          Apna phone number daalo
        </p>
        <div className="flex gap-2">
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--pine)]/20 focus:border-[var(--pine)] transition-all"
          />
          <button
            onClick={fetchBookings}
            className="bg-[var(--pine)] text-white px-5 rounded-xl text-sm font-medium hover:bg-[var(--pine-dark)] active:scale-95 transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-[var(--muted)] text-center">Loading...</p>}

      {searched && !loading && bookings.length === 0 && (
        <div className="text-center py-10">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm text-[var(--muted)]">Is number se koi booking nahi mili</p>
        </div>
      )}

      {bookings.map((booking, i) => (
        <div
          key={booking._id}
          className="fade-up bg-white rounded-2xl p-4 shadow-sm border border-black/5 mb-3"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-display font-semibold text-[var(--ink)]">{booking.machine?.name}</p>
              <p className="text-xs text-[var(--muted)]">{booking.location} · {booking.workType}</p>
            </div>
            <p className="text-[10px] font-mono text-[var(--muted)]">
              {new Date(booking.createdAt).toLocaleDateString()}
            </p>
          </div>

          <RouteVisual active={booking.status === 'in-progress'} />

          <StatusTimeline status={booking.status} />

          {booking.status === 'assigned' || booking.status === 'in-progress' ? (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--gold)]/20 flex items-center justify-center text-sm">
                  👨‍🌾
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--ink)]">{booking.machine?.owner}</p>
                  <p className="text-[10px] text-[var(--muted)]">Machine Owner</p>
                </div>
              </div>
              <a
                href={`tel:${booking.machine?.ownerPhone}`}
                className="w-9 h-9 rounded-full bg-[var(--pine)] text-white flex items-center justify-center text-sm hover:bg-[var(--pine-dark)] active:scale-95 transition-all"
              >
                📞
              </a>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default MyBookings