import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import searchRoutes from './routes/search.js'
import contactRoutes from './routes/contact.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

// Trust reverse-proxy headers (needed for correct req.secure / x-forwarded-proto).
// Safe because it only affects how we interpret TLS when behind a load balancer.
app.set('trust proxy', true)

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// In production, force HTTPS when the request arrived over HTTP (common when TLS is
// terminated by a proxy/load balancer and your app only sees forwarded headers).
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const proto = req.headers['x-forwarded-proto']
    if (proto === 'http') {
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`)
    }
    return next()
  })
}

app.use('/api', searchRoutes)
app.use('/api', contactRoutes)

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

if (process.env.NODE_ENV === 'production') {
  const dist = join(__dirname, '..', 'dist')
  app.use(express.static(dist))
  app.get('*', (req, res) => {
    res.sendFile(join(dist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Pre-Plan server running at http://localhost:${PORT}`)
})
