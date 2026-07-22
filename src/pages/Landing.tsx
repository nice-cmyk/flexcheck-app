import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, Send, MessageCircle, X, ChevronDown } from 'lucide-react'
import TopNav from '../components/layout/TopNav'
import Footer from '../components/layout/Footer'
import BeforeAfterSlider from '../components/ui/BeforeAfterSlider'

const marqueeItems = ['Ferrari 488 GTB', 'Tokyo Penthouse', 'Paris Suite', 'Monaco Yacht', 'Maldives Resort', 'NYC Loft']

const channels = ['Snapchat', 'Instagram', 'TikTok', 'iMessage']

const chatNames = ['Yanis_', 'kenzaa', 'bilal.mp4', 'ines__', 'raywan', 'lina.x', 'zack__', 'nawel_', 'sofiane', 'sarah.jpg', 'medox', 'jjade__']
const chatMessages = [
  // French
  "wesh c'est trop stylé ce truc jsp comment ils font 🔥🔥",
  "j'ai généré ma photo en genre 40 secs c'est ouf",
  "quelqu'un sait si ça marche pour des vidéos tiktok aussi ?",
  "le rendu Ferrari c'est trop clean franchement 😭",
  "c'est vraiment gratuit le premier essai ou c'est un piège",
  "j'suis grave hype je test ce soir avec les gars",
  "les gars c'est validé sérieux, testez direct",
  "ça prend combien de temps pour une vidéo au final ?",
  "meilleur outil que j'ai vu cette année sans mentir",
  "j'ai mis ma photo dessus et wesh c'est bluffant",
  "ça capte bien le visage au moins ou c'est flou ?",
  "trop bien pour les stories insta jvous jure",
  "j'kiff trop le rendu Lambo 🤩🤩",
  "ça marche sur iphone aussi ou juste web ?",
  "franchement 10/10 aucun soucis pour moi",
  "on dirait une vraie photo de ouf sérieux",
  "ça coûte combien après le premier essai ?",
  "j'ai montré à mes potes ils ont pas cru que c'était généré",
  "le mode yacht monaco il déchire tout 🛥️",
  "quelqu'un a essayé le format carré pour insta ?",
  // English
  "yo this is actually insane no cap 🔥🔥",
  "generated my pic in like 40 secs fr fr",
  "does this work for tiktok vids too or just photos?",
  "the ferrari render is way too clean ngl",
  "wait is the first one really free or is it a trap",
  "im so hyped rn gonna test this tonight w the boys",
  "guys this is legit, try it rn",
  "how long does a video actually take tho",
  "best tool ive seen all year not even lying",
  "put my pic in and bro it's unreal",
  "does it keep the face accurate or does it get blurry",
  "perfect for insta stories i swear",
  "the lambo render goes so hard 🤩🤩",
  "does it work on iphone or just on web?",
  "ngl 10/10 no issues on my end",
  "looks like an actual photo fr",
  "how much is it after the free trial",
  "showed my friends they didn't believe it was ai",
  "the monaco yacht mode is unmatched 🛥️",
  "anyone tried the square format for insta yet?",
  // Spanish
  "wey esto está brutal no sé cómo lo hacen 🔥🔥",
  "generé mi foto en como 40 segundos, una locura",
  "¿alguien sabe si funciona también para videos de tiktok?",
  "el render del ferrari está súper limpio de verdad",
  "¿de verdad el primer intento es gratis o hay trampa?",
  "estoy súper emocionado, lo pruebo esta noche con los panas",
  "chicos esto es legit, pruébenlo ya",
  "¿cuánto tarda un video al final?",
  "la mejor herramienta que he visto este año sin mentir",
  "subí mi foto y wey está increíble",
  "¿capta bien la cara o sale borroso?",
  "perfecto para las historias de insta se los juro",
  "el render del lambo está brutal 🤩🤩",
  "¿funciona en iphone o solo en la web?",
  "de verdad 10/10 sin problemas para mí",
  "parece una foto real en serio",
  "¿cuánto cuesta después del primer intento?",
  "se lo mostré a mis amigos y no creían que era generado",
  "el modo yate en mónaco no tiene comparación 🛥️",
  "¿alguien probó el formato cuadrado para insta?",
  // Portuguese
  "mano isso é surreal não sei como fazem isso 🔥🔥",
  "gerei minha foto em uns 40 segundos, é surreal",
  "alguém sabe se funciona pra vídeo de tiktok também?",
  "o render da ferrari ficou muito limpo mesmo",
  "o primeiro é realmente grátis ou tem pegadinha?",
  "tô muito hypado vou testar hoje à noite com a galera",
  "galera isso é confiável, testem logo",
  "quanto tempo demora um vídeo no final?",
  "melhor ferramenta que vi esse ano sem mentira",
  "coloquei minha foto e mano ficou surreal",
  "ele capta bem o rosto ou fica borrado?",
  "perfeito pros stories do insta juro",
  "o render da lambo ficou demais 🤩🤩",
  "funciona no iphone ou só na web?",
  "sinceramente 10/10 sem nenhum problema aqui",
  "parece uma foto de verdade sério",
  "quanto custa depois do primeiro teste?",
  "mostrei pros meus amigos e eles não acreditaram que era gerado",
  "o modo iate em mônaco arrasa muito 🛥️",
  "alguém já testou o formato quadrado pro insta?",
]

