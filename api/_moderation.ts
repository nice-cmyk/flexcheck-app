// Shared heuristic used by fal-compose.ts and fal-video-status.ts to detect
// when fal.ai/OpenAI's content-safety filter is what actually killed a
// generation (as opposed to a real bug/outage). fal.ai doesn't give us a
// stable error code for this, so we pattern-match the error text - false
// negatives just fall back to the generic error message, so this is safe to
// keep loose.
export function isModerationError(err: any): boolean {
  // fal.ai/OpenAI most commonly surface a content-policy rejection as a
  // plain HTTP 422 "Unprocessable Entity" with little else useful in the
  // body, so treat that status as a strong signal on its own (image/video
  // requests otherwise essentially never get a 422 for any other reason).
  const status = err?.status ?? err?.statusCode ?? err?.response?.status
  if (status === 422) return true

  const text = JSON.stringify(err?.body ?? err?.message ?? err ?? '').toLowerCase()
  return (
    text.includes('moderation') ||
    text.includes('safety') ||
    text.includes('content_policy') ||
    text.includes('content policy') ||
    text.includes('flagged') ||
    text.includes('rejected') ||
    text.includes('unprocessable') ||
    (text.includes('blocked') && (text.includes('policy') || text.includes('content')))
  )
}
