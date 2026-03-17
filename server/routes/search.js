import { Router } from 'express'
import axios from 'axios'

const router = Router()
const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY
const MILES_TO_METERS = 1609.34
const MAX_RADIUS_METERS = 50000

function parseAddressComponents(components) {
  let city = ''
  let state = ''
  for (const c of components || []) {
    if (c.types.includes('locality')) city = c.long_name
    if (c.types.includes('administrative_area_level_1')) state = c.short_name
  }
  return { city, state }
}

async function geocodeZip(zipCode) {
  if (!GOOGLE_KEY) return null
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: { address: zipCode, key: GOOGLE_KEY },
  })
  if (data.status !== 'OK' || !data.results?.[0]) return null
  const loc = data.results[0].geometry.location
  const { city, state } = parseAddressComponents(data.results[0].address_components)
  return { lat: loc.lat, lng: loc.lng, city, state }
}

function distanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3959
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(1)
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

/** POST /api/search - body: { serviceType, zipCode, radiusMiles }. Uses Google Places only; returns [] if no key or error. */
router.post('/search', async (req, res) => {
  try {
    const { serviceType, zipCode, radiusMiles } = req.body || {}
    if (!serviceType || !zipCode || radiusMiles == null) {
      return res.status(400).json({ error: 'Missing serviceType, zipCode, or radiusMiles' })
    }
    if (!GOOGLE_KEY) {
      return res.json([])
    }

    const radiusM = Math.min(radiusMiles * MILES_TO_METERS, MAX_RADIUS_METERS)
    const geo = await geocodeZip(String(zipCode).trim())
    if (!geo) {
      return res.json([])
    }

    let type = 'funeral_home'
    let keyword = null
    if (serviceType === 'cemetery') type = 'cemetery'
    else if (serviceType === 'cremation') keyword = 'cremation'

    const results = await nearbySearch(geo.lat, geo.lng, radiusM, type, keyword)
    const maxResults = Math.min(10, results.length)
    const places = []
    for (let i = 0; i < maxResults; i++) {
      const detail = await placeDetails(results[i].place_id)
      if (!detail) continue
      const dist = distanceMiles(geo.lat, geo.lng, results[i].geometry.location.lat, results[i].geometry.location.lng)
      places.push({
        id: `${serviceType}-${zipCode}-${i}`,
        ...detail,
        distance: `${dist} mi`,
      })
    }
    res.json(places)
  } catch (err) {
    console.error('Search error:', err.message)
    res.json([])
  }
})

/** POST /api/spreading - body: { zipCode }. Uses Google Places text search for ash scattering / burials at sea; returns [] if no key or no results. */
router.post('/spreading', async (req, res) => {
  try {
    const zipCode = (req.body?.zipCode || '').trim()
    if (!GOOGLE_KEY) return res.json([])

    const geo = await geocodeZip(zipCode || '90210')
    if (!geo) return res.json([])

    const queries = ['ash scattering memorial', 'burial at sea', 'cremation scattering']
    const seenIds = new Set()
    const places = []

    for (const query of queries) {
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: `${query} ${geo.lat},${geo.lng}`,
          key: GOOGLE_KEY,
        },
      })
      if (data.status !== 'OK' || !data.results?.length) continue
      for (let i = 0; i < Math.min(4, data.results.length); i++) {
        const p = data.results[i]
        if (seenIds.has(p.place_id)) continue
        seenIds.add(p.place_id)
        const detail = await placeDetails(p.place_id)
        if (!detail) continue
        const dist = distanceMiles(geo.lat, geo.lng, p.geometry.location.lat, p.geometry.location.lng)
        places.push({
          id: `spreading-${zipCode}-${places.length}`,
          ...detail,
          distance: `${dist} mi`,
          businessType: query.includes('sea') ? 'Burials at sea' : 'Spreading of ashes',
        })
      }
    }
    res.json(places.slice(0, 15))
  } catch (err) {
    console.error('Spreading error:', err.message)
    res.json([])
  }
})

export default router
