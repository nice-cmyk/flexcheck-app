import { useRef, useState } from 'react'

interface BeforeAfterSliderProps {
  beforeLabel?: string
  afterLabel?: string
  beforeSlot: React.ReactNode
  afterSlot: React.ReactNode
  /** If true, the divider follows the cursor across the whole area without needing to click-drag. */
  followMouse?: boolean
}

export default function BeforeAfterSlider({
  beforeLabel = 'Before',
  afterLabel = 'After',
  beforeSlot,
  afterSlot,
  followMouse = false,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  function updateFromClientX(clientX: number) {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-2xl overflow-hidden select-none touch-none"
      onMouseMove={(e) => (followMouse || dragging.current) && updateFromClientX(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => {
        dragging.current = true
        updateFromClientX(e.touches[0].clientX)
      }}
      onTouchMove={(e) => {
        if (dragging.current) updateFromClientX(e.touches[0].clientX)
      }}
      onTouchEnd={() => (dragging.current = false)}
    >
      <div className="absolute inset-0">{afterSlot}</div>
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        {beforeSlot}
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] cursor-ew-resize"
        style={{ left: `${position}%` }}
        onMouseDown={() => (dragging.current = true)}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-