import { useState } from 'react'

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
      const res = await fetch('http://localhost:5000/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
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
    <div className="bg-white rounded-xl p-4 shadow mb-4">
      <h2 className="font-semibold text-lg mb-3">Nayi Machine Add Karo</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Machine ka naam (e.g. Mahindra Tractor)"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="Tractor">Tractor</option>
          <option value="Harvester">Harvester</option>
          <option value="Sprayer">Sprayer</option>
          <option value="Seeder">Seeder</option>
        </select>

        <input
          type="text"
          name="owner"
          placeholder="Owner ka naam"
          value={form.owner}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="tel"
          name="ownerPhone"
          placeholder="Owner ka phone number"
          value={form.ownerPhone}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="text"
          name="distance"
          placeholder="Distance (e.g. 2 KM)"
          value={form.distance}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="number"
          name="price"
          placeholder="Price per bigha (₹)"
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium disabled:bg-yellow-400"
        >
          {loading ? 'Adding...' : success ? '✅ Added!' : 'Add Machine'}
        </button>
      </form>
    </div>
  )
}

export default AddMachine