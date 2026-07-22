import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PhotoUploadProps {
  onFileSelected: (file: File, previewUrl: string) => void
}

export default function PhotoUpload({ onFileSelected }: PhotoUploadProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  function handleFile(file: File | undefined) {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    onFileSelected(file, url)
  }

  return (
    <div
      className={`border-2 border-dashed rounded-2xl text-center p-8 bg-surface/60 cursor-pointer transition-colors ${
        dragOver ? 'border-primary' : 'border-primary/35'
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        handleFile(e.dataTransfer.files?.[0])
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {previewUrl ? (
        <img src={previewUrl} alt="Selected photo" className="max-h-[420px] w-full mx-auto rounded-lg object-contain" />
      ) : (
        <>
          <div className="text-white text-sm font-medium">{t('photoUpload.drop')}</div>
          <div className="text-primary-light text-sm mt-1.5">{t('photoUpload.browse')}</div>
          <div className="text-white/35 text-xs mt-2">{t('photoUpload.specs')}</div>
        </>
      )}
    </div>
  )
}
