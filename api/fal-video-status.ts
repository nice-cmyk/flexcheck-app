// Vercel Serverless Function — polls a previously submitted fal.ai Kling
// video job (see api/fal-video.ts) and returns its status/result. Called
// repeatedly (every few seconds) by the client until the job completes.
// Required env var (Vercel Project Settings > Environment Variables): FAL_API_KEY

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fal } from '@fal-ai/client'
import { KLING_ENDPOINT } from './fal-video'

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

    if (status.status === 'COMPLETED') {
      const result = await fal.queue.result(KLING_ENDPOINT, { requestId })
      const videoUrl = (result.data as any)?.video?.url
      if (!videoUrl) {
        return res.status(502).json({ status: 'FAILED', error: 'Video generation returned no video' })
      }
      return res.status(200).json({ status: 'COMPLETED', videoUrl })
    }

    if (status.status === 'IN_PROGRESS' || status.status === 'IN_QUEUE') {
      return res.status(200).json({ status: status.status })
    }

    return res.status(200).json({ status: 'FAILED', error: 'Video generation failed' })
  } catch (err: any) {
    console.error('fal-video-status error', err)
    return res.status(500).json({ status: 'FAILED', error: err.message ?? 'Server error' })
  }
}
