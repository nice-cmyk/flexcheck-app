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
    const { compositeImageUrl, sceneDescription, aspectRatio } = req.body ?? {}
    if (!compositeImageUrl || !sceneDescription) {
      return res.status(400).json({ error: 'Missing compositeImageUrl or sceneDescription' })
    }
    const ratio = aspectRatio === '1:1' ? '1:1' : '9:16'

    // The default prompt/motion_strength below were tuned for a near-static
    // portrait shot (breathing, blinking) - great for "sitting in a car" but
    // it drowns out an actual driving request ("car moving, turning left in
    // the parking lot") because the human-stillness wording dominates and
    // motion_strength was capped very low. When the user's own description
    // is clearly about the car/scene actually moving, switch to a prompt
    // that puts that motion first and raise motion_strength so it's visible.
    const drivingRegex = /voiture|conduit|conduir|roul|virage|tourn|gara|parking|route|autoroute|acc[ée]l[ée]r|vitesse|freine?|d[ée]marr|avanc|recul|\bcar\b|drive|driving|turn|road|highway|accelerat|speed|reverse|moving|move/i
    const isDrivingScene = drivingRegex.test(sceneDescription)

    const prompt = isDrivingScene
      ? `POV from inside the car: the car is actually moving and driving through the scene exactly as described - ${sceneDescription}. Show real forward motion, the environment (walls, pillars, other cars, road markings) passing by and receding realistically, the steering wheel turning in sync with any turn described, hands adjusting on the wheel, subtle body sway from acceleration and steering. Cinematic 24fps film grain, photorealistic, ultra realistic motion, smooth and continuous, no teleporting or static freeze.`
      : `ultra realistic subtle human motion, natural micro-movements, gentle chest breathing visible, eyes blink naturally, small involuntary head micro-movements, ${sceneDescription} ambient motion, cinematic 24fps film grain, photorealistic`

    const result = await fal.subscribe('fal-ai/kling-video/v2.5/pro/image-to-video', {
      input: {
        image_url: compositeImageUrl,
        prompt,
        negative_prompt: 'jerky motion, unnatural movement, distorted face, morphing, glitching, artifacts, static image, no movement, frozen',
        duration: '5',
        aspect_ratio: ratio,
        motion_strength: isDrivingScene ? 0.8 : 0.35,
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
