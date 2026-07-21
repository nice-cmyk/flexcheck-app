// Vercel Serverless Function — SUBMITS the Kling 2.5 Pro image-to-video job
// to fal.ai's async queue and returns immediately with a requestId.
// Required env var (Vercel Project Settings > Environment Variables): FAL_API_KEY
//
// IMPORTANT: this used to call fal.subscribe(), which blocks the whole
// function until the video is fully rendered (Kling can take well over a
// minute). That single long-running request was hitting Vercel's platform
// gateway timeout and coming back as a 504 to the client, independent of
// this function's own `maxDuration` setting. Submitting to the queue here
// and polling from api/fal-video-status.ts instead keeps every individual
// request short, so it can't time out no matter how long Kling takes.

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fal } from '@fal-ai/client'
import { KLING_ENDPOINT, extractErrorMessage } from './_kling.js'

export const config = {
  maxDuration: 30,
}

fal.config({ credentials: process.env.FAL_API_KEY })

// Auto-expand the user's short, often vague description into a detailed
// 10+ line cinematic motion prompt via an LLM (fal-ai/any-llm, same
// FAL_API_KEY - no extra account/key needed). This fixes two recurring
// issues: the old hardcoded template gave Kling too little detail to work
// with, and vehicle speed looked arbitrary/wrong because nothing told the
// model how fast a car should realistically move in a given context
// (parking garage vs street vs highway). If this step fails or times out
// for any reason, we silently fall back to the previous deterministic
// template so video generation never breaks because of it.
async function expandPrompt(sceneDescription: string, isDrivingScene: boolean): Promise<string | null> {
  try {
    const systemPrompt = isDrivingScene
      ? `You are a cinematography director writing motion prompts for an AI image-to-video model (Kling), POV from inside a car.
Rewrite the user's short request into a highly detailed English prompt of 10 to 15 lines describing exactly how the video should look and move.
Mandatory rules:
- Follow every action in the user's request faithfully (starting, turning, braking, parking, etc.) - never invent actions that contradict it.
- Calibrate the car's speed REALISTICALLY based on the context and state it explicitly: underground parking garage or tight maneuvering ≈ 5-15 km/h (slow, careful), city street ≈ 30-50 km/h, open road ≈ 60-90 km/h, highway ≈ 110-140 km/h. Describe how that speed actually looks: how fast the environment (pillars, walls, other cars, road markings, buildings) passes by and recedes, the amount of motion blur on the sides, the sense of inertia.
- Describe the steering wheel turning in sync with any turn, hands adjusting naturally on the wheel.
- Describe subtle driver body sway from acceleration, braking, and steering.
- Explicitly state that the driver's hand position/count, the interior, and every other vehicle or object visible must stay exactly as in the original photo - only their position/perspective should change naturally with the camera motion. Do not let the model invent extra hands, extra vehicles, or change any object's shape.
- Mention cinematic 24fps film grain, photorealistic lighting, ultra realistic detail.
- End with smooth and continuous motion, no teleporting, no freezing, no jerky or unnatural movement, no warping or morphing objects.
Reply with ONLY the final prompt in English, no preamble, no quotes, no markdown, no explanations.`
      : `You are a cinematography director writing motion prompts for an AI image-to-video model (Kling), applied to a mostly still photo (portrait/lifestyle shot).
Rewrite the user's short request into a highly detailed English prompt of 10 to 15 lines describing exactly how the video should look and move.
Mandatory rules:
- Follow every detail in the user's request faithfully.
- Describe ultra realistic subtle human motion: natural micro-movements, gentle visible breathing, natural eye blinks, small involuntary head movements.
- Describe the ambient motion of the scene itself (light, background elements, fabric, hair) matching the context described.
- The camera stays completely fixed in the exact same physical position and framing as the original photo for the entire clip. Explicitly state that the video must NEVER cut, transition, zoom into, or fly into any screen, window, mirror, or reflection visible in the photo (for example a phone screen or plane window) - whatever is shown on that screen/window must stay small and in the background exactly as in the photo, never take over the frame.
- If the person is holding an object (phone, glass, etc.), state explicitly that the object, hand position and hand count must stay exactly as in the original photo.
- Mention cinematic 24fps film grain, photorealistic lighting, ultra realistic detail.
- End with smooth and continuous motion, no teleporting, no freezing, no jerky or unnatural movement, no scene cuts, no location change.
Reply with ONLY the final prompt in English, no preamble, no quotes, no markdown, no explanations.`

    const result = await fal.subscribe('fal-ai/any-llm', {
      input: {
        model: 'openai/gpt-4o-mini',
        system_prompt: systemPrompt,
        prompt: sceneDescription,
        temperature: 0.6,
        max_tokens: 700,
      },
    })

    const text = (result.data as any)?.output
    if (typeof text === 'string' && text.trim().length > 60) {
      return text.trim()
    }
    return null
  } catch (err) {
    console.error('fal-video prompt-expansion error (falling back to template)', err)
    return null
  }
}

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

    // "Keep everything else exactly as in the original photo" is added
    // explicitly - at higher motion_strength Kling was hallucinating things
    // that don't exist in the source image (a second hand appearing on the
    // wheel, a warped/melting car in the mirror, a car in front that changes
    // shape between frames) because it has to invent off-camera content to
    // fill the requested motion. Keeping it in the prompt (not just negative)
    // reduces that.
    const fallbackPrompt = isDrivingScene
      ? `POV from inside the car: the car is actually moving and driving through the scene exactly as described - ${sceneDescription}. Show real forward motion, the environment (walls, pillars, other cars, road markings) passing by and receding realistically, the steering wheel turning in sync with any turn described, hands adjusting on the wheel, subtle body sway from acceleration and steering. Keep the driver's hand position and grip exactly as in the original photo - do not add a second hand or change hand count. Keep every other vehicle, object and surface exactly as they appear in the original photo, only their position/perspective should change naturally with the camera motion. Cinematic 24fps film grain, photorealistic, ultra realistic motion, smooth and continuous, no teleporting or static freeze.`
      : `ultra realistic subtle human motion, natural micro-movements, gentle chest breathing visible, eyes blink naturally, small involuntary head micro-movements, ${sceneDescription} ambient motion, cinematic 24fps film grain, photorealistic. Camera stays completely fixed in the same position and framing as the original photo. Do not cut, zoom into, or transition into any screen, window, or reflection visible in the photo - keep it small and in the background exactly as shown. Keep everything else, including any object held in hand, exactly as in the original photo.`

    const expanded = await expandPrompt(sceneDescription, isDrivingScene)
    const prompt = expanded ?? fallbackPrompt

    // Note: 'fal-ai/kling-video/v2.5/pro/image-to-video' (without "-turbo")
    // does not exist on fal.ai and was returning a 404 "Not Found" error on
    // every video generation - the turbo variant is the real v2.5 Pro endpoint.
    const { request_id } = await fal.queue.submit(KLING_ENDPOINT, {
      input: {
        image_url: compositeImageUrl,
        prompt,
        negative_prompt: 'jerky motion, unnatural movement, distorted face, morphing, glitching, artifacts, static image, no movement, frozen, unrealistic speed, inconsistent speed, extra hand, extra limb, additional hand appearing, changing number of hands, warped vehicle, melting car, deformed car, morphing car, car changing shape, invented vehicle not in original photo, inconsistent objects between frames, hallucinated details, flickering geometry, scene transition, scene cut, jump cut, zooming into screen, camera flying into phone or window, screen takeover, location change, teleporting to a different location, camera leaving the original scene, changing environment mid-clip',
        duration: '5',
        aspect_ratio: ratio,
        // Lowered from 0.8/0.35: at higher values the model was not just
        // hallucinating small details but sometimes fully cutting away from
        // the original scene (e.g. "zooming into" a phone screen visible in
        // the photo and replacing the whole frame with invented content).
        // Lower values keep the camera anchored to the actual photo.
        motion_strength: isDrivingScene ? 0.6 : 0.25,
      },
    })

    return res.status(200).json({ requestId: request_id })
  } catch (err: any) {
    console.error('fal-video submit error', err)
    return res.status(500).json({ error: extractErrorMessage(err) })
  }
}
