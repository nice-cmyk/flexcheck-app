// Vercel Serverless Function — runs the Kling 2.5 Pro image-to-video step
// server-side, keeping the fal.ai API key off the client.
// Required env var (Vercel Project Settings > Environment Variables): FAL_API_KEY
// Note: this is the higher-cost step; the client controls when it's called.

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fal } from '@fal-ai/client'

export const config = {
  maxDuration: 120,
}

fal.config({ credentials: process.env.FAL_API_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { compositeImageUrl, sceneDescription } = req.body ?? {}
    if (!compositeImageUrl || !sceneDescription) {
      return res.status(400).json({ error: 'Missing compositeImageUrl or sceneDescription' })
    }

    const result = await fal.subscribe('fal-ai/kling-video/v2.5/pro/image-to-video', {
      input: {
        image_url: compositeImageUrl,
        prompt: `ultra realistic subtle human motion, natural micro-movements, gentle chest breathing visible, eyes blink naturally, small involuntary head micro-movements, ${sceneDescription} ambient motion, cinematic 24fps film grain, photorealistic`,
        negative_prompt: 'jerky motion, unnatural movement, distorted face, morphing, glitching, artifacts',
        duration: '5',
        aspect_ratio: '9:16',
        motion_strength: 0.35,
      },
    })

    const videoUrl = (result.data as any)?.video?.url
    if (!videoUrl) {
      return res.status(502).json({ error: 'Video generation returned no video' })
    }

    return res.status(200).json({ requestId: result.requestId, videoUrl })
  } catch (err: any) {
    console.error('fal-video error', err)
    return res.status(500).json({ error: err.message ?? 'Server error' })
  }
}
