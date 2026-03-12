import { useEffect, useRef } from 'react'

/**
 * Ad unit for the Featured section. Uses Google AdSense (web) via standard ins tag.
 * For native mobile use AdMob SDK (e.g. @capacitor-community/admob).
 *
 * Set in .env:
 *   VITE_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
 *   VITE_ADSENSE_FEATURED_SLOT=xxxxxxxxxx
 */
const client = import.meta.env.VITE_ADSENSE_CLIENT
const slot = import.meta.env.VITE_ADSENSE_FEATURED_SLOT

export function FeaturedAd() {
  const adRef = useRef(null)

  useEffect(() => {
    if (!client || !slot || !adRef.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      // AdSense script may not be loaded yet
    }
  }, [])

  if (!client || !slot) {
    return (
      <div className="featured-ad-placeholder" aria-hidden="true">
        <span className="featured-ad-label">Ad</span>
        <p className="featured-ad-hint">Configure VITE_ADSENSE_CLIENT and VITE_ADSENSE_FEATURED_SLOT to show ads.</p>
      </div>
    )
  }

  return (
    <div className="featured-ad-wrap">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 90 }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
