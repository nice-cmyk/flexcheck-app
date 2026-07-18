import BeforeAfterSlider from '../ui/BeforeAfterSlider'
import Button from '../ui/Button'
import { formatCredits } from '../../lib/credits'

interface ResultViewProps {
  beforeUrl: string
  afterUrl: string
  sceneUsed: string
  creditsUsed: number
  generationTimeSec: number
  prompt: string
  creditsLeft: number
  isVideo?: boolean
}

export default function ResultView({
  beforeUrl,
  afterUrl,
  sceneUsed,
  creditsUsed,
  generationTimeSec,
  prompt,
  creditsLeft,
  isVideo,
}: ResultViewProps) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
      <div className="flex-none w-full lg:w-[700px] p-4 sm:p-8 box-border">
        <div className="h-[70vh] lg:h-full">
          <BeforeAfterSlider
            beforeSlot={<img src={beforeUrl} alt="Before" className="w-full h-full object-cover" />}
            afterSlot={
              isVideo ? (
                <video src={afterUrl} className="w-full h-full object-cover" autoPlay loop muted />
              ) : (
                <img src={afterUrl} alt="After" className="w-full h-full object-cover" />
              )
            }
          />
        </div>
      </div>
      <div className="flex-1 p-4 sm:p-8 box-border">
        <div className="text-white text-xl font-semibold">Your flex is ready</div>

        <div className="bg-surface/80 border border-primary/15 rounded-2xl p-4 mt-4">
          <Row label="Scene used" value={sceneUsed} />
          <Row label="Credits used" value={formatCredits(creditsUsed)} />
          <Row label="Generation time" value={`${generationTimeSec}s`} last />
        </div>

        <div className="flex flex-col gap-2.5 mt-4">
          <Button>Save</Button>
          <Button variant="ghost">Instagram Story</Button>
          <button className="border border-[#F5CB0A]/40 rounded-xl text-center text-[#FDE047] text-sm py-3">
            Snapchat
          </button>
          <Button variant="ghost">Copy link</Button>
        </div>

        <div className="text-white/40 text-xs mt-4">You asked for:</div>
        <div className="text-white/55 text-xs italic mt-1">"{prompt}"</div>

        <div className="bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/30 rounded-2xl p-3.5 mt-5 text-white text-sm">
          You have {formatCredits(creditsLeft)} credit{creditsLeft > 1 ? 's' : ''} left · <a href="/app/credits">Top up →</a>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex justify-between text-white/50 text-sm ${last ? '' : 'mb-2'}`}>
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  )
}
