import React from 'react'

/**
 * Catches render errors so production builds show a message instead of a blank page.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Pre-Plan error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2rem',
            maxWidth: '36rem',
            margin: '2rem auto',
            fontFamily: 'system-ui, sans-serif',
            color: '#2d3632',
          }}
        >
          <h1 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Something went wrong</h1>
          <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: '#5c6b65' }}>
            The page failed to load. Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R). If assets fail to load,
            check that your host is serving the <code>dist</code> folder from <code>npm run build</code> and
            that the site base path matches your deployment (see README).
          </p>
          <pre
            style={{
              fontSize: '0.8rem',
              overflow: 'auto',
              padding: '0.75rem',
              background: '#f8f6f2',
              borderRadius: '8px',
              border: '1px solid #e8e4de',
            }}
          >
            {this.state.error?.message || String(this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
