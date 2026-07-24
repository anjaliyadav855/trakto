import { useEffect, useState } from 'react'
import Header from './components/header'
import SearchBox from './components/SearchBox'
import MachineCard from './components/MachineCard'
import MyBookings from './components/MyBookings'
import OwnerDashboard from './components/OwnerDashboard'
import AddMachine from './components/AddMachine'
import Login from './components/Login'
import { API_URL } from './config'
import AIAssistant from './components/AIAssistant'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trakto_user')
    return saved ? JSON.parse(saved) : null
  })
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('browse')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchMachines = () => {
    setLoading(true)
    fetch(`${API_URL}/api/machines`)
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

  if (!user) {
    return <Login onLogin={setUser} />
  }

  const filteredMachines = machines.filter((machine) =>
    searchQuery
      ? machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        machine.type?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  )

  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Header />

        <div className="flex justify-between items-center -mt-4 mb-4 md:mb-6">
          <p className="text-xs md:text-sm text-[var(--muted)]">👋 {user.name}</p>
          <button
            onClick={() => {
              localStorage.removeItem('trakto_user')
              setUser(null)
            }}
            className="text-xs md:text-sm text-red-500 font-medium hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-1 mb-5 md:mb-8 bg-black/[0.04] p-1 rounded-xl max-w-md md:max-w-sm">
          {[
            { key: 'browse', label: 'Machines' },
            { key: 'bookings', label: 'My Bookings' },
            { key: 'owner', label: 'Owner' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === tab.key
                  ? 'bg-white text-[var(--pine)] shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {view === 'browse' ? (
          <div className="md:grid md:grid-cols-[280px_1fr] md:gap-6 items-start">
            {/* Left column on desktop: search + categories */}
            <div className="md:sticky md:top-8">
              <SearchBox onSearch={(text) => setSearchQuery(text)} />

              <div className="grid grid-cols-4 md:grid-cols-2 gap-2 mb-5">
                {[
                  { icon: '🚜', label: 'Tractor' },
                  { icon: '🌾', label: 'Harvester' },
                  { icon: '💧', label: 'Sprayer' },
                  { icon: '🌱', label: 'Seeder' },
                ].map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setSearchQuery(searchQuery === cat.label ? '' : cat.label)}
                    className={`rounded-xl py-3 flex flex-col items-center gap-1 border transition-all duration-200 active:scale-95 hover:-translate-y-0.5 ${
                      searchQuery === cat.label
                        ? 'bg-[var(--pine)] border-[var(--pine)]'
                        : 'bg-white border-black/5 hover:border-[var(--pine)]/30 hover:bg-[var(--pine)]/5'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <p className={`text-[11px] font-medium ${
                      searchQuery === cat.label ? 'text-white' : 'text-[var(--muted)]'
                    }`}>
                      {cat.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right column: machine grid */}
            <div>
              {loading && (
                <div className="grid md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden border border-black/5">
                      <div className="h-24 skeleton"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 skeleton rounded w-2/3"></div>
                        <div className="h-3 skeleton rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && searchQuery && (
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-[var(--muted)] font-mono">
                    "{searchQuery}" · {filteredMachines.length} results
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[var(--pine)] font-medium hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}

              {!loading && filteredMachines.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-4xl mb-2">🔍</p>
                  <p className="text-sm text-[var(--muted)]">Koi machine nahi mili</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-3">
                {filteredMachines.map((machine, i) => (
                  <MachineCard
                    key={machine._id}
                    index={i}
                    id={machine._id}
                    name={machine.name}
                    owner={machine.owner}
                    distance={machine.distance}
                    price={machine.price}
                    type={machine.type}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : view === 'bookings' ? (
          <div className="max-w-2xl">
            <MyBookings />
          </div>
        ) : (
          <div className="md:grid md:grid-cols-[380px_1fr] md:gap-6 items-start">
            <AddMachine onMachineAdded={fetchMachines} />
            <OwnerDashboard />
          </div>
        )}
     </div>

      {!loading && (
        <AIAssistant
          machines={machines}
          onRecommend={(machine) => {
            setSearchQuery(machine.name)
            setView('browse')
          }}
        />
      )}
    </div>
  )
}

export default App