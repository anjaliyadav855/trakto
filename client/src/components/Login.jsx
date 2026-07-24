import { useState } from 'react'
import { API_URL } from '../config'

function Login({ onLogin }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!name || !phone) {
      alert('Naam aur phone number dono zaroori hai')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      })
      const user = await res.json()
      localStorage.setItem('trakto_user', JSON.stringify(user))
      onLogin(user)
    } catch (err) {
      console.error(err)
      alert('Login fail ho gaya, dobara try karo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating ambient elements */}
      <span className="absolute top-[12%] left-[8%] text-4xl opacity-20 float-slow">🌾</span>
      <span className="absolute bottom-[15%] right-[10%] text-5xl opacity-15 float-slow-delay">🚜</span>
      <span className="absolute top-[20%] right-[15%] text-2xl opacity-20 float-slow-delay">🌱</span>
      <span className="absolute bottom-[25%] left-[12%] text-3xl opacity-15 float-slow">💧</span>

      {/* Signature furrow line across the background */}
      <svg className="absolute bottom-24 left-0 w-full h-16 opacity-40" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path
          d="M0,45 Q100,15 200,35 T400,20"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          className="furrow-line"
        />
      </svg>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 scale-in">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl mx-auto mb-4 glow-pulse">
            🚜
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">Trakto</h1>
          <p className="text-white/60 text-sm mt-1">Khet ka kaam, ek tap mein</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="card-glow bg-white/95 backdrop-blur-xl rounded-2xl p-6 scale-in border border-white/50"
          style={{ animationDelay: '120ms' }}
        >
          <p className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-5">
            Login karo
          </p>

          <div className="space-y-4">
            <div className="relative">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focused === 'name' || name
                    ? '-top-2 text-[10px] bg-white px-1.5 text-[var(--pine)] font-medium'
                    : 'top-3.5 text-sm text-[var(--muted)]'
                }`}
              >
                Aapka naam
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused('')}
                className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--pine)] transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focused === 'phone' || phone
                    ? '-top-2 text-[10px] bg-white px-1.5 text-[var(--pine)] font-medium'
                    : 'top-3.5 text-sm text-[var(--muted)]'
                }`}
              >
                Phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused('')}
                className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--pine)] transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative w-full bg-[var(--pine)] text-white py-3.5 rounded-xl text-sm font-semibold mt-5 overflow-hidden hover:bg-[var(--pine-dark)] active:scale-[0.97] transition-all duration-200 disabled:opacity-60 group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              )}
              {loading ? 'Login ho raha hai...' : 'Continue →'}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          </button>

          <p className="text-center text-[10px] text-[var(--muted)] mt-4">
            Login karke aap Trakto ki shartein maante hain
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login