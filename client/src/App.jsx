import Header from './components/Header'
import SearchBox from './components/SearchBox'
import MachineCard from './components/MachineCard'
import { machines } from './data'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Header />
      <SearchBox />

      <div className="grid grid-cols-4 gap-3 mb-4 text-center text-xs text-gray-600">
        <div>🚜<p>Tractor</p></div>
        <div>🌾<p>Harvester</p></div>
        <div>💧<p>Sprayer</p></div>
        <div>🌱<p>Seeder</p></div>
      </div>

      {machines.map((machine) => (
        <MachineCard
          key={machine.id}
          name={machine.name}
          owner={machine.owner}
          distance={machine.distance}
          price={machine.price}
        />
      ))}
    </div>
  )
}

export default App