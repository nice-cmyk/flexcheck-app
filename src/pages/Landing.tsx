import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Send } from 'lucide-react'
import TopNav from '../components/layout/TopNav'
import Footer from '../components/layout/Footer'
import BeforeAfterSlider from '../components/ui/BeforeAfterSlider'

const marqueeItems = ['Ferrari 488 GTB', 'Tokyo Penthouse', 'Paris Suite', 'Monaco Yacht', 'Maldives Resort', 'NYC Loft']

const steps = [
  {
    n: '01',
    title: 'Pick your scene',
    desc: 'Ferrari, Tokyo penthouse, Paris suite — dozens of luxury scenes.',
  },
  {
    n: '02',
    title: 'Upload your photo',
    desc: 'Just one photo is enough. Your face, pose and style are preserved.',
  },
  {
    n: '03',
    title: 'Get your photo or video',
    desc: 'Ready in 60 seconds, perfect for Stories and Snapchat.',
  },
]

const channels = ['Snapchat', 'Instagram', 'TikTok', 'iMessage']

export default function Landing() {
  return (
    <div className="bg-bg min-h-screen overflow-x-hidden">
      <TopNav />

      {/* HERO */}
      <Reveal className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-14 py-20 lg:py-28 min-h-[560px] lg:min-h-[680px] overflow-hidden text-center">
        <div className="absolute inset-0 flex flex-col justify-center gap-3 sm:gap-4 opacity-50">
          <PhotoRow
            images={['/lux1.png', '/lux2.png', '/lux4.png', '/lux6.png', '/lux8.png']}
            className="animate-marquee"
          />
          <PhotoRow
            images={['/lux3.png', '/lux5a.png', '/lux5b.png', '/lux7.png']}
            className="animate-marquee-reverse"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/60 to-bg" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-block bg-white/[0.06] text-white text-xs font-medium px-3.5 py-1.5 rounded-full">
            Powered by AI · Results in 60s
          </div>
          <div className="font-display font-extrabold text-5xl sm:text-6xl lg:text-8xl text-white leading-none mt-5 -tracking-wide">
            Your life.
          </div>
          <div className="font-display font-extrabold italic text-5xl sm:text-6xl lg:text-8xl text-primary leading-none -tracking-wide">
            Upgraded.
          </div>
          <div className="text-white/60 font-light text-base lg:text-lg leading-relaxed mt-6 max-w-md mx-auto">
            Turn any photo into a luxury lifestyle photo or video, ready to post in 60 seconds.
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 items-center justify-center mt-8">
            <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-4">
              Start for free →
            </Link>
            <a href="#examples" className="text-accent font-medium text-sm">
              See examples →
            </a>
          </div>
        </div>
      </Reveal>

      {/* LIVE DEMO */}
      <Reveal className="relative px-4 sm:px-6 lg:px-14 py-16 lg:py-20 flex flex-col items-center text-center gap-7">
        <div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">See it happen live.</div>
          <div className="text-white/45 font-light text-sm mt-2 max-w-md mx-auto">
            Your photo, your request, your result — one continuous flow.
          </div>
        </div>
        <DemoMotion />
        <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-3.5">
          Start for free →
        </Link>
      </Reveal>

      {/* MARQUEE */}
      <div className="relative border-y border-white/[0.06] py-4 overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-3.5 text-white/40 text-sm font-light pl-4 sm:pl-14 animate-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3.5">
              {item} <span className="text-primary">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* SNAP SECTION */}
      <Reveal className="relative flex flex-col lg:flex-row px-4 sm:px-6 lg:px-14 py-16 lg:py-20 gap-10 items-center overflow-hidden">
        <div className="flex-1 w-full">
          <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Send insane snaps
          </div>
          <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-primary leading-tight">
            straight from your camera roll.
          </div>
          <div className="text-white/45 font-light text-base mt-5 max-w-md">
            An ordinary photo becomes a dream lifestyle moment, ready to send — perfect for Snapchat,
            Instagram Stories, TikTok, or wherever you post.
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {channels.map((c) => (
              <span key={c} className="bg-white/[0.06] text-white/50 text-xs px-3 py-1.5 rounded-full">
                {c}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-5 mt-6">
            <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-3.5">
              Start for free →
            </Link>
            <a href="#examples" className="text-accent font-medium text-sm">
              Try it →
            </a>
          </div>
        </div>
        <div className="flex-1 relative flex justify-center gap-4 sm:gap-6 w-full">
          <div className="w-[38vw] max-w-[220px] aspect-[220/390] rounded-2xl sm:rounded-[26px] -rotate-3 overflow-hidden animate-float" style={{ animationDelay: '0.2s' }}>
            <img src="/apres.jpg" alt="Raw selfie" className="w-full h-full object-cover" />
          </div>
          <div className="w-[38vw] max-w-[220px] aspect-[220/390] rounded-2xl sm:rounded-[26px] rotate-3 overflow-hidden animate-float" style={{ animationDelay: '0.5s' }}>
            <img src="/avant.jpg" alt="Luxury result" className="w-full h-full object-cover" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-bg/90 border border-primary/30 rounded-full text-white/70 text-[11px] sm:text-xs px-3.5 py-2 shadow-[0_0_20px_rgba(0,0,0,0.4)] whitespace-nowrap">
            "Change the seat back..."
          </div>
        </div>
      </Reveal>

      {/* INSTAGRAM SECTION */}
      <Reveal className="relative flex flex-col-reverse lg:flex-row px-4 sm:px-6 lg:px-14 py-16 lg:py-20 gap-10 items-center overflow-hidden">
        <div className="flex-1 relative flex justify-center gap-4 sm:gap-6 w-full">
          <div className="w-[38vw] max-w-[220px] aspect-[220/390] rounded-2xl sm:rounded-[26px] rotate-3 overflow-hidden animate-float" style={{ animationDelay: '0.1s' }}>
            <InstagramMockup src="/lux9.png" caption="Feeling like this today ✨" />
          </div>
          <div className="w-[38vw] max-w-[220px] aspect-[220/390] rounded-2xl sm:rounded-[26px] -rotate-3 overflow-hidden animate-float" style={{ animationDelay: '0.4s' }}>
            <InstagramMockup src="/lux8.png" caption="No caption needed" />
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Post it straight
          </div>
          <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-primary leading-tight">
            to Instagram.
          </div>
          <div className="text-white/45 font-light text-base mt-5 max-w-md">
            One photo, one request, and your everyday moment becomes scroll-stopping
            Stories, Reels or feed content — ready to post in seconds.
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['Stories', 'Reels', 'Feed post', 'Close friends'].map((c) => (
              <span key={c} className="bg-white/[0.06] text-white/50 text-xs px-3 py-1.5 rounded-full">
                {c}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-5 mt-6">
            <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-3.5">
              Start for free →
            </Link>
            <a href="#examples" className="text-accent font-medium text-sm">
              Try it →
            </a>
          </div>
        </div>
      </Reveal>

      {/* HOW IT WORKS */}
      <div className="relative px-4 sm:px-6 lg:px-14 py-16 lg:py-20 flex flex-col gap-10 lg:gap-14">
        {steps.map((s, i) => (
          <Reveal
            key={s.n}
            delayMs={i * 120}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-10"
          >
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-10 w-full">
              <div className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-primary flex-none w-16 sm:w-32 lg:w-40">
                {s.n}
              </div>
              <div className="flex-1">
                <div className="text-white font-display font-bold text-xl sm:text-2xl">{s.title}</div>
                <div className="text-white/45 font-light text-sm mt-2 max-w-md">{s.desc}</div>
              </div>
              <div className="hidden lg:flex flex-none w-64 h-32 rounded-2xl bg-surface items-center justify-center overflow-hidden">
                {s.n === '01' && <SceneMotion />}
                {s.n === '02' && <UploadMotion />}
                {s.n === '03' && <RenderMotion />}
              </div>
            </div>
            <div className="flex lg:hidden flex-none w-full sm:w-48 h-24 rounded-2xl bg-surface items-center justify-center overflow-hidden">
              {s.n === '01' && <SceneMotion />}
              {s.n === '02' && <UploadMotion />}
              {s.n === '03' && <RenderMotion />}
            </div>
          </Reveal>
        ))}
        <Reveal className="flex justify-center px-4 sm:px-6 lg:px-14">
          <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-3.5">
            Start for free →
          </Link>
        </Reveal>
      </div>

      {/* GALLERY */}
      <Reveal className="relative px-4 sm:px-6 lg:px-14 py-16 lg:py-20">
        <div id="examples" className="relative">
        <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">See the difference.</div>
        <div className="text-white/45 font-light text-sm mt-2">Drag each slider to compare before and after.</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
          <div className="h-[340px] sm:h-[420px] rounded-2xl overflow-hidden">
            <BeforeAfterSlider
              beforeLabel="Before"
              afterLabel="After"
              beforeSlot={<img src="/gallery-left-after.jpg" alt="Raw photo" className="w-full h-full object-cover" />}
              afterSlot={<img src="/gallery-left-before.jpg" alt="Luxury result" className="w-full h-full object-cover" />}
            />
          </div>
          <div className="h-[340px] sm:h-[420px] rounded-2xl overflow-hidden">
            <BeforeAfterSlider
              beforeLabel="Before"
              afterLabel="After"
              beforeSlot={<img src="/gallery-avant1.jpg" alt="Raw photo" className="w-full h-full object-cover" />}
              afterSlot={<img src="/gallery-avant2.jpg" alt="Luxury result" className="w-full h-full object-cover" />}
            />
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-3.5">
            Start for free →
          </Link>
        </div>
        </div>
      </Reveal>

      {/* CLOSING CTA */}
      <Reveal className="relative px-4 sm:px-6 lg:px-14 py-20 lg:py-28 pb-24 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 w-[70vw] max-w-[500px] h-[70vw] max-h-[500px] rounded-full pointer-events-none animate-cta-glow"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)', filter: 'blur(20px)' }}
        />
        <div className="relative z-10 text-center max-w-lg mx-auto">
          <div className="font-display font-extrabold text-3xl sm:text-5xl text-white leading-tight">
            Ready to flex?
          </div>
          <div className="text-white/45 font-light text-base mt-4">
            Your first photo is on us — try it now and see your life, upgraded.
          </div>
          <div className="flex flex-wrap gap-4 justify-center items-center mt-8">
            <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-7 py-4">
              Start for free →
            </Link>
          </div>
        </div>
      </Reveal>

      <Footer />
    </div>
  )
}

function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: React.ReactNode
  className?: string
  delayMs?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'in-view' : ''} ${className ?? ''}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}

function InstagramMockup({ src, caption }: { src: string; caption: string }) {
  return (
    <div className="relative w-full h-full">
      <img src={src} alt="" className="w-full h-full object-cover" />

      {/* top gradient + story progress bars + avatar */}
      <div className="absolute top-0 left-0 right-0 p-2.5 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex gap-1 mb-2">
          <div className="h-[2px] flex-1 rounded-full bg-white/90" />
          <div className="h-[2px] flex-1 rounded-full bg-white/30" />
          <div className="h-[2px] flex-1 rounded-full bg-white/30" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1.5px]">
            <div className="w-full h-full rounded-full bg-bg" />
          </div>
          <span className="text-white text-[10px] font-medium">you</span>
          <span className="text-white/60 text-[10px]">2h</span>
        </div>
      </div>

      {/* bottom message bar + icons */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center gap-1.5">
          <div className="flex-1 border border-white/50 rounded-full px-2.5 py-1.5 text-white/70 text-[9px] truncate">
            {caption}
          </div>
          <Heart className="w-3.5 h-3.5 text-white shrink-0" />
          <Send className="w-3.5 h-3.5 text-white shrink-0" />
        </div>
      </div>
    </div>
  )
}

function PhotoRow({ images, className }: { images: string[]; className?: string }) {
  const doubled = [...images, ...images]
  return (
    <div className="w-full overflow-hidden whitespace-nowrap">
      <div className={`inline-flex gap-3 sm:gap-4 ${className ?? ''}`}>
        {doubled.map((src, i) => (
          <div
            key={i}
            className="flex-none w-[90px] sm:w-[110px] lg:w-[130px] aspect-[9/16] rounded-2xl overflow-hidden"
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

function DemoVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.muted = true
    el.defaultMuted = true
    const tryPlay = () => el.play().catch(() => {})
    tryPlay()
    document.addEventListener('touchstart', tryPlay, { once: true })
    document.addEventListener('click', tryPlay, { once: true })
    return () => {
      document.removeEventListener('touchstart', tryPlay)
      document.removeEventListener('click', tryPlay)
    }
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    />
  )
}

const DEMO_PROMPT = 'Change the interior and exterior'
const DEMO_PHOTO_MS = 2200
const DEMO_TYPE_MS = 2600
const DEMO_TRANSITION_MS = 500
const DEMO_RESULT_MS = 2600
const DEMO_TOTAL_MS = DEMO_PHOTO_MS + DEMO_TYPE_MS + DEMO_TRANSITION_MS + DEMO_RESULT_MS

function DemoMotion() {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      setElapsed((Date.now() - start) % DEMO_TOTAL_MS)
    }, 80)
    return () => clearInterval(id)
  }, [])

  const typingStart = DEMO_PHOTO_MS
  const transitionStart = typingStart + DEMO_TYPE_MS
  const resultStart = transitionStart + DEMO_TRANSITION_MS

  const isTyping = elapsed >= typingStart && elapsed < transitionStart
  const isResult = elapsed >= transitionStart

  const typingElapsed = Math.min(DEMO_TYPE_MS, Math.max(0, elapsed - typingStart))
  const typedChars = Math.min(DEMO_PROMPT.length, Math.round((typingElapsed / (DEMO_TYPE_MS * 0.7)) * DEMO_PROMPT.length))
  const typedText = DEMO_PROMPT.slice(0, typedChars)

  return (
    <div className="relative w-[220px] sm:w-[240px] aspect-[220/390] rounded-[28px] overflow-hidden mx-auto shadow-[0_0_60px_rgba(124,58,237,0.25)] border border-white/10">
      <DemoVideo
        src="/hero-after.mp4"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isResult ? 'opacity-0' : 'opacity-100'}`}
      />
      <DemoVideo
        src="/hero-before.mp4"
        className={`absolute inset-0 w-full h-full object-cover scale-125 transition-opacity duration-700 ${isResult ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute top-3 left-3 bg-white/10 text-white/80 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
        {isResult ? 'Result' : 'Your photo'}
      </div>

      {(isTyping || (elapsed >= transitionStart && elapsed < resultStart)) && (
        <div className="absolute bottom-4 left-3 right-3 bg-bg/90 border border-primary/30 rounded-2xl px-3.5 py-2.5 text-white/80 text-[11px] min-h-[38px] flex items-center">
          {typedText}
          <span className="inline-block w-[2px] h-3 bg-primary-light ml-0.5 animate-pulse-dot" />
        </div>
      )}

      {elapsed >= resultStart && (
        <div className="absolute bottom-4 left-3 right-3 bg-primary/20 border border-primary/40 rounded-2xl px-3.5 py-2.5 text-primary-light text-[11px] font-semibold text-center">
          ✓ Done in 45s
        </div>
      )}
    </div>
  )
}

