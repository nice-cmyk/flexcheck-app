import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import PhotoUpload from '../components/generation/PhotoUpload'
import PromptInput from '../components/generation/PromptInput'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { COSTS, formatCredits } from '../lib/credits'
import type { OutputFormat } from '../lib/fal'

const scenes = ['Tokyo Penthouse', 'Paris Suite', 'Maldives Resort', 'Monaco Yacht', 'NYC Loft', 'Dubai Rooftop']

export default function ChangeScene() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [format, setFormat] = useState<OutputFormat>('vertical')

  function handleSubmit() {
    if (!user || !photoUrl || !prompt) return
    navigate('/app/generating/new', { state: { type: 'photo', photoUrl, prompt, format } })
  }

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        <div className="flex-none lg:w-[500px] p-4 sm:p-6 lg:p-8 box-border lg:border-r border-white/[0.06] lg:overflow-y-auto">
          <div className="text-white text-xl font-semibold">Change the scene</div>
          <div className="text-white/45 text-sm mt-1.5">Teleport anywhere in the world</div>

          <div className="mt-5">
            <PhotoUpload onFileSelected={(_f, url) => setPhotoUrl(url)} />
          </div>

          <div className="text-white/70 text-sm font-semibold mt-6">Choose a destination</div>
          <div className="mt-2.5">
            <PromptInput value={prompt} onChange={setPrompt} quickPrompts={scenes} placeholder="e.g. on a Dubai rooftop at sunset..." />
          </div>

          <div className="text-white/70 text-sm font-semibold mt-6">Format</div>
          <div className="flex gap-2.5 mt-2.5">
            <button
              type="button"
              onClick={() => setFormat('vertical')}
              className={`flex-1 rounded-xl border py-3 text-sm text-center ${
                format === 'vertical' ? 'border-primary bg-primary/15 text-white' : 'border-white/15 text-white/50'
              }`}
            >
              Vertical
              <div className="text-xs mt-0.5 opacity-70">Stories · Reels · Snap</div>
            </button>
            <button
              type="button"
              onClick={() => setFormat('square')}
              className={`flex-1 rounded-xl border py-3 text-sm text-center ${
                format === 'square' ? 'border-primary bg-primary/15 text-white' : 'border-white/15 text-white/50'
              }`}
            >
              Square
              <div className="text-xs mt-0.5 opacity-70">Instagram post</div>
            </button>
          </div>

          <Button fullWidth className="mt-6" onClick={handleSubmit}>
            Transform now
          </Button>
          <div className="text-center text-white/40 text-xs mt-2">
            Uses {formatCredits(COSTS.photo)} credit · ~45 seconds
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[240px] sm:min-h-[280px]">
          <div className="w-full h-full rounded-2xl bg-surface/60 border border-primary/15 flex items-center justify-center text-white/30 text-sm">
            {photoUrl ? (
              <img src={photoUrl} alt="Preview" className="max-h-full max-w-full rounded-2xl object-contain" />
            ) : (
              'Your photo will appear here'
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
