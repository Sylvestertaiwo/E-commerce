import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import './notFound.css'

const NotFound = () => {
  return (
    <>
      <Navbar/>
      <div className="nf-page">
        <div className="nf-content">
            <svg
              className="nf-illustration"
              viewBox="0 0 220 160"
              role="img"
              aria-label="A magnifying glass over a question mark, indicating the page could not be found"
            >
              <circle cx="95" cy="70" r="46" className="nf-line" />
              <line x1="129" y1="102" x2="162" y2="137" className="nf-line nf-line--thick" />
              <text x="95" y="86" textAnchor="middle" className="nf-mark">?</text>
              <circle cx="40" cy="30" r="2" className="nf-dot" />
              <circle cx="170" cy="40" r="1.6" className="nf-dot" />
              <circle cx="185" cy="100" r="2" className="nf-dot" />
              <circle cx="20" cy="110" r="1.6" className="nf-dot" />
              <circle r="4" className="marker">
                <animateMotion
                  dur="30s"
                  repeatCount="indefinite"
                  keyPoints="0; 0.12; 0.28; 0.45; 0.6; 0.75; 0.9; 1"
                  keyTimes="0; 0.12; 0.28; 0.45; 0.6; 0.75; 0.9; 1"
                  keySplines="0.45 0.05 0.55 0.95; 0.4 0.1 0.5 0.9; 0.5 0.1 0.4 0.9; 0.4 0.15 0.5 0.85; 0.5 0.1 0.45 0.9; 0.4 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"
                  calcMode="spline"
                  path="M60 38 Q100 8 150 30 Q188 48 178 75 Q195 95 165 108 Q140 145 100 132 Q55 150 32 112 Q5 85 25 55 Q35 25 60 38 Z"
                />
              </circle>
            </svg>

          <span className="nf-code">404</span>
          <h1 className="nf-title">Page not found</h1>
          <p className="nf-subtitle">
            The page you're looking for doesn't exist, may have moved, or the link might be broken.
          </p>

          <div className="nf-actions">
            <Link to="/" className="nf-btn">
              Back to home
            </Link>
            <Link to="/shop" className="nf-btn nf-btn--ghost">
              Browse products
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound;
