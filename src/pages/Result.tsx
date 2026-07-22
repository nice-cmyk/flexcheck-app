import { useLocation, useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ResultView from '../components/generation/ResultView'
import { useAuth } from '../hooks/useAuth'
import { useCredits } from '../hooks/useCredits'
import { COSTS, videoTotalCost } from '../lib/credits'
import type { VideoDuration } from '../hooks/useGeneration'

interface LocationState {
  type: 'photo' | 'video'
  photoUrl: string
  prompt: string
  resultUrl: string
  duration?: VideoDuration
}

export default function Result() {
  const { user } = useAuth()
  const { credits } = useCredits(user?.id)
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null

  if (!state) {
    navigate('/app')
    return null
  }

  const creditsUsed = state.type === 'video' ? videoTotalCost(state.duration ?? 'short') : COSTS.photo

  return (
    <AppLayout>
      <ResultView
        afterUrl={state.resultUrl}
        sceneUsed={state.prompt}
        creditsUsed={creditsUsed}
        generationTimeSec={42}
        prompt={state.prompt}
        creditsLeft={credits}
        isVideo={state.type === 'video'}
      />
    </AppLayout>
  )
}
