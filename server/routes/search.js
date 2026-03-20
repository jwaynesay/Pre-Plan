import { Router } from 'express'
import axios from 'axios'

const router = Router()
const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY
const MILES_TO_METERS = 1609.34
const MAX_RADIUS_METERS = 50000
const BURIALS_SEA_MAX_MILES = 100
const BURIAL_AT_SEA_QUERIES = [
  { query: 'burial at sea', businessType: 'Burials at sea' },
  { query: 'spreading ashes at sea', businessType: 'Spreading of ashes' },
  { query: 'ash scattering at sea charter', businessType: 'Spreading of ashes' },
  { query: 'whale watching ash scattering', businessType: 'Spreading of ashes' },
  { query: 'charter boat ash scattering', businessType: 'Spreading of ashes' },
  { query: 'charter fishing ash scattering', businessType: 'Spreading of ashes' },
]
const MANUAL_BURIAL_BUSINESSES = [
  {
    name: 'Celebration of Life',
    address: '925 Bennett Way, Templeton, CA 93465',
    city: 'Templeton',
    state: 'CA',
    phone: '(805) 994-6440',
    website: 'https://buryashesatsea.com',
    googleReview: null,
    businessType: 'Burials at sea (Morro Bay)',
    servicesDescription: 'Captain Jeff is a minister who is able to perform faith-based services.',
    lat: 35.3658,
    lng: -120.8499,
  },
]

function parseAddressComponents(components) {
  let city = ''
  let state = ''
  for (const c of components || []) {
    if (c.types.includes('locality')) city = c.long_name
    if (c.types.includes('administrative_area_level_1')) state = c.short_name
  }
  return { city, state }
}

async function geocodeLocation({ zipCode, city, state }) {
  if (!GOOGLE_KEY) return null
  const hasZip = Boolean(zipCode?.trim())
  const hasCityState = Boolean(city?.trim() && state?.trim())
  if (!hasZip && !hasCityState) return null
  const query = [city?.trim(), state?.trim(), zipCode?.trim()].filter(Boolean).join(', ')
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: { address: query, key: GOOGLE_KEY },
  })
  if (data.status !== 'OK' || !data.results?.[0]) return null
  const loc = data.results[0].geometry.location
  const parsed = parseAddressComponents(data.results[0].address_components)
  return { lat: loc.lat, lng: loc.lng, city: parsed.city, state: parsed.state }
}

function distanceMilesNumber(lat1, lon1, lat2, lon2) {
  const R = 3959
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function distanceMiles(lat1, lon1, lat2, lon2) {
  return distanceMilesNumber(lat1, lon1, lat2, lon2).toFixed(1)
}

async function nearbySearch(lat, lng, radiusMeters, type, keyword = null) {
  const params = {
    location: `${lat},${lng}`,
    radius: Math.min(radiusMeters, MAX_RADIUS_METERS),
    type: type === 'cemetery' ? 'cemetery' : 'funeral_home',
    key: GOOGLE_KEY,
  }
  if (keyword) params.keyword = keyword
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', { params })
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') return []
  return data.results || []
}

async function placeDetails(placeId) {
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
    params: {
      place_id: placeId,
      fields: 'name,formatted_address,formatted_phone_number,website,rating,address_components',
      key: GOOGLE_KEY,
    },
  })
  if (data.status !== 'OK' || !data.result) return null
  const r = data.result
  const { city, state } = parseAddressComponents(r.address_components)
  return {
    name: r.name,
    address: r.formatted_address || '',
    city,
    state,
    phone: r.formatted_phone_number || null,
    website: r.website || null,
    googleReview: r.rating != null ? Number(r.rating) : null,
  }
}

async function textSearch(query, lat, lng) {
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
    params: {
      query: `${query} ${lat},${lng}`,
      key: GOOGLE_KEY,
    },
  })
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') return []
  return data.results || []
}

