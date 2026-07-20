// Shared constant between api/fal-video.ts (submit) and api/fal-video-status.ts
// (poll). Prefixed with "_" so Vercel does not treat this file as its own
// API route - it's a plain module, not an endpoint.
export const KLING_ENDPOINT = 'fal-ai/kling-video/v2.5-turbo/pro/image-to-video'

// Best-effort extraction of a readable message from whatever shape of error
// the fal.ai SDK throws (it isn't always a plain Error with .message - can
// be a fetch Response-like object, an object with .body.detail, etc). We
// were previously showing the generic "Video generation failed" fallback
// with no real information because err.message was empty for some error
// shapes, making the actual cause impossible to diagnose from the client.
export function extractErrorMessage(err: any): string {
  if (!err) return 'Unknown error'
  if (typeof err === 'string') return err
  if (err.message) return String(err.message)
  if (err.body?.detail) return typeof err.body.detail === 'string' ? err.body.detail : JSON.stringify(err.body.detail)
  if (err.error) return typeof err.error === 'string' ? err.error : JSON.stringify(err.error)
  try {
    return JSON.stringify(err)
  } catch {
    return String(err)
  }
}
