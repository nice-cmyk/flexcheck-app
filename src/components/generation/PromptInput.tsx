import { useEffect, useRef, useState } from 'react'
import { Mic, Square } from 'lucide-react'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  quickPrompts?: string[]
  placeholder?: string
}

export default function PromptInput({
  value,
  onChange,
  quickPrompts = [],
  placeholder = 'e.g. Put me in a luxury Tokyo apartment with a skyline view and an iPhone 17 on the desk...',
}: PromptInputProps) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<any>(null)
  const baseValueRef = useRef(value)

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      const base = baseValueRef.current
      onChange(base ? `${base} ${transcript}` : transcript)
    }

    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition
    return () => {
      recognition.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleListening() {
    if (!recognitionRef.current) return
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      baseValueRef.current = value.trim()
      recognitionRef.current.start()
      setListening(true)
    }
  }

  return (
    <div>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[70px] bg-surface/80 border border-primary/30 rounded-xl p-3.5 pr-11 text-sm text-white placeholder:text-white/40 outline-none focus:border-primary resize-none"
        />
        {supported && (
          <button
            type="button"
            onClick={toggleListening}
            aria-label={listening ? 'Stop voice input' : 'Start voice input'}
            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              listening ? 'bg-red-500 text-white' : 'bg-primary/20 text-primary-light hover:bg-primary/30'
            }`}
          >
            {listening ? <Square size={12} fill="currentColor" /> : <Mic size={14} />}
          </button>
        )}
      </div>
      {listening && (
        <div className="flex items-center gap-1.5 text-primary-light text-xs mt-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-dot" />
          Listening...
        </div>
      )}
      {quickPrompts.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-3.5">
          {quickPrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className="bg-primary/15 text-primary-light text-xs px-3 py-1.5 rounded-full hover:bg-primary/25"
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
