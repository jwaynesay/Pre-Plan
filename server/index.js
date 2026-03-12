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

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

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
