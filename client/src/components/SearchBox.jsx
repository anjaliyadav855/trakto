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
    recognition.lang = 'hi-IN' // Hindi (India)
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setListening(true)
    }

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      if (onSearch) onSearch(text)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.start()
    recognitionRef.current = recognition
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow mb-4">
      <p className="text-sm text-gray-500 mb-2">Bolkar khoje</p>
      <button
        onClick={startListening}
        disabled={listening}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${
          listening
            ? 'bg-red-100 text-red-600 animate-pulse'
            : 'bg-green-100 text-green-700'
        }`}
      >
        {listening ? '🔴 Sun raha hoon...' : '🎤 Tap karke boliye'}
      </button>

      {transcript && (
        <p className="text-sm text-gray-600 mt-2">
          Aapne kaha: <span className="font-medium">{transcript}</span>
        </p>
      )}
    </div>
  )
}

export default SearchBox