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
      ? `You are the senior creative director at a top-tier production agency, writing a motion-design brief so precise and exhaustive it could be handed to a €1M commercial shoot crew and shot exactly as written, no questions asked. This brief becomes the prompt for an AI image-to-video model (Kling), POV from inside a car. Treat every sentence like it costs money if it's wrong.
Rewrite the user's short request into an extremely detailed, millimeter-precise English prompt of 12 to 18 lines. Vague, generic wording is forbidden - every clause must be concrete and unambiguous. Mandatory rules, in this order of priority:
1. FIRST SENTENCE, before anything else: the driver's hand count must NEVER change during the clip. If the original photo shows only ONE hand resting casually on the wheel, that exact single hand with that exact relaxed grip must be the only hand visible for the entire duration - a second hand must not appear, join the wheel, or become visible at any point, even briefly, even for one frame.
2. Faithfully follow every action in the user's request (starting, accelerating, braking, turning, parking) - never invent an action that contradicts it. Critically: if the request describes acceleration or straight-line driving WITHOUT an explicit turn, the car must travel in a dead straight line down its lane - no turning, no lane change, no swerving. Turning motion is only allowed if the user's request explicitly asks for a turn.
3. Calibrate speed REALISTICALLY and state it explicitly: underground parking/tight maneuvering ≈ 5-15 km/h, city street ≈ 30-50 km/h, open road ≈ 60-90 km/h, highway ≈ 110-140 km/h. Describe exactly how that speed reads on screen: how fast the environment (pillars, walls, road markings, buildings, trees) passes and recedes, the amount of directional motion blur on the sides, the physical sense of inertia pressing the body back into the seat under acceleration.
4. The road must be populated with realistic, contextually appropriate traffic - other vehicles at a believable distance, moving at a plausible relative speed for the road type - unless the user's request explicitly says the road is empty. A real road is essentially never completely empty; describe at least one or two other vehicles unless told otherwise.
5. This must feel like a real, slightly imperfect phone-recorded POV clip, not a polished CGI render: describe continuous subtle vertical camera bounce and shake from road surface vibration and suspension, and describe the steering wheel itself visibly micro-vibrating/trembling in the driver's grip from that same road vibration - never perfectly smooth, never a glide like a train or drone shot. Also describe tiny, natural, involuntary hand micro-corrections on the wheel (a few millimeters of drift and correction) even while driving straight - real drivers are never perfectly still, but this must never look like an actual turn.
6. The road itself stays a single, continuous path exactly as shown in the original photo - it must never fork, split into two roads, gain extra lanes, or duplicate road markings that weren't there.
7. The interior and every other object/vehicle visible must stay exactly as in the original photo - only their position/perspective changes naturally with the camera motion. No invented objects, no warping, no morphing.
8. Mention cinematic 24fps film grain, photorealistic lighting, ultra realistic fine detail (skin texture, fabric weave, leather grain).
9. Close with: smooth continuous forward progress, no teleporting, no freezing, no jerky camera cuts, no scene transitions.
Reply with ONLY the final prompt in English, no preamble, no quotes, no markdown, no numbering, no explanations - just the flowing prompt text a shoot crew would receive.`
      : `You are the senior creative director at a top-tier production agency, writing a motion-design brief so precise and exhaustive it could be handed to a €1M commercial shoot crew and shot exactly as written, no questions asked. This applies to ANY lifestyle scene - restaurant, yacht, plane cabin, poolside, hotel room, rooftop, whatever the photo shows - not just cars. This brief becomes the prompt for an AI image-to-video model (Kling), applied to a mostly still photo. Treat every sentence like it costs money if it's wrong.
Rewrite the user's short request into an extremely detailed, millimeter-precise English prompt of 12 to 18 lines. Vague, generic wording is forbidden - every clause must be concrete and unambiguous. Mandatory rules, in this order of priority:
1. FIRST SENTENCE, before anything else: every person's hand count, hand position, and any object they're holding (phone, glass, cutlery, etc.) must stay EXACTLY as in the original photo for the entire clip - nothing appears, disappears, or changes count at any point, even briefly, even for one frame.
2. Faithfully follow every detail of the user's request - never invent an action or element that contradicts it.
3. Describe ultra realistic subtle human motion appropriate to the scene: natural micro-movements, gentle visible breathing, natural eye blinks, small involuntary head movements, subtle weight shifts - never a frozen mannequin, never an exaggerated performance.
4. Describe the scene's own ambient motion matching its real-world physics: light flicker/shimmer, fabric or hair moving with air currents, water ripples, steam, or similar - whatever is physically appropriate to what's shown, calibrated to be subtle, not dramatic.
5. This must feel like a real, slightly imperfect phone-recorded POV clip, not a polished CGI render: natural handheld micro-jitter, no perfectly locked/floating/drone-smooth camera.
6. The camera stays in the exact same physical position and framing as the original photo for the entire clip - it must NEVER cut, transition, zoom into, or fly into any screen, window, mirror, or reflection visible in the photo. Whatever is shown there stays small and in the background exactly as in the photo, never taking over the frame.
7. Every other person, object, and surface visible must stay exactly as in the original photo - only natural position/perspective shifts from the camera's own subtle motion are allowed. No invented objects, no warping, no morphing, no background elements that weren't there.
8. Mention cinematic 24fps film grain, photorealistic lighting, ultra realistic fine detail (skin texture, fabric weave, material grain).
9. Close with: smooth continuous motion, no teleporting, no freezing, no jerky or unnatural movement, no scene cuts, no location change.
Reply with ONLY the final prompt in English, no preamble, no quotes, no markdown, no numbering, no explanations - just the flowing prompt text a shoot crew would receive.`

    const result = await fal.subscribe('fal-ai/any-llm', {
      input: {
        model: 'openai/gpt-4o-mini',
        system_prompt: systemPrompt,
        prompt: sceneDescription,
        temperature: 0.6,
        max_tokens: 900,
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
      ? `The driver's hand count must stay exactly as in the original photo for the ENTIRE clip - if only one hand is visible resting on the wheel, it must remain exactly one hand with the same relaxed grip throughout, a second hand must never appear or join the wheel, even briefly. POV from inside the car: the car is actually moving and driving through the scene exactly as described - ${sceneDescription}. Show real forward motion with subtle vertical camera bounce and shake from road vibration and suspension - this must feel like a real car on a real road, not a perfectly smooth glide like a train or drone. The road stays a single continuous path exactly as in the original photo - no forks, no extra lanes, no duplicated road markings. The environment (walls, pillars, other cars, road markings) passes by and recedes realistically, the steering wheel turns in sync with any turn described. Keep every other vehicle, object and surface exactly as they appear in the original photo, only their position/perspective should change naturally with the camera motion. Cinematic 24fps film grain, photorealistic, ultra realistic motion, smooth and continuous forward progress, no teleporting or static freeze.`
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
        negative_prompt: 'second hand joining the wheel, extra hand appearing, two-handed grip replacing one-handed grip, hand count changing mid-video, changing number of hands, extra limb, road forking, road splitting into two roads, duplicated road markings, extra lanes appearing, perfectly smooth glide, train-like smooth motion, drone-like floating motion, no vibration, no road bounce, jerky motion, unnatural movement, distorted face, morphing, glitching, artifacts, static image, no movement, frozen, unrealistic speed, inconsistent speed, warped vehicle, melting car, deformed car, morphing car, car changing shape, invented vehicle not in original photo, inconsistent objects between frames, hallucinated details, flickering geometry, scene transition, scene cut, jump cut, zooming into screen, camera flying into phone or window, screen takeover, location change, teleporting to a different location, camera leaving the original scene, changing environment mid-clip',
        duration: '5',
        aspect_ratio: ratio,
        // Lowered again (0.6->0.45 driving, 0.35->0.25 non-driving already
        // done previously): still seeing hand hallucination + a "floating,
        // too smooth" feel (no road vibration) and a road forking into two
        // at this strength. Less motion budget = less room to invent.
        motion_strength: isDrivingScene ? 0.45 : 0.25,
      },
    })

    return res.status(200).json({ requestId: request_id })
  } catch (err: any) {
    console.error('fal-video submit error', err)
    return res.status(500).json({ error: extractErrorMessage(err) })
  }
}
