import { Router } from 'express'
import axios from 'axios'
import { MOCK_BUSINESSES, SPREADING_AND_SEA } from '../mockData.js'

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

function mockSearch(serviceType, zipCode, radiusMiles) {
  const list = MOCK_BUSINESSES[serviceType] || []
  const maxResults = Math.min(8, Math.max(3, Math.floor(radiusMiles / 15)))
  const withIds = list.slice(0, maxResults).map((b, i) => ({
    id: `${serviceType}-${zipCode}-${i}`,
    ...b,
  }))
  return [...withIds.filter((b) => b.featured), ...withIds.filter((b) => !b.featured)]
}

/** POST /api/search - body: { serviceType, zipCode, radiusMiles } */
router.post('/search', async (req, res) => {
  try {
    const { serviceType, zipCode, radiusMiles } = req.body || {}
    if (!serviceType || !zipCode || radiusMiles == null) {
      return res.status(400).json({ error: 'Missing serviceType, zipCode, or radiusMiles' })
    }
    const radiusM = Math.min(radiusMiles * MILES_TO_METERS, MAX_RADIUS_METERS)

    if (!GOOGLE_KEY) {
      const list = mockSearch(serviceType, String(zipCode).trim(), Number(radiusMiles))
      return res.json(list)
    }

    const geo = await geocodeZip(String(zipCode).trim())
    if (!geo) {
      const list = mockSearch(serviceType, String(zipCode).trim(), Number(radiusMiles))
      return res.json(list)
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
    const { serviceType, zipCode, radiusMiles } = req.body || {}
    const list = mockSearch(serviceType || 'mortuary', String(zipCode || '').trim(), Number(radiusMiles || 20))
    res.json(list)
  }
})

/** POST /api/spreading - body: { zipCode } - spreading of ashes & burials at sea within ~500 mi (mock or Places) */
router.post('/spreading', async (req, res) => {
  try {
    const zipCode = req.body?.zipCode ? String(req.body.zipCode).trim() : ''
    const withIds = SPREADING_AND_SEA.map((b, i) => ({
      id: `spreading-${zipCode}-${i}`,
      ...b,
    }))
    const list = [...withIds.filter((b) => b.featured), ...withIds.filter((b) => !b.featured)]
    res.json(list)
  } catch (err) {
    console.error('Spreading error:', err.message)
    res.json(SPREADING_AND_SEA.map((b, i) => ({ id: `spreading-${i}`, ...b })))
  }
})

export default router
