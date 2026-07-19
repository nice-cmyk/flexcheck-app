// Vercel Serverless Function — runs the Nano Banana (Gemini 2.5 Flash Image edit)
// photo composition step server-side, keeping the fal.ai API key off the client.
// Required env var (Vercel Project Settings > Environment Variables): FAL_API_KEY

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fal } from '@fal-ai/client'

fal.config({ credentials: process.env.FAL_API_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userPhotoUrl, sceneDescription } = req.body ?? {}
    if (!userPhotoUrl || !sceneDescription) {
      return res.status(400).json({ error: 'Missing userPhotoUrl or sceneDescription' })
    }

    const prompt = `Edit this photo based on this request: ${sceneDescription}. Apply any requested
changes to the scene, background, outfit, or pose exactly as described, even if that means changing
what the person is wearing or doing. Keep the person's face and identity clearly recognizable and
consistent with the original photo. Make it photorealistic, portrait 9:16 format, cinematic lighting,
ultra realistic, high detail.`

    const result = await fal.subscribe('fal-ai/nano-banana/edit', {
      input: {
        image_urls: [userPhotoUrl],
        prompt,
        aspect_ratio: '9:16',
        num_images: 1,
      },
    })

    const url = (result.data as any)?.images?.[0]?.url
    if (!url) {
      return res.status(502).json({ error: 'Image generation returned no image' })
    }

    return res.status(200).json({ url })
  } catch (err: any) {
    console.error('fal-compose error', err)
    return res.status(500).json({ error: err.message ?? 'Server error' })
  }
}
