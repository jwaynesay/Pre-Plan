import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiContact } from '../services/api'

const CONTACT_EMAIL = 'jwaynesay@gmail.com'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus(null)
    setSending(true)
    try {
      await apiContact({ name: name.trim(), email: email.trim(), message: message.trim() })
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again or email us directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <header className="header">
        <Link to="/" className="logo-link">
          <h1 className="logo">Pre-Plan</h1>
        </Link>
        <p className="tagline">Thoughtful final arrangements for those you love</p>
      </header>
      <main className="main contact-main">
        <section className="card contact-card">
          <h2 className="contact-title">Contact Us</h2>
          <p className="contact-intro">
            Celebration of life, Inc. is here to help. Send a message below or email us directly.
          </p>

          {status === 'sent' && (
            <p className="contact-success">Thank you. Your message has been sent and we’ll get back to you soon.</p>
          )}
          {error && <p className="contact-error">{error}</p>}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                disabled={sending}
              />
            </div>
            <div className="form-row">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                disabled={sending}
              />
            </div>
            <div className="form-row">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Your message..."
                disabled={sending}
              />
            </div>
            <button type="submit" className="search-btn contact-submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send message'}
            </button>
          </form>

          <p className="contact-email-line">
            Or email us directly: <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email-link">{CONTACT_EMAIL}</a>
          </p>

          <p className="contact-back">
            <Link to="/" className="contact-back-link">← Back to search</Link>
          </p>
        </section>
      </main>
    </>
  )
}
