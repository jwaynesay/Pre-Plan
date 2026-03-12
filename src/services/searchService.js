/**
 * Search for mortuary, cremation, or cemetery services. Uses backend API when available; falls back to local mock.
 */
import { apiSearch, apiSpreading } from './api.js'
import { MOCK_BUSINESSES, SPREADING_AND_SEA } from './mockData.js'

function mockSearchServices({ serviceType, zipCode, radiusMiles }) {
  const list = MOCK_BUSINESSES[serviceType] || []
  const maxResults = Math.min(5, Math.max(3, Math.floor(radiusMiles / 15)))
  const withIds = list.slice(0, maxResults).map((b, i) => ({
    id: `${serviceType}-${zipCode}-${i}`,
    ...b,
  }))
  return [...withIds.filter((b) => b.featured), ...withIds.filter((b) => !b.featured)]
}

function mockSpreading(zipCode) {
  const withIds = SPREADING_AND_SEA.map((b, i) => ({
    id: `spreading-${zipCode}-${i}`,
    ...b,
  }))
  return [...withIds.filter((b) => b.featured), ...withIds.filter((b) => !b.featured)]
}

export async function searchServices(params) {
  try {
    const list = await apiSearch(params)
    return Array.isArray(list) ? list : mockSearchServices(params)
  } catch (_) {
    return mockSearchServices(params)
  }
}

export async function getSpreadingOfAshesAndBurialsAtSea(zipCode) {
  try {
    const list = await apiSpreading({ zipCode: zipCode.trim() })
    return Array.isArray(list) ? list : mockSpreading(zipCode)
  } catch (_) {
    return mockSpreading(zipCode)
  }
}
