/**
 * Search uses the backend API only (Google Places). No mock fallback.
 */
import { apiSearch, apiSpreading } from './api.js'

export async function searchServices(params) {
  const list = await apiSearch(params)
  return Array.isArray(list) ? list : []
}

export async function getSpreadingOfAshesAndBurialsAtSea(location) {
  const list = await apiSpreading({
    zipCode: (location?.zipCode || '').trim(),
    city: (location?.city || '').trim(),
    state: (location?.state || '').trim(),
  })
  return Array.isArray(list) ? list : []
}
