import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'preplan-bottom-ad-dismissed'
const client = import.meta.env.VITE_ADSENSE_CLIENT
const slot = import.meta.env.VITE_ADSENSE_BOTTOM_SLOT || import.meta.env.VITE_ADSENSE_FEATURED_SLOT

/**
 * Fixed bottom banner for Google AdMob/AdSense. Dismissible per session.
 * Set VITE_ADSENSE_CLIENT and VITE_ADSENSE_BOTTOM_SLOT in .env (or reuses VITE_ADSENSE_FEATURED_SLOT if BOTTOM_SLOT not set).
 */
export function BottomAdBanner() {
  const adRef = useRef(null)
  const [dismissed, setDismissed] = useState(() => {
    if (typeof sessionStorage === 'undefined') return false
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  })

  useEffect(() => {
    if (!client || !slot || !adRef.current || dismissed) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      // AdSense script may not be loaded yet
    }
  }, [dismissed])

  const handleDismiss = () => {
    setDismissed(true)
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch (_) {}
  }

  if (!client || !slot) return null
  if (dismissed) return null

  return (
    <div className="bottom-ad-banner" role="complementary" aria-label="Advertisement">
      <button
        type="button"
        className="bottom-ad-dismiss"
        onClick={handleDismiss}
        aria-label="Close ad"
      >
        ×
      </button>
      <div className="bottom-ad-inner">
        <ins
          ref={adRef}
          className="adsbygoogle bottom-ad-unit"
          style={{ display: 'block' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  )
}
