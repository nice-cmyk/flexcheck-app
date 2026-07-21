// Tracking layer - GA4 (traffic/conversions) + PostHog (product behavior/funnels)
// + Vercel Analytics (basic visits, wired separately as a React component in
// main.tsx). All three are optional and no-op safely if their env vars are
// missing, so the app keeps working even before you've created the accounts.
//
// Required env vars (Vercel Project Settings > Environment Variables, and
// .env.local for dev) - all VITE_ prefixed since they're read client-side:
//   VITE_GA_MEASUREMENT_ID   e.g. G-XXXXXXXXXX (Google Analytics 4)
//   VITE_POSTHOG_KEY         e.g. phc_xxx (PostHog project API key)
//   VITE_POSTHOG_HOST        e.g. https://us.i.posthog.com (or your self-host)

import posthog from 'posthog-js'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined
const POSTHOG_HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com'

let initialized = false

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

/** Call once at app startup (see main.tsx). Safe to call multiple times. */
export function initAnalytics() {
  if (initialized) return
  initialized = true

  if (GA_ID) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    // send_page_view disabled: we send page_view manually on route change
    // (see RouteTracker) since this is an SPA and GA's automatic pageview
    // only fires once on initial script load.
    window.gtag('config', GA_ID, { send_page_view: false })
  }

  if (POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false, // manual, same reason as GA above
      capture_pageleave: true,
    })
  }
}

/** Call on every route change (see RouteTracker component). */
export function trackPageview(path: string) {
  if (GA_ID && window.gtag) {
    window.gtag('event', 'page_view', { page_path: path })
  }
  if (POSTHOG_KEY) {
    posthog.capture('$pageview', { $current_url: window.location.origin + path })
  }
}

/**
 * Fires a custom event to every configured tool at once. Use for the
 * business-meaningful moments (signup, checkout started, purchase,
 * generation completed) - not for noisy UI clicks.
 */
export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (GA_ID && window.gtag) {
    window.gtag('event', name, props ?? {})
  }
  if (POSTHOG_KEY) {
    posthog.capture(name, props)
  }
}

/** Associates future events with a logged-in user (call after login/signup). */
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (POSTHOG_KEY) {
    posthog.identify(userId, traits)
  }
  if (GA_ID && window.gtag) {
    window.gtag('set', 'user_id', userId)
  }
}
