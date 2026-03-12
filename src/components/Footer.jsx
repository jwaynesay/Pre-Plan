import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-separator" aria-hidden="true" />
      <div className="footer-footnote">
        <p className="footer-copyright">
          Copyright © 2026 Celebration of Life, Inc. All rights reserved.{' '}
          <Link to="/legal" className="footer-legal-link">Legal Notice</Link>
        </p>
      </div>
    </footer>
  )
}
