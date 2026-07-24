import { useEffect, useState } from 'react'
import Header from './components/header'
import SearchBox from './components/SearchBox'
import MachineCard from './components/MachineCard'
import MyBookings from './components/MyBookings'
import OwnerDashboard from './components/OwnerDashboard'
import AddMachine from './components/AddMachine'

function App() {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('browse')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchMachines = () => {
    setLoading(true)
    fetch('http://localhost:5000/api/machines')
      .then((res) => res.json())
      .then((data) => {
        setMachines(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Machines fetch failed:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchMachines()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/40 to-gray-50 p-4">
      <Header />

      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setView('browse')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            view === 'browse' ? 'bg-white text-Red-700 shadow-sm' : 'text-gray-500'
          }`}
        >
          Machines
        </button>
        <button
          onClick={() => setView('bookings')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            view === 'bookings' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'
          }`}
        >
          My Bookings
        </button>
        <button
          onClick={() => setView('owner')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            view === 'owner' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'
          }`}
        >
          Owner
        </button>
      </div>

      {view === 'browse' ? (
        <>
          <SearchBox onSearch={(text) => setSearchQuery(text)} />

          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { icon: '🚜', label: 'Tractor' },
              { icon: '🌾', label: 'Harvester' },
              { icon: '💧', label: 'Sprayer' },
              { icon: '🌱', label: 'Seeder' },
            ].map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSearchQuery(cat.label)}
                className="bg-white rounded-xl py-3 flex flex-col items-center gap-1 border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all active:scale-95"
              >
                <span className="text-xl">{cat.icon}</span>
                <p className="text-[11px] text-gray-500 font-medium">{cat.label}</p>
              </button>
            ))}
          </div>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-100"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && searchQuery && (
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400">
                "{searchQuery}" ke results
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-green-600 font-medium"
              >
                Clear
              </button>
            </div>
          )}

          {machines
            .filter((machine) =>
              searchQuery
                ? machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  machine.type?.toLowerCase().includes(searchQuery.toLowerCase())
                : true
            )
            .map((machine) => (
              <MachineCard
                key={machine._id}
                id={machine._id}
                name={machine.name}
                owner={machine.owner}
                distance={machine.distance}
                price={machine.price}
                type={machine.type}
              />
            ))}
        </>
      ) : view === 'bookings' ? (
        <MyBookings />
      ) : (
        <>
          <AddMachine onMachineAdded={fetchMachines} />
          <OwnerDashboard />
        </>
      )}
    </div>
  )
}

export default App