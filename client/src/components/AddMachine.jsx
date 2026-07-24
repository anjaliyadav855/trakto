import { useState } from 'react'
import { API_URL } from '../config'

const types = [
  { key: 'Tractor', icon: '🚜' },
  { key: 'Harvester', icon: '🌾' },
  { key: 'Sprayer', icon: '💧' },
  { key: 'Seeder', icon: '🌱' },
]

function AddMachine({ onMachineAdded }) {
  const [form, setForm] = useState({
    name: '',
    type: 'Tractor',
    owner: '',
    ownerPhone: '',
    distance: '',
    price: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.owner || !form.price) {
      alert('Naam, owner aur price zaroori hai')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/machines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      })
      if (!res.ok) throw new Error('Failed to add machine')
      setSuccess(true)
      setForm({ name: '', type: 'Tractor', owner: '', ownerPhone: '', distance: '', price: '' })
      if (onMachineAdded) onMachineAdded()
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      console.error(err)
      alert('Machine add karne mein error aaya')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-glow bg-white rounded-2xl p-5 border border-black/5 mb-5 fade-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--pine)]/10 flex items-center justify-center text-sm">
          ➕
        </div>
        <h2 className="font-display font-semibold text-[var(--ink)]">Nayi Machine Add Karo</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Machine ka naam (e.g. Mahindra Tractor)"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--pine)]/20 focus:border-[var(--pine)] transition-all"
        />

        <div className="grid grid-cols-4 gap-2">
          {types.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setForm({ ...form, type: t.key })}
              className={`rounded-xl py-2.5 flex flex-col items-center gap-1 border transition-all duration-200 active:scale-95 ${
                form.type === t.key
                  ? 'bg-[var(--pine)] border-[var(--pine)]'
                  : 'bg-white border-black/10 hover:border-[var(--pine)]/30'
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              <p className={`text-[9px] font-medium ${
                form.type === t.key ? 'text-white' : 'text-[var(--muted)]'
              }`}>
                {t.key}
              </p>
            </button>
          ))}
        </div>

        <input
          type="text"
          name="owner"
          placeholder="Owner ka naam"
          value={form.owner}
          onChange={handleChange}
          className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--pine)]/20 focus:border-[var(--pine)] transition-all"
        />

        <input
          type="tel"
          name="ownerPhone"
          placeholder="Owner ka phone number"
          value={form.ownerPhone}
          onChange={handleChange}
          className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--pine)]/20 focus:border-[var(--pine)] transition-all"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="distance"
            placeholder="Distance (2 KM)"
            value={form.distance}
            onChange={handleChange}
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--pine)]/20 focus:border-[var(--pine)] transition-all"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--pine)]/20 focus:border-[var(--pine)] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--pine)] text-white py-3 rounded-xl text-sm font-medium hover:bg-[var(--pine-dark)] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>}
          {loading ? 'Adding...' : success ? '✅ Added!' : 'Add Machine'}
        </button>
      </form>
    </div>
  )
}

export default AddMachine