export default function Landing() {
  const { t } = useTranslation()

  const steps = [
    { n: '01', title: t('landing.howTitle1'), desc: t('landing.howDesc1') },
    { n: '02', title: t('landing.howTitle2'), desc: t('landing.howDesc2') },
    { n: '03', title: t('landing.howTitle3'), desc: t('landing.howDesc3') },
  ]

  const faqItems = t('landing.faq', { returnObjects: true }) as { q: string; a: string }[]

  return (
    <div className="bg-bg min-h-screen overflow-x-hidden">
      <TopNav />
      <PublicChatWidget />

      {/* HERO */}
      <Reveal
        className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-14 py-20 lg:py-28 min-h-[560px] lg:min-h-[680px] overflow-hidden text-center"
      >
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
        <div
          className="absolute top-[10%] left-[8%] w-[40vw] max-w-[380px] h-[40vw] max-h-[380px] rounded-full pointer-events-none opacity-70"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.35), transparent 70%)', filter: 'blur(40px)' }}
        />
        <div
          className="absolute bottom-[5%] right-[6%] w-[35vw] max-w-[320px] h-[35vw] max-h-[320px] rounded-full pointer-events-none opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)', filter: 'blur(40px)' }}
        />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-block bg-white/[0.06] text-white text-xs font-medium px-3.5 py-1.5 rounded-full">
            {t('landing.badge')}
          </div>
          <div className="font-display font-extrabold text-5xl sm:text-6xl lg:text-8xl text-white leading-none mt-5 -tracking-wide">
            {t('landing.heroLine1')}
          </div>
          <div className="font-display font-extrabold italic text-5xl sm:text-6xl lg:text-8xl text-primary leading-none -tracking-wide">
            {t('landing.heroLine2')}
          </div>
          <div className="text-white/60 font-light text-base lg:text-lg leading-relaxed mt-6 max-w-md mx-auto">
            {t('landing.heroDesc')}
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 items-center justify-center mt-8">
            <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-4 shadow-[0_0_35px_rgba(124,58,237,0.55)] hover:shadow-[0_0_50px_rgba(124,58,237,0.75)] transition-shadow">
              {t('common.startForFree')} →
            </Link>
            <a href="#examples" className="text-accent font-medium text-sm">
              {t('landing.seeExamples')}
            </a>
          </div>
          <LiveCounter />
        </div>
      </Reveal>

      {/* APP DEMO */}
      <Reveal className="relative px-4 sm:px-6 lg:px-14 py-16 lg:py-20 flex flex-col items-center text-center gap-7 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[460px] h-[60vw] max-h-[460px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)', filter: 'blur(50px)' }}
        />
        <div className="relative">
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">{t('landing.demoTitle')}</div>
          <div className="text-white/45 font-light text-sm mt-2 max-w-md mx-auto">
            {t('landing.demoDesc')}
          </div>
        </div>
        <div className="relative w-full max-w-[720px] aspect-[960/450] rounded-2xl overflow-hidden mx-auto shadow-[0_0_60px_rgba(124,58,237,0.25)] border border-white/10">
          <video
            src="/demo-app.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>
        <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-3.5 shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_45px_rgba(124,58,237,0.7)] transition-shadow">
          {t('common.startForFree')} →
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
        <div
          className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[45vw] max-w-[380px] h-[45vw] max-h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', filter: 'blur(50px)' }}
        />
        <div className="flex-1 w-full relative">
          <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            {t('landing.snapTitle1')}
          </div>
          <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-primary leading-tight">
            {t('landing.snapTitle2')}
          </div>
          <div className="text-white/45 font-light text-base mt-5 max-w-md">
            {t('landing.snapDesc')}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {channels.map((c) => (
              <span key={c} className="bg-white/[0.06] text-white/50 text-xs px-3 py-1.5 rounded-full">
                {c}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-5 mt-6">
            <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-3.5 shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_45px_rgba(124,58,237,0.7)] transition-shadow">
              {t('common.startForFree')} →
            </Link>
            <a href="#examples" className="text-accent font-medium text-sm">
              {t('landing.tryIt')}
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
            {t('landing.snapBubble')}
          </div>
        </div>
      </Reveal>

      {/* INSTAGRAM SECTION */}
      <Reveal className="relative flex flex-col-reverse lg:flex-row px-4 sm:px-6 lg:px-14 py-16 lg:py-20 gap-10 items-center overflow-hidden">
        <div
          className="absolute top-1/2 left-[10%] -translate-y-1/2 w-[45vw] max-w-[380px] h-[45vw] max-h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)', filter: 'blur(50px)' }}
        />
        <div className="flex-1 relative flex justify-center gap-4 sm:gap-6 w-full">
          <div className="w-[38vw] max-w-[220px] aspect-[220/390] rounded-2xl sm:rounded-[26px] rotate-3 overflow-hidden animate-float" style={{ animationDelay: '0.1s' }}>
            <InstagramMockup src="/lux9.png" caption={t('landing.igCaption1')} />
          </div>
          <div className="w-[38vw] max-w-[220px] aspect-[220/390] rounded-2xl sm:rounded-[26px] -rotate-3 overflow-hidden animate-float" style={{ animationDelay: '0.4s' }}>
            <InstagramMockup src="/lux8.png" caption={t('landing.igCaption2')} />
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            {t('landing.igTitle1')}
          </div>
          <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-primary leading-tight">
            {t('landing.igTitle2')}
          </div>
          <div className="text-white/45 font-light text-base mt-5 max-w-md">
            {t('landing.igDesc')}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['Stories', 'Reels', 'Feed post', 'Close friends'].map((c) => (
              <span key={c} className="bg-white/[0.06] text-white/50 text-xs px-3 py-1.5 rounded-full">
                {c}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-5 mt-6">
            <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-3.5 shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_45px_rgba(124,58,237,0.7)] transition-shadow">
              {t('common.startForFree')} →
            </Link>
            <a href="#examples" className="text-accent font-medium text-sm">
              {t('landing.tryIt')}
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
          <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-3.5 shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_45px_rgba(124,58,237,0.7)] transition-shadow">
            {t('common.startForFree')} →
          </Link>
        </Reveal>
      </div>

      {/* GALLERY */}
      <Reveal className="relative px-4 sm:px-6 lg:px-14 py-16 lg:py-20 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] max-w-[500px] h-[40vw] max-h-[320px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)', filter: 'blur(50px)' }}
        />
        <div id="examples" className="relative">
        <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">{t('landing.galleryTitle')}</div>
        <div className="text-white/45 font-light text-sm mt-2">{t('landing.galleryDesc')}</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
          <div className="h-[340px] sm:h-[420px] rounded-2xl overflow-hidden">
            <BeforeAfterSlider
              beforeLabel={t('result.before')}
              afterLabel={t('result.after')}
              beforeSlot={<img src="/gallery-left-after.jpg" alt="Raw photo" className="w-full h-full object-cover" />}
              afterSlot={<img src="/gallery-left-before.jpg" alt="Luxury result" className="w-full h-full object-cover" />}
            />
          </div>
          <div className="h-[340px] sm:h-[420px] rounded-2xl overflow-hidden">
            <BeforeAfterSlider
              beforeLabel={t('result.before')}
              afterLabel={t('result.after')}
              beforeSlot={<img src="/gallery-avant1.jpg" alt="Raw photo" className="w-full h-full object-cover" />}
              afterSlot={<img src="/gallery-avant2.jpg" alt="Luxury result" className="w-full h-full object-cover" />}
            />
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-6 py-3.5 shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_45px_rgba(124,58,237,0.7)] transition-shadow">
            {t('common.startForFree')} →
          </Link>
        </div>
        </div>
      </Reveal>

      {/* FAQ */}
      <Reveal className="relative px-4 sm:px-6 lg:px-14 py-16 lg:py-20 overflow-hidden">
        <div
          className="absolute top-0 right-1/4 w-[50vw] max-w-[400px] h-[35vw] max-h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)', filter: 'blur(50px)' }}
        />
        <div className="relative max-w-2xl mx-auto">
          <div className="text-center">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">{t('landing.faqTitle')}</div>
            <div className="text-white/45 font-light text-sm mt-2">{t('landing.faqSubtitle')}</div>
          </div>
          <div className="flex flex-col gap-3 mt-8">
            {faqItems.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
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
            {t('landing.closingTitle')}
          </div>
          <div className="text-white/45 font-light text-base mt-4">
            {t('landing.closingDesc')}
          </div>
          <div className="flex flex-wrap gap-4 justify-center items-center mt-8">
            <Link to="/signup" className="bg-primary rounded-lg text-white font-semibold text-sm px-7 py-4 shadow-[0_0_40px_rgba(124,58,237,0.6)] hover:shadow-[0_0_55px_rgba(124,58,237,0.8)] transition-shadow">
              {t('common.startForFree')} →
            </Link>
          </div>
        </div>
      </Reveal>

      <Footer />
    </div>
  )
}

