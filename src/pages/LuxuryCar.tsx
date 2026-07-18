import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { formatCredits, videoTotalCost } from '../lib/credits'

const brands = [
  { name: 'Ferrari', color: '#EF4444' },
  { name: 'Lamborghini', color: '#F59E0B' },
  { name: 'Rolls-Royce', color: '#D4AF37' },
  { name: 'Bentley', color: '#10B981' },
  { name: 'Mercedes-AMG', color: '#e5e5e5' },
  { name: 'Porsche', color: '#333' },
  { name: 'BMW M', color: '#3B82F6' },
]

const carsByBrand: Record<string, { name: string; meta: string }[]> = {
  Ferrari: [
    { name: 'Ferrari 488 GTB', meta: '2023 · Coupe' },
    { name: 'Ferrari SF90', meta: '2024 · Hypercar' },
    { name: 'Ferrari 296 GTB', meta: '2023 · Coupe' },
  ],
}

const colors = [
  { name: 'Nero', hex: '#1a1a1a' },
  { name: 'Rosso', hex: '#8B1E1E' },
  { name: 'Beige', hex: '#D8C7A1' },
  { name: 'Marrone', hex: '#5C3A21' },
]

export default function LuxuryCar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [brand, setBrand] = useState('Ferrari')
  const [car, setCar] = useState('Ferrari 488 GTB')
  const [color, setColor] = useState('Nero')
  const [details, setDetails] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  function handleSubmit() {
    if (!user) return
    navigate('/app/generating/new', { state: { type: 'video', photoUrl, prompt: `${car}, ${color} interior${details ? ', ' + details : ''}`, duration: 'short' } })
  }

  return (
    <AppLayout>
    <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
      <div className="flex-none lg:w-[200px] border-b lg:border-b-0 lg:border-r border-white/[0.06] p-4 sm:p-6 box-border">
        <div className="text-white text-[15px] font-semibold mb-3 lg:mb-3.5">Brands</div>
        <div className="flex lg:flex-col gap-2 lg:gap-0 overflow-x-auto lg:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0">
          {brands.map((b) => (
            <button
              key={b.name}
              onClick={() => setBrand(b.name)}
              className={`flex-none lg:w-full text-left flex items-center gap-2 text-[13px] px-3 py-2.5 rounded-full lg:rounded-lg whitespace-nowrap ${
                brand === b.name ? 'bg-primary text-white' : 'text-white/60 bg-surface/60 lg:bg-transparent'
              }`}
            >
              <span className="w-2 h-2 rounded-full flex-none" style={{ background: b.color }} />
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-none lg:w-[340px] border-b lg:border-b-0 lg:border-r border-white/[0.06] p-4 sm:p-6 box-border lg:overflow-y-auto">
        <div className="flex gap-2 mb-4">
          <div className="bg-primary/15 text-primary-light text-xs px-3 py-1.5 rounded-full">All</div>
          <div className="text-white/40 text-xs px-3 py-1.5">Coupe</div>
          <div className="text-white/40 text-xs px-3 py-1.5">SUV</div>
        </div>
        <div className="flex flex-col gap-3">
          {(carsByBrand[brand] ?? carsByBrand.Ferrari).map((c) => (
            <button
              key={c.name}
              onClick={() => setCar(c.name)}
              className={`text-left bg-surface/80 rounded-2xl p-3 flex gap-3 ${
                car === c.name ? 'border border-primary shadow-[0_0_16px_rgba(124,58,237,0.25)]' : 'border border-primary/15'
              }`}
            >
              <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-[#2a1a3d] to-[#0f0a18] flex-none" />
              <div className="min-w-0">
                <div className="text-white text-[13px] font-semibold truncate">{c.name}</div>
                <div className="text-white/40 text-[11px]">{c.meta}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-8 box-border lg:overflow-y-auto">
        <div className="text-white text-xl font-semibold">{car}</div>
        <div className="text-white/45 text-[13px] mt-0.5">Coupe · 2023</div>

        <div className="text-white/70 text-[13px] font-semibold mt-5.5">Interior color</div>
        <div className="flex gap-4 mt-2.5">
          {colors.map((c) => (
            <button key={c.name} className="text-center" onClick={() => setColor(c.name)}>
              <div
                className="w-8 h-8 rounded-full mx-auto"
                style={{ background: c.hex, border: color === c.name ? '2px solid #7C3AED' : undefined }}
              />
              <div className="text-white/50 text-[11px] mt-1.5">{c.name}</div>
            </button>
          ))}
        </div>

        <div className="text-white/70 text-[13px] font-semibold mt-5.5">Your photo</div>
        <label className="block border-2 border-dashed border-primary/35 rounded-xl p-4 text-center mt-2 text-white/40 text-[13px] cursor-pointer">
          Drop a photo or browse
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) setPhotoUrl(URL.createObjectURL(f))
            }}
          />
        </label>

        <div className="text-white/70 text-[13px] font-semibold mt-4.5">Add details (optional)</div>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="e.g. at night, in the rain..."
          className="w-full h-10 bg-surface/80 border border-primary/15 rounded-lg p-2.5 text-white/70 text-xs mt-2 outline-none focus:border-primary resize-none"
        />

        <div className="flex gap-5 mt-5.5">
          <div className="flex-1 h-[130px] rounded-2xl bg-gradient-to-br from-[#2a1a3d] to-[#0f0a18] border border-primary/20 flex items-center justify-center text-white/30 text-xs overflow-hidden">
            {photoUrl ? <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" /> : 'preview expected'}
          </div>
        </div>

        <Button fullWidth className="mt-5" onClick={handleSubmit}>
          Generate my video →
        </Button>
        <div className="text-center text-white/40 text-xs mt-2">
          Uses {formatCredits(videoTotalCost('short'))} credit · ~60 seconds
        </div>
      </div>
    </div>
    </AppLayout>
  )
}
