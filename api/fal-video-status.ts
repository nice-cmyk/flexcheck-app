// Vercel Serverless Function — polls a previously submitted fal.ai Kling
// video job (see api/fal-video.ts) and returns its status/result. Called
// repeatedly (every few seconds) by the client until the job completes.
// Required env var (Vercel Project Settings > Environment Variables): FAL_API_KEY

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fal } from '@fal-ai/client'
import { KLING_ENDPOINT, extractErrorMessage } from './_kling'

export const config = {
  maxDuration: 30,
}

fal.config({ credentials: process.env.FAL_API_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const requestId = (req.query.requestId as string) ?? ''
    if (!requestId) {
      return res.status(400).json({ error: 'Missing requestId' })
    }

    const status = await fal.queue.status(KLING_ENDPOINT, { requestId, logs: false })

    // Per fal.ai docs, a failed generation can still come back with
    // status "COMPLETED" but carry an `error`/`error_type` field instead of
    // a real result - it isn't a separate "FAILED" status value. Check for
    // that before assuming success.
    const statusError = (status as any)?.error
    if (statusError) {
      console.error('fal-video-status: job completed with error', statusError, (status as any)?.error_type)
      return res.status(200).json({ status: 'FAILED', error: extractErrorMessage(statusError) })
    }

    if (status.status === 'COMPLETED') {
      const result = await fal.queue.result(KLING_ENDPOINT, { requestId })
      const videoUrl = (result.data as any)?.video?.url
      if (!videoUrl) {
        console.error('fal-video-status: completed with no video url, raw result:', JSON.stringify(result.data))
        return res.status(200).json({ status: 'FAILED', error: 'Video generation returned no video' })
      }
      return res.status(200).json({ status: 'COMPLETED', videoUrl })
    }

    if (status.status === 'IN_PROGRESS' || status.status === 'IN_QUEUE') {
      return res.status(200).json({ status: status.status })
    }

    // Should not normally happen per fal.ai's documented status values, but
    // surface whatever we actually got instead of a generic message so it's
    // debuggable if the SDK ever returns something unexpected.
    console.error('fal-video-status: unexpected status payload', JSON.stringify(status))
    return res.status(200).json({ status: 'FAILED', error: `Unexpected status: ${JSON.stringify(status)}` })
  } catch (err: any) {
    console.error('fal-video-status error', err)
    return res.status(500).json({ status: 'FAILED', error: extractErrorMessage(err) })
  }
}
