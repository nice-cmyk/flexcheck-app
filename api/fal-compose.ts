// Vercel Serverless Function — runs the GPT Image 2 (OpenAI's latest image model,
// the same one powering ChatGPT's free-tier image generation) photo composition
// step server-side, keeping the fal.ai API key off the client.
// Required env var (Vercel Project Settings > Environment Variables): FAL_API_KEY

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fal } from '@fal-ai/client'

fal.config({ credentials: process.env.FAL_API_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userPhotoUrl, sceneDescription, aspectRatio } = req.body ?? {}
    if (!userPhotoUrl || !sceneDescription) {
      return res.status(400).json({ error: 'Missing userPhotoUrl or sceneDescription' })
    }
    const ratio = aspectRatio === '1:1' ? '1:1' : '9:16'

    const formatLabel = ratio === '1:1' ? 'square 1:1 format' : 'portrait 9:16 format'
    const prompt = `Edit this photo based on this request: ${sceneDescription}. Apply any requested
changes to the scene, background, outfit, or pose exactly as described, even if that means changing
what the person is wearing or doing. Keep the person's face and identity clearly recognizable and
consistent with the original photo. Make it photorealistic, ${formatLabel}, cinematic lighting,
ultra realistic, high detail.`

    // Explicit pixel dimensions instead of a named preset: the model is more
    // reliable at actually respecting a concrete {width, height} than the
    // "portrait_16_9" preset, which was coming back square regardless.
    const imageSize = ratio === '1:1' ? { width: 1024, height: 1024 } : { width: 1024, height: 1824 }

    const result = await fal.subscribe('openai/gpt-image-2/edit', {
      input: {
        image_urls: [userPhotoUrl],
        prompt,
        image_size: imageSize,
        quality: 'high',
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
