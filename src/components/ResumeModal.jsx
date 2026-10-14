import { useEffect, useState } from 'react';
import { getLenis } from './Nav';

export default function ResumeModal({ isOpen, onClose }) {
  const [zoom, setZoom] = useState(1);

  // Keyboard navigation & lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    // Pause smooth scrolling and prevent background scroll
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.0));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.75));
  const handleZoomReset = () => setZoom(1);

  return (
    <div
      className="resume-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Haresh LS Resume"
    >
      <div
        className="resume-modal-shell"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <header className="resume-modal-header">
          <div className="resume-header-left">
            <div className="resume-icon-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <div className="resume-header-title">
                <span>Haresh LS — Resume</span>
                <span className="resume-badge-tag">AI Full-Stack</span>
              </div>
              <p className="resume-header-sub">
                Kongu Engineering College (B.Tech CSE) • 1-Page Official ATS PDF
              </p>
            </div>
          </div>

          <div className="resume-header-actions">
            {/* Zoom Controls (desktop) */}
            <div className="resume-zoom-controls">
              <button
                type="button"
                className="resume-zoom-btn"
                onClick={handleZoomOut}
                title="Zoom Out"
                disabled={zoom <= 0.75}
              >
                −
              </button>
              <button
                type="button"
                className="resume-zoom-btn resume-zoom-reset"
                onClick={handleZoomReset}
                title="Reset Zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                className="resume-zoom-btn"
                onClick={handleZoomIn}
                title="Zoom In"
                disabled={zoom >= 2.0}
              >
                +
              </button>
            </div>

            {/* Open in New Tab Button */}
            <a
              href="/Haresh_LS_Resume.pdf"
              target="_blank"
              rel="noreferrer noopener"
              className="resume-btn-secondary"
              title="Open raw PDF in new browser tab"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Open Tab</span>
            </a>

            {/* Direct Download PDF Button */}
            <a
              href="/Haresh_LS_Resume.pdf"
              download="Haresh_LS_Resume.pdf"
              className="resume-btn-primary"
              title="Download Haresh LS Resume PDF"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download PDF</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              className="resume-btn-close"
              onClick={onClose}
              aria-label="Close resume preview"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Modal Scroll Body */}
        <div className="resume-modal-viewport">
          <div
            className="resume-sheet-container"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            <div className="resume-paper-sheet">
              <img
                src="/resume-preview.png"
                alt="Haresh LS Resume - AI Full-Stack Engineer"
                className="resume-preview-img"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <footer className="resume-modal-footer">
          <div className="resume-footer-info">
            <span className="resume-footer-dot" />
            <span>Ready for AI & Full-Stack Engineering roles • Available immediately</span>
          </div>

          <a
            href="/Haresh_LS_Resume.pdf"
            download="Haresh_LS_Resume.pdf"
            className="resume-footer-download-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download Official PDF (171 KB)</span>
          </a>
        </footer>
      </div>
    </div>
  );
}