function SceneMotion() {
  const tiles = [0, 1, 2, 3]
  return (
    <div className="grid grid-cols-2 gap-2 p-4 w-full h-full box-border">
      {tiles.map((i) => (
        <div
          key={i}
          className="rounded-lg bg-gradient-to-br from-primary/50 to-accent/30"
          style={{ animation: `scene-highlight 3.2s ${i * 0.8}s infinite` }}
        />
      ))}
    </div>
  )
}

function UploadMotion() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <svg width="64" height="64" viewBox="0 0 64 64" className="absolute" style={{ animation: 'render-spin 6s linear infinite' }}>
        <circle
          cx="32"
          cy="32"
          r="14"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="2"
          strokeDasharray="88"
          strokeDashoffset="0"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
      <div style={{ animation: 'upload-float 1.8s ease-in-out infinite' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v12M12 3l-5 5M12 3l5 5" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

function RenderMotion() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="4" />
        <circle
          cx="36"
          cy="36"
          r="28"
          fill="none"
          stroke="#A855F7"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="176"
          strokeDashoffset="120"
          style={{ animation: 'render-spin 2.4s linear infinite', transformOrigin: '36px 36px' }}
        />
      </svg>
      <div
        className="absolute w-3 h-3 rounded-full bg-primary-light"
        style={{ animation: 'render-glow 1.2s ease-in-out infinite' }}
      />
    </div>
  )
}
