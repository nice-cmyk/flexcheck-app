// fal.ai integration — Nano Banana (Gemini 2.5 Flash Image) for photo editing,
// Kling 2.5 Pro for image-to-video, plus file storage.
//
// All actual fal.ai calls happen server-side in /api/fal-upload, /api/fal-compose,
// and /api/fal-video (Vercel Serverless Functions). The browser never sees the
// fal.ai API key — it only talks to our own backend.

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error ?? `Request to ${path} failed (${res.status})`)
  }
  return data as T
}

/**
 * Uploads a Blob or File to fal.ai's storage (via our server-side proxy) and
 * returns a public URL.
 */
export async function uploadToFalStorage(file: Blob): Promise<string> {
  const res = await fetch('/api/fal-upload', {
    method: 'POST',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error ?? `Upload failed (${res.status})`)
  }
  return data.url as string
}

export type OutputFormat = 'vertical' | 'square'

/** vertical -> 9:16 (Stories/Reels/Snap), square -> 1:1 (Instagram feed post) */
function toAspectRatio(format: OutputFormat = 'vertical'): '9:16' | '1:1' {
  return format === 'square' ? '1:1' : '9:16'
}

/**
 * Composes the final photo: places the person from the user's photo into the
 * described luxury scene, using Nano Banana (Gemini 2.5 Flash Image edit).
 * Returns a hosted image URL.
 */
export async function composeImage(
  userPhotoUrl: string,
  sceneDescription: string,
  format: OutputFormat = 'vertical'
): Promise<string> {
  const { url } = await postJson<{ url: string }>('/api/fal-compose', {
    userPhotoUrl,
    sceneDescription,
    aspectRatio: toAspectRatio(format),
  })
  return url
}

export type KlingVideoInput = {
  compositeImageUrl: string
  sceneDescription: string
  format?: OutputFormat
  /** Called each time we poll the job so the UI can keep the progress bar moving. */
  onTick?: () => void
}

export type KlingVideoResult = {
  requestId: string
  videoUrl: string
}

/**
 * Video generation can take well over a minute on Kling, which was blowing
 * past Vercel's platform gateway timeout when we waited on a single request
 * (client saw a 504). We now submit the job (fast) and poll a separate
 * status endpoint every few seconds until it's done, so no single request
 * is ever long-lived.
 */
export async function generateVideo({ compositeImageUrl, sceneDescription, format, onTick }: KlingVideoInput): Promise<KlingVideoResult> {
  const { requestId } = await postJson<{ requestId: string }>('/api/fal-video', {
    compositeImageUrl,
    sceneDescription,
    aspectRatio: toAspectRatio(format),
  })

  const maxAttempts = 90 // ~90 * 4s = 6 minutes ceiling
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((r) => setTimeout(r, 4000))
    onTick?.()

    const res = await fetch(`/api/fal-video-status?requestId=${encodeURIComponent(requestId)}`)
    const data = await res.json().catch(() => ({}))

    if (!res.ok || data.status === 'FAILED') {
      throw new Error(data?.error ?? 'Video generation failed')
    }
    if (data.status === 'COMPLETED') {
      return { requestId, videoUrl: data.videoUrl }
    }
    // IN_QUEUE / IN_PROGRESS -> keep polling
  }

  throw new Error('Video generation is taking longer than expected. Please try again.')
}
