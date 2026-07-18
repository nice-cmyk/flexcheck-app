import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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
      <Reveal className="relative flex flex-col lg:flex-row px-4 sm:px-6 lg:px-14 py-12 lg:py-20 gap-10 items-center overflow-hidden">
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 w-[85vw] max-w-[560px] h-[85vw] max-h-[560px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)', filter: 'blur(20px)' }}
        />
        <div className="flex-1 relative z-10 w-full">
          <div className="inline-block bg-white/[0.06] text-white text-xs font-medium px-3.5 py-1.5 rounded-full">
            Powered by AI · Results in 60s
          </div>
          <div className="font-display font-extrabold text-5xl sm:text-6xl lg:text-8xl text-white leading-none mt-5 -tracking-wide">
            Your life.
          </div>
          <div className="font-display font-extrabold italic text-5xl sm:text-6xl lg:text-8xl text-primary leading-none -tracking-wide">
            Upgraded.
          </div>
          <div className="text-white/45 font-light text-base lg:text-lg leading-relaxed mt-6 max-w-md">
            Turn any photo into a luxury lifestyle photo or video, ready to post in 60 seconds.
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 items-center mt-8">
            <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-4">
              Start for free →
            </Link>
            <a href="#examples" className="text-accent font-medium text-sm">
              See examples →
            </a>
          </div>
        </div>
        <div className="flex-1 relative z-10 flex justify-center items-center gap-3 sm:gap-4 w-full">
          <div className="w-full max-w-[160px] aspect-[160/285] rounded-2xl shadow-[0_0_40px_rgba(124,58,237,0.2)] relative overflow-hidden">
            <AutoVideo src="/hero-after.mp4" className="w-full h-full object-cover bg-gradient-to-br from-[#2a1a3d] to-[#0f0a18]" />
            <div className="absolute top-3 left-3 bg-white/10 text-white/70 text-xs font-semibold px-3 py-1.5 rounded-full">
              Before
            </div>
          </div>
          <div className="w-full max-w-[160px] aspect-[160/285] rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.3)] relative overflow-hidden">
            <AutoVideo src="/hero-before.mp4" className="w-full h-full object-cover bg-[#15151d] scale-125" />
            <div className="absolute top-3 left-3 bg-primary/20 text-primary-light text-xs font-semibold px-3 py-1.5 rounded-full">
              After
            </div>
          </div>
        </div>
      </Reveal>

      {/* MARQUEE */}
      <div className="relative border-y border-white/[0.06] py-4 overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-3.5 text-white/40 text-sm font-light pl-4 sm:pl-14">
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
          <a href="#examples" className="block text-accent font-medium text-sm mt-6">
            Try it →
          </a>
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

function AutoVideo({ src, className }: { src: string; className?: string }) {
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
