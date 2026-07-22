import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'

interface SnapRougeModalProps {
  mediaUrl: string
  isVideo?: boolean
  onClose: () => void
}

// Renders the generated photo/video wrapped in a mock Snapchat "viewer" chrome
// (friend name, timer ring, red video indicator, bottom chat bar) so the
// exported PNG looks like an authentic in-app Snapchat capture rather than a
// bare AI-generated image. This is what people screenshot/share to flex.
export default function SnapRougeModal({ mediaUrl, isVideo, onClose }: SnapRougeModalProps) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [contactName, setContactName] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [building, setBuilding] = useState(true)
  const [error, setError] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | null = null

    async function build() {
      setBuilding(true)
      setError(false)
      try {
        const res = await fetch(mediaUrl)
        if (!res.ok) throw new Error('fetch failed')
        const blob = await res.blob()
        objectUrl = URL.createObjectURL(blob)

        const frame = isVideo ? await grabVideoFrame(objectUrl) : await loadImage(objectUrl)
        if (cancelled) return

        const canvas = canvasRef.current
        if (!canvas) return
        drawSnapChrome(canvas, frame, contactName.trim() || t('result.snapRouge.defaultName'), t)

        canvas.toBlob((b) => {
          if (!b || cancelled) return
          setPreviewUrl(URL.createObjectURL(b))
          setBuilding(false)
        }, 'image/png')
      } catch (err) {
        console.error('snap rouge compose failed', err)
        if (!cancelled) {
          setError(true)
          setBuilding(false)
        }
      } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl)
      }
    }

    build()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaUrl, isVideo, contactName])

  async function handleDownload() {
    if (!previewUrl) return
    setDownloading(true)
    try {
      const a = document.createElement('a')
      a.href = previewUrl
      a.download = `flexcheck-snap-rouge-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-surface border border-white/10 rounded-2xl p-5 w-full max-w-sm max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="text-white text-lg font-semibold">{t('result.snapRouge.title')}</div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl leading-none">×</button>
        </div>
        <div className="text-white/50 text-xs mt-1">{t('result.snapRouge.subtitle')}</div>

        <input
          type="text"
          placeholder={t('result.snapRouge.namePlaceholder')}
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          maxLength={20}
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#FFFC00]/50 mt-4"
        />

        <div className="mt-4 rounded-2xl overflow-hidden bg-black aspect-[9/16] relative flex items-center justify-center">
          <canvas ref={canvasRef} width={540} height={960} className="hidden" />
          {building && <div className="text-white/40 text-sm">{t('result.snapRouge.building')}</div>}
          {error && <div className="text-red-400 text-sm px-6 text-center">{t('result.snapRouge.error')}</div>}
          {previewUrl && !building && (
            <img src={previewUrl} alt="Snap Rouge preview" className="w-full h-full object-contain" />
          )}
        </div>

        <div className="flex flex-col gap-2.5 mt-4">
          <Button onClick={handleDownload} disabled={!previewUrl || downloading}>
            {downloading ? t('result.snapRouge.downloading') : t('result.snapRouge.download')}
          </Button>
          <Button variant="ghost" onClick={onClose}>{t('common.close', { defaultValue: 'Fermer' })}</Button>
        </div>
      </div>
    </div>
  )
}

function loadImage(url: string): Promise<CanvasImageSource & { width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

function grabVideoFrame(url: string): Promise<CanvasImageSource & { width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = url
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'
    video.onloadeddata = () => {
      video.currentTime = Math.min(0.15, video.duration / 2 || 0)
    }
    video.onseeked = () => {
      resolve(Object.assign(video, { width: video.videoWidth, height: video.videoHeight }))
    }
    video.onerror = reject
  })
}

function drawSnapChrome(
  canvas: HTMLCanvasElement,
  media: CanvasImageSource & { width: number; height: number },
  name: string,
  t: (key: string, opts?: Record<string, unknown>) => string,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height

  // Cover-fit the media into the full canvas.
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, W, H)
  const mw = media.width || W
  const mh = media.height || H
  const scale = Math.max(W / mw, H / mh)
  const dw = mw * scale
  const dh = mh * scale
  ctx.drawImage(media, (W - dw) / 2, (H - dh) / 2, dw, dh)

  // Top gradient for legibility.
  const topGrad = ctx.createLinearGradient(0, 0, 0, 180)
  topGrad.addColorStop(0, 'rgba(0,0,0,0.55)')
  topGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = topGrad
  ctx.fillRect(0, 0, W, 180)

  // Bottom gradient behind chat bar.
  const bottomGrad = ctx.createLinearGradient(0, H - 160, 0, H)
  bottomGrad.addColorStop(0, 'rgba(0,0,0,0)')
  bottomGrad.addColorStop(1, 'rgba(0,0,0,0.6)')
  ctx.fillStyle = bottomGrad
  ctx.fillRect(0, H - 160, W, 160)

  // Friend avatar circle (Bitmoji placeholder = colored circle with initial).
  const avatarX = 44
  const avatarY = 56
  const avatarR = 22
  ctx.beginPath()
  ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2)
  ctx.fillStyle = '#7C3AED'
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = '600 20px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText((name[0] || '?').toUpperCase(), avatarX, avatarY + 1)

  // Friend name.
  ctx.textAlign = 'left'
  ctx.fillStyle = '#fff'
  ctx.font = '700 22px "Space Grotesk", sans-serif'
  ctx.fillText(name, avatarX + avatarR + 12, avatarY - 6)
  ctx.fillStyle = 'rgba(255,255,255,0.65)'
  ctx.font = '400 15px Inter, sans-serif'
  ctx.fillText(t('result.snapRouge.timestamp'), avatarX + avatarR + 12, avatarY + 16)

  // Snap timer ring (top right) — small red-accented ring like Snapchat's viewer timer.
  const ringX = W - 50
  const ringY = 56
  const ringR = 16
  ctx.beginPath()
  ctx.arc(ringX, ringY, ringR, -Math.PI / 2, Math.PI * 1.1)
  ctx.strokeStyle = '#FF3B30'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.fillStyle = '#fff'
  ctx.font = '600 13px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('5', ringX, ringY + 5)

  // Bottom chat input bar (Snapchat-style pill with camera icon).
  const barY = H - 60
  const barH = 42
  const barX = 20
  const barW = W - 40 - 56
  roundRect(ctx, barX, barY, barW, barH, barH / 2)
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = '400 15px Inter, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(t('result.snapRouge.chatPlaceholder'), barX + 18, barY + barH / 2 + 5)

  // Send arrow button (red/video-style, echoes "snap rouge").
  const sendX = barX + barW + 24
  const sendY = barY + barH / 2
  ctx.beginPath()
  ctx.arc(sendX, sendY, 24, 0, Math.PI * 2)
  ctx.fillStyle = '#FF3B30'
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.moveTo(sendX - 7, sendY - 9)
  ctx.lineTo(sendX - 7, sendY + 9)
  ctx.lineTo(sendX + 9, sendY)
  ctx.closePath()
  ctx.fill()

  // Watermark, small and unobtrusive.
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.font = '500 12px Inter, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('FlexCheck', W - 16, 24)
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