function LiveCounter() {
  const { t } = useTranslation()
  const [count, setCount] = useState(32586)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    function tick() {
      setCount((c) => c + Math.floor(Math.random() * 3) + 1)
      timeout = setTimeout(tick, 4000 + Math.random() * 5000)
    }
    timeout = setTimeout(tick, 4000 + Math.random() * 5000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="inline-flex items-center gap-2 text-white/50 text-xs sm:text-sm mt-6">
      <span className="relative flex h-2 w-2 flex-none">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
      </span>
      <span>
        <span className="text-white font-semibold">{count.toLocaleString('en-US')}</span> {t('landing.liveCounterSuffix')}
      </span>
    </div>
  )
}

type ChatMsg = { id: number; name: string; text: string }

function PublicChatWidget() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [unread, setUnread] = useState(0)
  const [online, setOnline] = useState(328)
  const idRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    function pushMessage() {
      const name = chatNames[Math.floor(Math.random() * chatNames.length)]
      const text = chatMessages[Math.floor(Math.random() * chatMessages.length)]
      idRef.current += 1
      setMessages((prev) => [...prev.slice(-24), { id: idRef.current, name, text }])
      setUnread((u) => u + 1)
      timeout = setTimeout(pushMessage, 3500 + Math.random() * 4500)
    }
    timeout = setTimeout(pushMessage, 1800)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setOnline((o) => Math.max(180, o + Math.floor(Math.random() * 7) - 3))
    }, 6000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (open) {
      setUnread(0)
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [open, messages])

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-40">
      {open && (
        <div className="mb-3 w-[280px] sm:w-[300px] h-[360px] bg-surface/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
          <div className="flex-none flex items-center justify-between px-3.5 py-3 border-b border-white/[0.06] bg-gradient-to-b from-primary/10 to-transparent">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 flex-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-white text-xs font-semibold">{t('landing.chatTitle')}</span>
              <span className="text-white/40 text-[11px]">· {online} {t('landing.chatOnline')}</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-3">
            {messages.length === 0 && <div className="text-white/30 text-xs text-center mt-6">{t('landing.chatLoading')}</div>}
            {messages.map((m) => (
              <div key={m.id} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[10px] font-bold flex-none">
                  {m.name[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-primary-light text-[11px] font-semibold">{m.name}</div>
                  <div className="text-white/75 text-[12px] leading-snug break-words">{m.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-14 h-14 rounded-full bg-primary shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center justify-center text-white"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-bg">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </div>
  )
}

function Reveal({
  children,
  className,
  delayMs = 0,
  refProp,
}: {
  children: React.ReactNode
  className?: string
  delayMs?: number
  refProp?: React.RefObject<HTMLDivElement>
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
      ref={(node) => {
        ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        if (refProp) (refProp as React.MutableRefObject<HTMLDivElement | null>).current = node
      }}
      className={`reveal ${inView ? 'in-view' : ''} ${className ?? ''}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-surface/60 border border-white/[0.06] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
      >
        <span className="text-white font-medium text-sm sm:text-base">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-none text-white/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-4 text-white/50 font-light text-sm leading-relaxed">{a}</div>
        </div>
      </div>
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
  // Repeat the source images enough times that a single half of the track
  // (before the seamless -50% loop point) always spans well past the widest
  // realistic viewport (ultra-wide monitors included) - otherwise on wide
  // screens the row runs out of images before looping and shows a black gap.
  const minPerHalf = 24
  const repeats = Math.max(2, Math.ceil(minPerHalf / images.length))
  const half: string[] = []
  for (let r = 0; r < repeats; r++) half.push(...images)
  const doubled = [...half, ...half]
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
