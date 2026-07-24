function Header() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--pine)] flex items-center justify-center text-lg">
            🚜
          </div>
          <span className="font-display font-bold text-lg text-[var(--ink)] tracking-tight">
            Trakto
          </span>
        </div>
        <div className="w-9 h-9 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/40 flex items-center justify-center text-sm font-semibold text-[var(--pine)]">
          A
        </div>
      </div>

      {/* Hero band */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--pine)] px-5 py-6 mb-1">
        <p className="font-display text-white text-xl font-semibold leading-snug relative z-10">
          Khet ka kaam,<br />ab ek tap door.
        </p>
        <p className="text-white/70 text-xs mt-1.5 relative z-10">
          Tractor, harvester, sprayer — sab kuch aapke gaon mein
        </p>

        {/* Signature furrow line */}
        <svg
          className="absolute bottom-0 left-0 w-full h-10"
          viewBox="0 0 400 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 Q100,10 200,25 T400,15"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 6"
            className="furrow-line"
            opacity="0.8"
          />
        </svg>

        <span className="absolute top-3 right-4 text-3xl opacity-20">🌾</span>
      </div>
    </div>
  )
}

export default Header