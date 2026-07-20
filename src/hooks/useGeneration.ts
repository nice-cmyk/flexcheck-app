import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabase'
import { composeImage, generateVideo, uploadToFalStorage, OutputFormat } from '../lib/fal'
import { useCredits as useCreditsLib, COSTS, videoTotalCost } from '../lib/credits'

export type GenerationType = 'photo' | 'video'
export type VideoDuration = 'short' | 'long'

export type GenerationStep =
  | 'idle'
  | 'analyzing'
  | 'uploading'
  | 'composing'
  | 'rendering_video'
  | 'finalizing'
  | 'complete'
  | 'failed'

export function useGeneration(userId: string | undefined) {
  const [step, setStep] = useState<GenerationStep>('idle')
  const [progress, setProgress] = useState(0)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    async (
      type: GenerationType,
      userPhotoUrl: string,
      prompt: string,
      videoDuration: VideoDuration = 'short',
      format: OutputFormat = 'vertical'
    ) => {
      if (!userId) {
        setError('You must be logged in.')
        return
      }

      const creditsNeeded = type === 'photo' ? COSTS.photo : videoTotalCost(videoDuration)
      setStep('analyzing')
      setProgress(10)
      setError(null)

      try {
        const ok = await useCreditsLib(userId, creditsNeeded)
        if (!ok) {
          setError('Not enough credits.')
          setStep('failed')
          return
        }

        // The photo the user picked lives as a local blob: URL in the browser.
        // fal.ai's servers can't reach that, so upload it to fal storage first
        // to get a real hosted URL.
        setStep('uploading')
        setProgress(25)
        const photoBlob = await fetch(userPhotoUrl).then((r) => r.blob())
        const hostedPhotoUrl = await uploadToFalStorage(photoBlob)

        setStep('composing')
        setProgress(55)
        const compositeUrl = await composeImage(hostedPhotoUrl, prompt, format)

        let finalUrl = compositeUrl

        if (type === 'video') {
          setStep('rendering_video')
          setProgress(80)
          // Video rendering is now polled (can take over a minute) - nudge
          // the progress bar forward on each poll tick so it doesn't look
          // stuck, capping below 95 (reserved for the finalizing step).
          const video = await generateVideo({
            compositeImageUrl: compositeUrl,
            sceneDescription: prompt,
            format,
            onTick: () => setProgress((p) => Math.min(p + 1, 94)),
          })
          finalUrl = video.videoUrl
        }

        setStep('finalizing')
        setProgress(95)

        // Log the generation to Supabase, but don't let it block showing the
        // result: this used to be `await`-ed before marking the generation
        // 'complete', so if this insert ever hung (network blip, RLS policy
        // issue, Supabase outage) the user was stuck staring at a frozen
        // progress screen despite the photo/video already being fully ready.
        // The insert still happens, it just can't hold up the UI anymore.
        supabase
          .from('generations')
          .insert({
            user_id: userId,
            type,
            user_prompt: prompt,
            composite_image_url: compositeUrl,
            final_url: finalUrl,
            status: 'complete',
            credits_used: creditsNeeded,
          })
          .then(({ error: insertError }) => {
            if (insertError) console.error('generations insert failed (non-blocking)', insertError)
          })

        setResultUrl(finalUrl)
        setProgress(100)
        setStep('complete')
      } catch (e: any) {
        setError(e?.message ?? 'An error occurred during generation.')
        setStep('failed')
      }
    },
    [userId]
  )

  return { step, progress, resultUrl, error, run }
}
