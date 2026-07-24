import { useState } from 'react'

function MyBookings() {
  const [phone, setPhone] = useState('')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const statusColors = {
    requested: 'bg-yellow-100 text-yellow-700',
    assigned: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const statusLabels = {
    requested: '⏳ Requested',
    assigned: '👨‍🌾 Assigned',
    'in-progress': '🚜 In Progress',
    completed: '✅ Completed',
    cancelled: '❌ Cancelled',
  }

  const fetchBookings = async () => {
    if (!phone) {
      alert('Phone number daalo')
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/phone/${phone}`)
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
    <div className="bg-white rounded-xl p-4 shadow mb-4">
      <p className="text-sm text-gray-500 mb-2">Apna phone number daalo bookings dekhne ke liye</p>
      <div className="flex gap-2 mb-3">
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={fetchBookings}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading...</p>}

      {searched && !loading && bookings.length === 0 && (
        <p className="text-sm text-gray-400">Is number se koi booking nahi mili</p>
      )}

      {bookings.map((booking) => (
        <div key={booking._id} className="border rounded-lg p-3 mb-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-sm">{booking.machine?.name}</p>
              <p className="text-xs text-gray-500">{booking.location} · {booking.workType}</p>
              <p className="text-xs text-gray-400">
                {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[booking.status]}`}>
              {statusLabels[booking.status]}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyBookings