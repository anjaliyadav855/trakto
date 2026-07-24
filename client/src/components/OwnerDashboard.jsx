import { useEffect, useState } from 'react'
import { API_URL } from '../config'

function OwnerDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const statusFlow = ['requested', 'assigned', 'in-progress', 'completed']

  const statusColors = {
    requested: 'bg-amber-50 text-amber-700 border-amber-200',
    assigned: 'bg-blue-50 text-blue-700 border-blue-200',
    'in-progress': 'bg-purple-50 text-purple-700 border-purple-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  }

  const fetchAllBookings = () => {
    setLoading(true)
    fetch(`${API_URL}/api/bookings`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAllBookings()
  }, [])

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchAllBookings()
    } catch (err) {
      console.error(err)
      alert('Status update fail ho gaya')
    }
  }

  const getNextStatus = (current) => {
    const idx = statusFlow.indexOf(current)
    if (idx === -1 || idx === statusFlow.length - 1) return null
    return statusFlow[idx + 1]
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-black/5">
            <div className="h-4 skeleton rounded w-1/2 mb-2"></div>
            <div className="h-3 skeleton rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--pine)]/10 flex items-center justify-center text-sm">
          📋
        </div>
        <h2 className="font-display font-semibold text-[var(--ink)]">Saari Bookings</h2>
        <span className="ml-auto text-xs font-mono text-[var(--muted)] bg-black/5 px-2 py-1 rounded-full">
          {bookings.length}
        </span>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-10">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm text-[var(--muted)]">Koi booking nahi hai abhi</p>
        </div>
      )}

      {bookings.map((booking, i) => {
        const next = getNextStatus(booking.status)
        return (
          <div
            key={booking._id}
            className="fade-up bg-white rounded-2xl p-4 shadow-sm border border-black/5 mb-3 hover:shadow-md transition-shadow duration-300"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-display font-semibold text-sm text-[var(--ink)]">{booking.machine?.name}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{booking.farmerName} · {booking.farmerPhone}</p>
                <p className="text-xs text-[var(--muted)]">{booking.location} · {booking.workType}</p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium border ${statusColors[booking.status]}`}>
                {booking.status}
              </span>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-black/5">
              {next && (
                <button
                  onClick={() => updateStatus(booking._id, next)}
                  className="bg-[var(--pine)] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[var(--pine-dark)] active:scale-95 transition-all"
                >
                  Mark as {next} →
                </button>
              )}
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <button
                  onClick={() => updateStatus(booking._id, 'cancelled')}
                  className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 active:scale-95 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OwnerDashboard