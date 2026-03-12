import { Router } from 'express'
import nodemailer from 'nodemailer'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const router = Router()

const CONTACT_TO = process.env.CONTACT_TO_EMAIL || 'jwaynesay@gmail.com'
const SUBMISSIONS_FILE = join(__dirname, '..', 'contact-submissions.json')

function getTransport() {
  const host = process.env.CONTACT_SMTP_HOST
  const user = process.env.CONTACT_SMTP_USER
  const pass = process.env.CONTACT_SMTP_PASS
  if (!host || !user || !pass) return null
  return nodemailer.createTransport({
    host,
    port: Number(process.env.CONTACT_SMTP_PORT) || 587,
    secure: process.env.CONTACT_SMTP_SECURE === 'true',
    auth: { user, pass },
  })
}

async function saveSubmission(payload) {
  try {
    let list = []
    try {
      const data = await readFile(SUBMISSIONS_FILE, 'utf8')
      list = JSON.parse(data)
    } catch (_) {}
    list.push({ ...payload, at: new Date().toISOString() })
    await mkdir(dirname(SUBMISSIONS_FILE), { recursive: true })
    await writeFile(SUBMISSIONS_FILE, JSON.stringify(list, null, 2))
  } catch (e) {
    console.error('Could not save contact submission:', e.message)
  }
}

/** POST /api/contact - body: { name, email, message } */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {}
    const n = (name || '').trim()
    const e = (email || '').trim()
    const m = (message || '').trim()
    if (!n || !e || !m) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }
    if (e.length < 5 || !e.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    const payload = { name: n, email: e, message: m }
    await saveSubmission(payload)

    const transport = getTransport()
    if (transport) {
      await transport.sendMail({
        from: process.env.CONTACT_FROM_EMAIL || 'Pre-Plan <noreply@preplan.example.com>',
        to: CONTACT_TO,
        replyTo: e,
        subject: `Pre-Plan contact from ${n}`,
        text: `Name: ${n}\nEmail: ${e}\n\nMessage:\n${m}`,
        html: `<p><strong>Name:</strong> ${n}</p><p><strong>Email:</strong> ${e}</p><p><strong>Message:</strong></p><p>${m.replace(/\n/g, '<br>')}</p>`,
      })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Contact error:', err.message)
    res.status(500).json({ error: 'Failed to send message. Please try again or email us directly.' })
  }
})

export default router
