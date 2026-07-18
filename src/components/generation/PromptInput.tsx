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