/** POST /api/search - body: { serviceType, zipCode?, city?, state?, radiusMiles }. Uses Google Places only; returns [] if no key or error. */
router.post('/search', async (req, res) => {
  try {
    const { serviceType, zipCode, city, state, radiusMiles } = req.body || {}
    const hasZip = Boolean(String(zipCode || '').trim())
    const hasCityState = Boolean(String(city || '').trim() && String(state || '').trim())
    if (!serviceType || (!hasZip && !hasCityState) || radiusMiles == null) {
      return res.status(400).json({ error: 'Missing serviceType, radiusMiles, and location (zipCode or city+state)' })
    }
    if (!GOOGLE_KEY) {
      return res.json([])
    }

    const radiusM = Math.min(radiusMiles * MILES_TO_METERS, MAX_RADIUS_METERS)
    const geo = await geocodeLocation({
      zipCode: String(zipCode || '').trim(),
      city: String(city || '').trim(),
      state: String(state || '').trim(),
    })
    if (!geo) {
      return res.json([])
    }

    let type = 'funeral_home'
    let keyword = null
    if (serviceType === 'cemetery') type = 'cemetery'
    else if (serviceType === 'cremation') keyword = 'cremation'

    const places = []
    if (serviceType === 'cemetery') {
      const seenIds = new Set()
      const manualPlaces = []

      const cemeteryMatches = await nearbySearch(geo.lat, geo.lng, radiusM, 'cemetery')
      for (let i = 0; i < Math.min(8, cemeteryMatches.length); i++) {
        const p = cemeteryMatches[i]
        if (seenIds.has(p.place_id)) continue
        seenIds.add(p.place_id)
        const detail = await placeDetails(p.place_id)
        if (!detail) continue
        places.push({
          id: `${serviceType}-${zipCode || `${city}-${state}`}-cemetery-${places.length}`,
          ...detail,
          distance: `${distanceMiles(geo.lat, geo.lng, p.geometry.location.lat, p.geometry.location.lng)} mi`,
          businessType: 'Cemetery',
        })
      }

      for (const item of BURIAL_AT_SEA_QUERIES) {
        const matches = await textSearch(item.query, geo.lat, geo.lng)
        for (let i = 0; i < Math.min(4, matches.length); i++) {
          const p = matches[i]
          if (seenIds.has(p.place_id)) continue
          seenIds.add(p.place_id)
          const detail = await placeDetails(p.place_id)
          if (!detail) continue
          const seaDistMiles = distanceMilesNumber(geo.lat, geo.lng, p.geometry.location.lat, p.geometry.location.lng)
          if (seaDistMiles > BURIALS_SEA_MAX_MILES) continue
          places.push({
            id: `${serviceType}-${zipCode || `${city}-${state}`}-sea-${places.length}`,
            ...detail,
            distance: `${seaDistMiles.toFixed(1)} mi`,
            businessType: item.businessType,
          })
        }
      }

      for (let i = 0; i < MANUAL_BURIAL_BUSINESSES.length; i++) {
        const business = MANUAL_BURIAL_BUSINESSES[i]
        const dist = distanceMilesNumber(geo.lat, geo.lng, business.lat, business.lng)
        if (dist > Number(radiusMiles) || dist > BURIALS_SEA_MAX_MILES) continue
        manualPlaces.push({
          id: `${serviceType}-manual-${i}`,
          name: business.name,
          address: business.address,
          city: business.city,
          state: business.state,
          phone: business.phone,
          website: business.website,
          googleReview: business.googleReview,
          businessType: business.businessType,
          servicesDescription: business.servicesDescription,
          distance: `${dist.toFixed(1)} mi`,
        })
      }
      places.unshift(...manualPlaces)
    } else {
      const results = await nearbySearch(geo.lat, geo.lng, radiusM, type, keyword)
      const maxResults = Math.min(10, results.length)
      for (let i = 0; i < maxResults; i++) {
        const detail = await placeDetails(results[i].place_id)
        if (!detail) continue
        const dist = distanceMiles(geo.lat, geo.lng, results[i].geometry.location.lat, results[i].geometry.location.lng)
        places.push({
          id: `${serviceType}-${zipCode || `${city}-${state}`}-${i}`,
          ...detail,
          distance: `${dist} mi`,
        })
      }
    }
    res.json(places)
  } catch (err) {
    console.error('Search error:', err.response?.status, err.response?.data?.status, err.response?.data?.error_message || err.message)
    res.json([])
  }
})

/** POST /api/spreading - body: { zipCode?, city?, state? }. Uses Google Places text search for ash scattering / burials at sea; returns [] if no key or no results. */
router.post('/spreading', async (req, res) => {
  try {
    const zipCode = (req.body?.zipCode || '').trim()
    const city = (req.body?.city || '').trim()
    const state = (req.body?.state || '').trim()
    if (!GOOGLE_KEY) return res.json([])

    const geo = await geocodeLocation({ zipCode, city, state })
    if (!geo) return res.json([])

    const seenIds = new Set()
    const places = []

    for (const item of BURIAL_AT_SEA_QUERIES) {
      const matches = await textSearch(item.query, geo.lat, geo.lng)
      for (let i = 0; i < Math.min(4, matches.length); i++) {
        const p = matches[i]
        if (seenIds.has(p.place_id)) continue
        seenIds.add(p.place_id)
        const detail = await placeDetails(p.place_id)
        if (!detail) continue
        const dist = distanceMiles(geo.lat, geo.lng, p.geometry.location.lat, p.geometry.location.lng)
        places.push({
          id: `spreading-${zipCode || `${city}-${state}`}-${places.length}`,
          ...detail,
          distance: `${dist} mi`,
          businessType: item.businessType,
        })
      }
    }

    const manualPlaces = []
    for (let i = 0; i < MANUAL_BURIAL_BUSINESSES.length; i++) {
      const business = MANUAL_BURIAL_BUSINESSES[i]
      const dist = distanceMilesNumber(geo.lat, geo.lng, business.lat, business.lng)
      if (dist > 500) continue
      manualPlaces.push({
        id: `spreading-manual-${i}`,
        name: business.name,
        address: business.address,
        city: business.city,
        state: business.state,
        phone: business.phone,
        website: business.website,
        googleReview: business.googleReview,
        businessType: business.businessType,
        servicesDescription: business.servicesDescription,
        distance: `${dist.toFixed(1)} mi`,
      })
    }
    res.json([...manualPlaces, ...places].slice(0, 15))
  } catch (err) {
    console.error('Spreading error:', err.response?.status, err.response?.data?.status, err.response?.data?.error_message || err.message)
    res.json([])
  }
})

export default router
