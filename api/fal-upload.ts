// Vercel Serverless Function — uploads a photo to fal.ai storage server-side,
// so the fal.ai API key never reaches the browser.
// Required env var (Vercel Project Settings > Environment Variables): FAL_API_KEY

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fal } from '@fal-ai/client'

export const config = {
  api: {
    bodyParser: false,
  },
}

fal.config({ credentials: process.env.FAL_API_KEY })

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const buffer = await readRawBody(req)
    const contentType = (req.headers['content-type'] as string) || 'image/png'
    const blob = new Blob([buffer], { type: contentType })

    const url = await fal.storage.upload(blob)
    return res.status(200).json({ url })
  } catch (err: any) {
    console.error('fal-upload error', err)
    return res.status(500).json({ error: err.message ?? 'Server error' })
  }
}
