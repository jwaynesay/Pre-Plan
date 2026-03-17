/**
 * Search uses the backend API only (Google Places). No mock fallback.
 */
import { apiSearch, apiSpreading } from './api.js'

export async function searchServices(params) {
  const list = await apiSearch(params)
  return Array.isArray(list) ? list : []
}

export async function getSpreadingOfAshesAndBurialsAtSea(zipCode) {
  const list = await apiSpreading({ zipCode: (zipCode || '').trim() })
  return Array.isArray(list) ? list : []
}
