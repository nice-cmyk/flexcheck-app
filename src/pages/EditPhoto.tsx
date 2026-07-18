import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import PhotoUpload from '../components/generation/PhotoUpload'
import PromptInput from '../components/generation/PromptInput'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

const quickPrompts = ['Tokyo Penthouse', 'Paris Suite', 'Maldives Resort', 'NYC Loft']

export default function EditPhoto() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [keepSubject, setKeepSubject] = useState(true)
  const [preserveLighting, setPreserveLighting] = useState(true)

  function handleSubmit() {
    if (!user || !photoUrl || !prompt) return
    navigate('/app/generating/new', { state: { type: 'photo', photoUrl, prompt } })
  }

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        <div className="flex-none lg:w-[500px] p-4 sm:p-6 lg:p-8 box-border lg:border-r border-white/[0.06] lg:overflow-y-auto">
          <div className="text-white text-xl font-semibold">Edit a photo</div>

          <div className="mt-5">
            <PhotoUpload onFileSelected={(_f, url) => setPhotoUrl(url)} />
          </div>

          <div className="text-white/70 text-sm font-semibold mt-6">What do you want to change?</div>
          <div className="mt-2.5">
            <PromptInput value={prompt} onChange={setPrompt} quickPrompts={quickPrompts} />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Toggle label="Keep subject exactly" checked={keepSubject} onChange={setKeepSubject} />
            <Toggle label="Preserve lighting" checked={preserveLighting} onChange={setPreserveLighting} />
            <Toggle label="HD rendering (Pro)" checked={false} disabled />
          </div>

          <Button fullWidth className="mt-6" onClick={handleSubmit}>
            Transform now
          </Button>
          <div className="text-center text-white/40 text-xs mt-2">Uses 0.25 credit · ~45 seconds</div>
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

function Toggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex justify-between items-center">
      <div className={`text-sm ${disabled ? 'text-white/50' : 'text-white'}`}>{label}</div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`w-[38px] h-[22px] rounded-full relative transition-colors ${checked ? 'bg-primary' : 'bg-[#2a2a35]'}`}
      >
        <div
          className={`w-[18px] h-[18px] rounded-full bg-white absolute top-0.5 transition-all ${
            checked ? 'right-0.5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}
