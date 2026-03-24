import { useState, useRef, useEffect } from 'react'
import { searchServices, getSpreadingOfAshesAndBurialsAtSea } from '../services/searchService'
import { FeaturedAd } from '../components/FeaturedAd'

const SERVICE_TYPES = [
  { id: 'mortuary', label: 'Mortuary' },
  { id: 'cremation', label: 'Cremation' },
  { id: 'cemetery', label: 'Burials' },
]

const RADIUS_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200]

function getLogoUrl(business) {
  if (business.logoUrl) return business.logoUrl
  if (!business.website) return null
  try {
    const domain = new URL(business.website).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  } catch {
    return null
  }
}

export default function HomePage() {
  const [serviceType, setServiceType] = useState(null)
  const [city, setCity] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [radius, setRadius] = useState(20)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [spreadingOfAshesResults, setSpreadingOfAshesResults] = useState([])
  const [spreadingOfAshesLoading, setSpreadingOfAshesLoading] = useState(false)
  const resultsSectionRef = useRef(null)
  const spreadingSectionRef = useRef(null)

  useEffect(() => {
    if (searched && resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [searched, loading, results])

  const handleSearch = async (e) => {
    e.preventDefault()
    setSearchError(null)
    setSearched(true)
    const hasZip = Boolean(zipCode?.trim())
    const hasCityState = Boolean(city?.trim() && stateCode?.trim())
    if (!serviceType || (!hasZip && !hasCityState)) {
      setSearchError('Please select a service type and enter either City + State, ZIP Code, or both.')
      setResults([])
      return
    }
    setLoading(true)
    setResults([])
    setSpreadingOfAshesResults([])
    try {
      const list = await searchServices({
        serviceType,
        zipCode: zipCode.trim(),
        city: city.trim(),
        state: stateCode.trim(),
        radiusMiles: radius,
      })
      setResults(list)
    } catch (err) {
      console.error(err)
      const missingApi =
        import.meta.env.PROD &&
        !(import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim())
      setSearchError(
        missingApi
          ? 'Search isn’t available yet: the public site needs the backend API. In Cloudflare Pages, set environment variable VITE_API_URL to your deployed API URL (https://…), then redeploy. See README.'
          : 'Something went wrong. Please try again.',
      )
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const locationLabel = [
    city?.trim() ? city.trim() : null,
    stateCode?.trim() ? stateCode.trim().toUpperCase() : null,
    zipCode?.trim() ? `ZIP ${zipCode.trim()}` : null,
  ].filter(Boolean).join(' • ') || 'your location'

  const handleSpreadingOfAshesClick = async () => {
    if (!zipCode?.trim() && !(city?.trim() && stateCode?.trim())) return
    setSpreadingOfAshesLoading(true)
    setSpreadingOfAshesResults([])
    try {
      const list = await getSpreadingOfAshesAndBurialsAtSea({
        zipCode: zipCode.trim(),
        city: city.trim(),
        state: stateCode.trim(),
      })
      setSpreadingOfAshesResults(list)
      setTimeout(() => spreadingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch {
      setSpreadingOfAshesResults([])
    } finally {
      setSpreadingOfAshesLoading(false)
    }
  }

  return (
    <>
      <header className="header">
        <h1 className="logo">Pre-Plan</h1>
        <p className="tagline">Thoughtful final arrangements for those you love</p>
      </header>

      <main className="main">
        <section className="card search-card">
          <h2 className="question">What Do You Need?</h2>
          <div className="service-buttons">
            {SERVICE_TYPES.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={`service-btn ${serviceType === id ? 'active' : ''}`}
                onClick={() => setServiceType(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} className="search-form">
            <div className="location-choice-wrap">
              <div className="form-row">
                <label htmlFor="city">City, State</label>
                <input
                  id="city"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  id="state"
                  type="text"
                  placeholder="State (e.g. CA)"
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value.replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase())}
                />
              </div>
              <div className="location-or">Or</div>
              <div className="form-row">
                <label htmlFor="zip">ZIP Code</label>
                <input
                  id="zip"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 90210"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                />
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="radius">Radius</label>
              <select id="radius" value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
                {RADIUS_OPTIONS.map((miles) => (
                  <option key={miles} value={miles}>{miles} miles</option>
                ))}
              </select>
            </div>
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? 'Searching…' : 'Search'}
            </button>
          </form>
        </section>

        {searched && (
          <section className="results-section" ref={resultsSectionRef}>
            {searchError ? (
              <div className="empty-results"><p>{searchError}</p></div>
            ) : loading ? (
              <div className="loading">Finding options near {locationLabel}…</div>
            ) : results.length === 0 ? (
              <div className="empty-results">
                <p>No results found for your area. Try a larger radius or a different location.</p>
              </div>
            ) : (
              <>
                <h2 className="results-title">
                  {SERVICE_TYPES.find((s) => s.id === serviceType)?.label} near {locationLabel}
                </h2>
                {(() => {
                  const featured = results.filter((b) => b.featured)
                  const regular = results.filter((b) => !b.featured)
                  const BusinessCard = ({ business, isFeatured }) => (
                    <li key={business.id} className={isFeatured ? 'result-card featured-card' : 'result-card'}>
                      <div className={isFeatured ? 'featured-brand-row' : undefined}>
                        {isFeatured && getLogoUrl(business) && (
                          <img src={getLogoUrl(business)} alt="" className="featured-logo" onError={(e) => { e.target.style.display = 'none' }} />
                        )}
                        <h3
                          className={`business-name ${business.featuredNameBold ? 'business-name-bold' : ''}`}
                          style={isFeatured && business.fontFamily ? { fontFamily: business.fontFamily } : undefined}
                        >
                          {business.name}
                          {isFeatured && <span className="sponsored-label">Sponsored</span>}
                        </h3>
                      </div>
                      {isFeatured && business.servicesDescription && (
                        <div className="business-services"><strong>Services:</strong> {business.servicesDescription}</div>
                      )}
                      <p className="business-address">{business.address}</p>
                      {(business.city || business.state) && (
                        <p className="business-city-state">{[business.city, business.state].filter(Boolean).join(', ')}</p>
                      )}
                      {business.businessType && <p className="business-type">{business.businessType}</p>}
                      <p className="business-distance">{business.distance} from {locationLabel}</p>
                      <div className="business-links">
                        {business.phone && <a href={`tel:${business.phone}`} className="link-phone">{business.phone}</a>}
                        {business.website && (
                          <a href={business.website} target="_blank" rel="noopener noreferrer" className="link-website">
                            {business.website.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                      </div>
                      <div className="business-meta">
                        {business.googleReview != null && (
                          <span className="meta-item">Google: {business.googleReview} ★</span>
                        )}
                      </div>
                    </li>
                  )
                  return (
                    <>
                      {featured.length > 0 && (
                        <div className="featured-section" aria-label="Featured businesses">
                          <h3 className="featured-heading">Featured</h3>
                          <FeaturedAd />
                          <ul className="results-list featured-list">
                            {featured.map((b) => <BusinessCard key={b.id} business={b} isFeatured />)}
                          </ul>
                        </div>
                      )}
                      {regular.length > 0 && (
                        <>
                          <h3 className="more-options-heading">More options</h3>
                          <ul className="results-list">
                            {regular.map((b) => <BusinessCard key={b.id} business={b} isFeatured={false} />)}
                          </ul>
                        </>
                      )}
                      {serviceType === 'cremation' && (
                        <div className="spreading-cta-wrap">
                          <button type="button" className="spreading-cta-btn" onClick={handleSpreadingOfAshesClick} disabled={spreadingOfAshesLoading}>
                            {spreadingOfAshesLoading ? 'Loading…' : 'Interested In Spreading of Ashes?'}
                          </button>
                        </div>
                      )}
                      {(spreadingOfAshesLoading || spreadingOfAshesResults.length > 0) && serviceType === 'cremation' && (
                        <div className="spreading-section" ref={spreadingSectionRef}>
                          {spreadingOfAshesLoading ? (
                            <div className="loading">Finding spreading of ashes and burials at sea services…</div>
                          ) : (
                            <>
                              <h3 className="spreading-section-title">Spreading of Ashes & Burials at Sea (within 500 miles)</h3>
                              {(() => {
                                const featured = spreadingOfAshesResults.filter((b) => b.featured)
                                const regular = spreadingOfAshesResults.filter((b) => !b.featured)
                                const SpreadingCard = ({ business, isFeatured }) => (
                                  <li key={business.id} className={isFeatured ? 'result-card featured-card' : 'result-card'}>
                                    <div className={isFeatured ? 'featured-brand-row' : undefined}>
                                      {isFeatured && getLogoUrl(business) && (
                                        <img src={getLogoUrl(business)} alt="" className="featured-logo" onError={(e) => { e.target.style.display = 'none' }} />
                                      )}
                                      <h3
                                        className={`business-name ${business.featuredNameBold ? 'business-name-bold' : ''}`}
                                        style={isFeatured && business.fontFamily ? { fontFamily: business.fontFamily } : undefined}
                                      >
                                        {business.name}
                                        {isFeatured && <span className="sponsored-label">Sponsored</span>}
                                      </h3>
                                    </div>
                                    {business.businessType && <p className="business-type">{business.businessType}</p>}
                                    {(isFeatured || business.servicesDescription) && business.servicesDescription && (
                                      <div className="business-services"><strong>Services:</strong> {business.servicesDescription}</div>
                                    )}
                                    <p className="business-address">{business.address}</p>
                                    {(business.city || business.state) && (
                                      <p className="business-city-state">{[business.city, business.state].filter(Boolean).join(', ')}</p>
                                    )}
                                    <p className="business-distance">{business.distance} from {locationLabel}</p>
                                    <div className="business-links">
                                      {business.phone && <a href={`tel:${business.phone}`} className="link-phone">{business.phone}</a>}
                                      {business.website && (
                                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="link-website">
                                          {business.website.replace(/^https?:\/\//, '')}
                                        </a>
                                      )}
                                    </div>
                                    <div className="business-meta">
                                      {business.googleReview != null && <span className="meta-item">Google: {business.googleReview} ★</span>}
                                    </div>
                                  </li>
                                )
                                return (
                                  <>
                                    {featured.length > 0 && (
                                      <div className="featured-section" aria-label="Featured businesses">
                                        <h3 className="featured-heading">Featured</h3>
                                        <FeaturedAd />
                                        <ul className="results-list featured-list">
                                          {featured.map((b) => <SpreadingCard key={b.id} business={b} isFeatured />)}
                                        </ul>
                                      </div>
                                    )}
                                    {regular.length > 0 && (
                                      <>
                                        <h3 className="more-options-heading">More options</h3>
                                        <ul className="results-list">
                                          {regular.map((b) => <SpreadingCard key={b.id} business={b} isFeatured={false} />)}
                                        </ul>
                                      </>
                                    )}
                                  </>
                                )
                              })()}
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )
                })()}
              </>
            )}
          </section>
        )}
      </main>
    </>
  )
}
