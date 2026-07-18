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

    const prompt = `Place the person from this photo into: ${sceneDescription}. Keep the person exactly
as they appear - same face, same clothes, same expression, same pose. Make the scene photorealistic,
portrait 9:16 format, cinematic lighting, ultra realistic, high detail.`

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
