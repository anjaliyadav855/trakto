import { useState } from 'react'

function MachineCard({ name, owner, distance, price }) {
  const [booked, setBooked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleBooking = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setBooked(true)
    }, 1000)
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200 mb-3">
      <h2 className="font-semibold">{name}</h2>
      <p className="text-sm text-gray-500">{owner} · {distance} door</p>
      <div className="flex justify-between items-center mt-3">
        <p className="font-bold text-lg">₹{price}/bigha</p>

        {booked ? (
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
            ✅ Booked!
          </span>
        ) : (
          <button
            onClick={handleBooking}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium
                       transition-all duration-200
                       shadow-lg shadow-blue-500/100
                       hover:bg-blue-700 hover:shadow-blue-600/60
                       active:bg-green-800 active:scale-90 active:shadow-blue-700/100
                       disabled:bg-yellow-400
                       flex items-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Booking..." : "Book Now"}
          </button>
        )}
      </div>
    </div>
  )
}

export default MachineCard