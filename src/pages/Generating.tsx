import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import GeneratingScreen from '../components/generation/GeneratingScreen'
import { useAuth } from '../hooks/useAuth'
import { useGeneration, GenerationType, VideoDuration } from '../hooks/useGeneration'
import { OutputFormat } from '../lib/fal'

interface LocationState {
  type: GenerationType
  photoUrl: string
  prompt: string
  duration?: VideoDuration
  format?: OutputFormat
}

export default function Generating() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const { step, progress, resultUrl, error, run } = useGeneration(user?.id)
  const started = useRef(false)

  useEffect(() => {
    if (!state) {
      navigate('/app')
      return
    }
    if (started.current) return
    started.current = true
    run(state.type, state.photoUrl, state.prompt, state.duration ?? 'short', state.format ?? 'vertical')
  }, [state, run, navigate])

  useEffect(() => {
    if (step === 'complete' && resultUrl && state) {
      navigate('/app/result/latest', {
        replace: true,
        state: { ...state, resultUrl },
      })
    }
  }, [step, resultUrl, state, navigate])

  if (!state) return null

  if (step === 'failed') {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-6">
        <div className="text-white text-xl font-semibold">Generation failed</div>
        <div className="text-white/50 text-sm mt-2 max-w-sm">{error}</div>
        <button
          onClick={() => navigate('/app')}
          className="mt-6 bg-primary text-white text-sm font-semibold px-6 py-3 rounded-xl"
        >
          Back to dashboard
        </button>
      </div>
    )
  }

  return <GeneratingScreen step={step} progress={progress} />
}
