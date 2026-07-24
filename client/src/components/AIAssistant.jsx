import { useState, useRef, useEffect } from 'react'

function AIAssistant({ machines, onRecommend }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Namaste! 🙏 Main Trakto AI Sahayak hoon. Batao aapko kaisi machine chahiye — jaise "sasta tractor" ya "khet jotne ke liye kuch"' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const analyzeQuery = (query) => {
    const q = query.toLowerCase()
    let candidates = [...machines]

    // Intent: type detection
    const typeMap = {
      tractor: 'Tractor', jotne: 'Tractor', jutai: 'Tractor',
      harvester: 'Harvester', katai: 'Harvester', fasal: 'Harvester',
      sprayer: 'Sprayer', dawa: 'Sprayer', spray: 'Sprayer',
      seeder: 'Seeder', beej: 'Seeder', bona: 'Seeder',
    }
    let matchedType = null
    for (const key in typeMap) {
      if (q.includes(key)) matchedType = typeMap[key]
    }
    if (matchedType) candidates = candidates.filter((m) => m.type === matchedType)

    // Intent: price sensitivity
    const wantsCheap = /sasta|kam paise|budget|cheap/.test(q)
    const wantsNear = /paas|nazdeek|near|kareeb/.test(q)

    if (wantsCheap) candidates.sort((a, b) => a.price - b.price)
    else if (wantsNear) candidates.sort((a, b) => (parseFloat(a.distance) || 99) - (parseFloat(b.distance) || 99))
    else candidates.sort((a, b) => a.price - b.price)

    return candidates[0] || null
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    const query = input
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const best = analyzeQuery(query)
      let reply
      if (best) {
        reply = {
          from: 'ai',
          text: `Aapke liye best option: **${best.name}** (${best.owner}, ${best.distance} door) — ₹${best.price}/bigha. Ye dekho 👇`,
          machine: best,
        }
      } else {
        reply = { from: 'ai', text: 'Maaf karo, is criteria ki koi machine abhi available nahi hai. Kuch aur try karo?' }
      }
      setTyping(false)
      setMessages((prev) => [...prev, reply])
    }, 900 + Math.random() * 600)
  }

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => setOpen(!open)}
        className="fab-pulse fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[var(--pine)] text-white flex items-center justify-center text-2xl shadow-xl hover:bg-[var(--pine-dark)] active:scale-90 transition-all duration-200"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden bubble-in flex flex-col" style={{ height: '420px' }}>
          <div className="bg-[var(--pine)] px-4 py-3 flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <div>
              <p className="text-white text-sm font-semibold font-display">Trakto AI Sahayak</p>
              <p className="text-white/60 text-[10px]">Online · Turant reply</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[var(--ivory)]">
            {messages.map((m, i) => (
              <div key={i} className={`bubble-in flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    m.from === 'user'
                      ? 'bg-[var(--pine)] text-white rounded-br-sm'
                      : 'bg-white border border-black/5 text-[var(--ink)] rounded-bl-sm'
                  }`}
                >
                  {m.text}
                  {m.machine && (
                    <button
                      onClick={() => onRecommend(m.machine)}
                      className="mt-2 w-full bg-[var(--gold)] text-[var(--ink)] text-[11px] font-semibold py-1.5 rounded-lg hover:brightness-95 active:scale-95 transition-all"
                    >
                      Dekho aur Book karo →
                    </button>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start bubble-in">
                <div className="bg-white border border-black/5 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted)] typing-dot" style={{ animationDelay: '0s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted)] typing-dot" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted)] typing-dot" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-2.5 border-t border-black/5 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Apni zarurat likho..."
              className="flex-1 border border-black/10 rounded-full px-3 py-2 text-xs focus:outline-none focus:border-[var(--pine)] transition-all"
            />
            <button
              onClick={handleSend}
              className="w-8 h-8 rounded-full bg-[var(--pine)] text-white flex items-center justify-center text-sm hover:bg-[var(--pine-dark)] active:scale-90 transition-all"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AIAssistant