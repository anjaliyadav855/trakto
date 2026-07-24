import { useState, useRef } from 'react'

function SearchBox({ onSearch }) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Aapka browser voice search support nahi karta. Chrome use karo.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setListening(true)

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      if (onSearch) onSearch(text)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setListening(false)
    }

    recognition.onend = () => setListening(false)

    recognition.start()
    recognitionRef.current = recognition
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 mb-4">
      <p className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-2.5">
        Bolkar khoje
      </p>
      <button
        onClick={startListening}
        disabled={listening}
        className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
          listening
            ? 'bg-[var(--sky)]/10 text-[var(--sky)]'
            : 'bg-[var(--pine)]/8 text-[var(--pine)] hover:bg-[var(--pine)]/15 active:scale-[0.98]'
        }`}
      >
        {listening ? (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--sky)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--sky)]"></span>
            </span>
            Sun raha hoon...
          </>
        ) : (
          <>🎤 Tap karke boliye</>
        )}
      </button>

      {transcript && (
        <p className="text-sm text-[var(--muted)] mt-2.5 fade-up">
          Aapne kaha: <span className="font-medium text-[var(--ink)]">"{transcript}"</span>
        </p>
      )}
    </div>
  )
}

export default SearchBox