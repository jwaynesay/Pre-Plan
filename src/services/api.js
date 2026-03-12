/**
 * Base URL for API. In dev, Vite proxies /api to the backend; in production, same origin.
 */
const API_BASE = import.meta.env.VITE_API_URL || ''

export async function apiSearch(body) {
  const res = await fetch(`${API_BASE}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function apiSpreading(body) {
  const res = await fetch(`${API_BASE}/api/spreading`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Spreading search failed')
  return res.json()
}

export async function apiContact(body) {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Failed to send message')
  return data
}
