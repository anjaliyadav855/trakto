function Header() {
  return (
    <div className="flex items-center justify-between mb-6 px-1">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🚜</span>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Trakto</h1>
          <p className="text-xs text-gray-400">Khet ka kaam, ek tap mein</p>
        </div>
      </div>
      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-sm font-semibold text-green-700">
        A
      </div>
    </div>
  )
}

export default Header