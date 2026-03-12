import { Link } from 'react-router-dom'

export default function LegalNoticePage() {
  return (
    <>
      <header className="header">
        <Link to="/" className="logo-link">
          <h1 className="logo">Pre-Plan</h1>
        </Link>
        <p className="tagline">Thoughtful final arrangements for those you love</p>
      </header>
      <main className="main legal-main">
        <article className="card legal-card">
          <h2 className="legal-title">Legal Notice</h2>
          <p className="legal-updated">Last updated: 2026</p>

          <section className="legal-section">
            <h3>1. Ownership and Service</h3>
            <p>
              This website and the Pre-Plan service are operated by <strong>Celebration of Life, Inc.</strong> (“Company,” “we,” “us,” or “our”). 
              All content, features, and functionality are owned by Celebration of Life, Inc. and are protected by United States and international 
              copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="legal-section">
            <h3>2. Informational Purpose Only</h3>
            <p>
              Pre-Plan is provided for informational and planning purposes only. We do not provide legal, financial, medical, or professional 
              advice. Listing or display of businesses, services, or providers does not constitute an endorsement, recommendation, or guarantee 
              of any kind. Users are solely responsible for evaluating and selecting any service provider and for their own decisions and actions.
            </p>
          </section>

          <section className="legal-section">
            <h3>3. No Warranties</h3>
            <p>
              This website and all information, content, and materials are provided “as is” and “as available” without warranties of any kind, 
              either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, 
              or non-infringement. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components.
            </p>
          </section>

          <section className="legal-section">
            <h3>4. Limitation of Liability</h3>
            <p>
              To the fullest extent permitted by applicable law, Celebration of Life, Inc., its officers, directors, employees, and agents shall 
              not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill, 
              arising out of or in connection with your use of this website or any third-party services or businesses listed herein. Our total 
              liability shall not exceed the amount, if any, paid by you to us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section className="legal-section">
            <h3>5. Third-Party Services and Links</h3>
            <p>
              This website may contain links to or information about third-party websites and service providers. We are not responsible for the 
              content, privacy practices, or terms of any third-party sites or for any transactions or dealings between you and such third parties. 
              Your use of third-party services is at your own risk.
            </p>
          </section>

          <section className="legal-section">
            <h3>6. Intellectual Property</h3>
            <p>
              The names “Pre-Plan,” “Celebration of Life, Inc.,” and related logos and marks are the property of Celebration of Life, Inc. 
              You may not use, reproduce, or distribute any content from this website without our prior written permission, except for personal, 
              non-commercial use.
            </p>
          </section>

          <section className="legal-section">
            <h3>7. Modifications</h3>
            <p>
              We reserve the right to modify this Legal Notice, the website, and our services at any time. Continued use of the website after 
              changes constitutes acceptance of the revised terms. We encourage you to review this notice periodically.
            </p>
          </section>

          <section className="legal-section">
            <h3>8. Governing Law</h3>
            <p>
              This Legal Notice and any disputes arising from or relating to your use of this website shall be governed by and construed in 
              accordance with the laws of the United States and the State in which Celebration of Life, Inc. is incorporated, without regard 
              to conflict of law principles.
            </p>
          </section>

          <section className="legal-section">
            <h3>9. Contact</h3>
            <p>
              For questions regarding this Legal Notice or Celebration of Life, Inc., please contact us at{' '}
              <a href="mailto:jwaynesay@gmail.com" className="legal-email-link">jwaynesay@gmail.com</a> or through our{' '}
              <Link to="/contact" className="legal-inline-link">Contact</Link> page.
            </p>
          </section>

          <p className="legal-back">
            <Link to="/" className="legal-back-link">← Back to search</Link>
          </p>
        </article>
      </main>
    </>
  )
}
