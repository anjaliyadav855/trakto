import { useEffect, useState } from 'react'

function OwnerDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const statusFlow = ['requested', 'assigned', 'in-progress', 'completed']

  const statusColors = {
    requested: 'bg-yellow-100 text-yellow-700',
    assigned: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const fetchAllBookings = () => {
    setLoading(true)
    fetch('http://localhost:5000/api/bookings')
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
      await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
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

  if (loading) return <p className="text-center text-gray-400">Loading bookings...</p>

  return (
    <div>
      <h2 className="font-semibold text-lg mb-3">Saari Bookings (Owner View)</h2>
      {bookings.length === 0 && (
        <p className="text-sm text-gray-400">Koi booking nahi hai abhi</p>
      )}
      {bookings.map((booking) => {
        const next = getNextStatus(booking.status)
        return (
          <div key={booking._id} className="bg-white rounded-xl p-4 shadow mb-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-sm">{booking.machine?.name}</p>
                <p className="text-xs text-gray-500">{booking.farmerName} · {booking.farmerPhone}</p>
                <p className="text-xs text-gray-500">{booking.location} · {booking.workType}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[booking.status]}`}>
                {booking.status}
              </span>
            </div>

            <div className="flex gap-2 mt-2">
              {next && (
                <button
                  onClick={() => updateStatus(booking._id, next)}
                  className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  Mark as {next}
                </button>
              )}
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <button
                  onClick={() => updateStatus(booking._id, 'cancelled')}
                  className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium"
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