import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageview } from '../../lib/analytics'

/** Fires a pageview to GA4/PostHog on every client-side route change. Mount once, inside <BrowserRouter>. */
export default function RouteTracker() {
  const location = useLocation()

  useEffect(() => {
    trackPageview(location.pathname + location.search)
  }, [location.pathname, location.search])

  return null
}
