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

/**
 * Composes the final photo: places the person from the user's photo into the