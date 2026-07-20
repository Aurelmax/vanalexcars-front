import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import {
  trackShare,
  trackQrCodeOpen,
  trackQrCodeDownload,
  trackLinkCopied,
} from '../../lib/umami'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VehicleShareProps {
  vehicleId: string
  brand: string
  model: string
  version?: string
  price?: number
  mainImage?: string
  canonicalUrl: string
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(msg)
    timerRef.current = setTimeout(() => setToast(null), 2500)
  }, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return { toast, showToast }
}

// ─── QR Code modal ────────────────────────────────────────────────────────────

interface QrModalProps {
  url: string
  vehicleId: string
  vehicleLabel: string
  onClose: () => void
  onLinkCopied: () => void
}

function QrModal({ url, vehicleId, vehicleLabel, onClose, onLinkCopied }: QrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)

  // Generate QR code lazily when modal opens
  useEffect(() => {
    let cancelled = false
    import('qrcode').then((QRCode) => {
      if (cancelled || !canvasRef.current) return
      QRCode.toCanvas(canvasRef.current, url, {
        width: 240,
        margin: 2,
        color: { dark: '#ffffff', light: '#1f2937' },
      })
        .then(() => { if (!cancelled) setReady(true) })
        .catch(() => { if (!cancelled) setError(true) })
    })
    return () => { cancelled = true }
  }, [url])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `vanalexcars-${vehicleId}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
    trackQrCodeDownload(vehicleId)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    onLinkCopied()
  }

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition text-2xl leading-none"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-5 leading-snug">
          Scannez ce code pour ouvrir la fiche<br />
          <span className="text-gray-300 font-medium">{vehicleLabel}</span>
        </p>

        {/* Canvas */}
        <div className="flex justify-center mb-2">
          <div className="relative rounded-xl overflow-hidden bg-gray-800 p-1">
            <canvas
              ref={canvasRef}
              className={`block transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
            />
            {!ready && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-premium-gold border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error && (
              <div className="w-60 h-60 flex items-center justify-center text-gray-500 text-sm text-center p-4">
                Génération impossible<br />
                <span className="text-xs mt-1 text-gray-600">Copiez le lien manuellement</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mb-5 truncate px-2">{url}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium py-2.5 rounded-xl border border-gray-700 transition"
          >
            <span>🔗</span> Copier le lien
          </button>
          <button
            onClick={handleDownload}
            disabled={!ready}
            className="flex-1 flex items-center justify-center gap-2 bg-premium-gold/10 hover:bg-premium-gold/20 text-premium-gold text-sm font-medium py-2.5 rounded-xl border border-premium-gold/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>⬇</span> Télécharger
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Share button ─────────────────────────────────────────────────────────────

// ─── SVG icons ───────────────────────────────────────────────────────────────

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  )
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

// ─── Share button ─────────────────────────────────────────────────────────────

interface ShareBtnProps {
  icon: ReactNode
  label: string
  onClick: () => void
  className?: string
  'aria-label'?: string
}

function ShareBtn({ icon, label, onClick, className = '', 'aria-label': ariaLabel }: ShareBtnProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={`flex flex-col items-center gap-1.5 group transition-all focus:outline-none ${className}`}
    >
      <span className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-800 border border-gray-700 group-hover:border-premium-gold/60 group-hover:bg-gray-700 transition text-xl shadow-sm">
        {icon}
      </span>
      <span className="text-xs text-gray-500 group-hover:text-gray-300 transition leading-tight text-center max-w-14">
        {label}
      </span>
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VehicleShareButtons({
  vehicleId,
  brand,
  model,
  version,
  price,
  canonicalUrl,
}: VehicleShareProps) {
  const [qrOpen, setQrOpen] = useState(false)
  const [hasNativeShare, setHasNativeShare] = useState(false)
  const { toast, showToast } = useToast()

  useEffect(() => {
    setHasNativeShare(typeof navigator?.share === 'function')
  }, [])

  const vehicleLabel = [brand, model, version].filter(Boolean).join(' ')
  const priceStr = price ? `${price.toLocaleString('fr-FR')} €` : ''
  const shareTitle = priceStr ? `${vehicleLabel} – ${priceStr}` : vehicleLabel
  const shareText = `Découvre cette ${brand} sélectionnée en Allemagne par VanalexCars.`

  // WhatsApp message
  const whatsappText = encodeURIComponent(
    `Je regarde cette ${vehicleLabel}${priceStr ? ` à ${priceStr}` : ''} chez VanalexCars.\n\nTu peux me dire ce que tu en penses ?\n${canonicalUrl}`
  )
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`

  // Ask-opinion message (more conversational)
  const opinionText = encodeURIComponent(
    `Salut, je suis sur une ${vehicleLabel}${priceStr ? ` à ${priceStr}` : ''} en Allemagne.\nJ'ai besoin d'un avis ! 😊\n${canonicalUrl}`
  )
  const opinionWhatsapp = `https://wa.me/?text=${opinionText}`

  // Native share
  const handleNativeShare = useCallback(async () => {
    trackShare({ channel: 'native', vehicleId, brand, model })
    try {
      await navigator.share({ title: shareTitle, text: shareText, url: canonicalUrl })
    } catch { /* user cancelled or unsupported */ }
  }, [vehicleId, brand, model, shareTitle, shareText, canonicalUrl])

  // Copy link
  const handleCopyLink = useCallback(async () => {
    trackShare({ channel: 'copy-link', vehicleId, brand, model })
    try {
      await navigator.clipboard.writeText(canonicalUrl)
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = canonicalUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    trackLinkCopied(vehicleId)
    showToast('Lien copié !')
  }, [vehicleId, brand, model, canonicalUrl, showToast])

  // Ask opinion
  const handleAskOpinion = useCallback(() => {
    trackShare({ channel: 'ask-opinion', vehicleId, brand, model })
    if (hasNativeShare) {
      navigator.share({
        title: `Mon avis sur cette ${vehicleLabel} ?`,
        text: `Je regarde cette ${vehicleLabel}${priceStr ? ` à ${priceStr}` : ''} en Allemagne. Ton avis ?`,
        url: canonicalUrl,
      }).catch(() => {
        // fallback WhatsApp
        window.open(opinionWhatsapp, '_blank', 'noopener,noreferrer')
      })
    } else {
      window.open(opinionWhatsapp, '_blank', 'noopener,noreferrer')
    }
  }, [hasNativeShare, vehicleId, brand, model, vehicleLabel, priceStr, canonicalUrl, opinionWhatsapp])

  const openQr = useCallback(() => {
    trackShare({ channel: 'qr-code', vehicleId, brand, model })
    trackQrCodeOpen(vehicleId)
    setQrOpen(true)
  }, [vehicleId, brand, model])

  const handleSocialClick = useCallback((channel: Parameters<typeof trackShare>[0]['channel'], url: string) => {
    trackShare({ channel, vehicleId, brand, model })
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500')
  }, [vehicleId, brand, model])

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(canonicalUrl)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`
  const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${canonicalUrl}`)}`

  return (
    <>
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Partager ce véhicule
        </h3>

        {/* Mobile-priority row: native > WhatsApp > copy link */}
        {hasNativeShare && (
          <div className="mb-4 md:hidden">
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 bg-premium-gold text-premium-black font-semibold py-3 rounded-xl text-sm transition hover:bg-premium-gold/90 active:scale-[0.98]"
            >
              <span className="text-lg">⬆</span> Partager
            </button>
          </div>
        )}

        {/* All share buttons grid */}
        <div className="flex flex-wrap gap-3 justify-start">
          {/* Native — desktop only (on mobile it's the full-width button above) */}
          {hasNativeShare && (
            <div className="hidden md:block">
              <ShareBtn
                icon="⬆"
                label="Partager"
                onClick={handleNativeShare}
                aria-label="Partage natif"
              />
            </div>
          )}

          {/* WhatsApp */}
          <ShareBtn
            icon="💬"
            label="WhatsApp"
            onClick={() => {
              trackShare({ channel: 'whatsapp', vehicleId, brand, model })
              window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
            }}
            aria-label="Partager sur WhatsApp"
          />

          {/* Ask opinion */}
          <ShareBtn
            icon="🤔"
            label="Demander un avis"
            onClick={handleAskOpinion}
            aria-label="Demander l'avis d'un proche"
          />

          {/* Copy link */}
          <ShareBtn
            icon="🔗"
            label="Copier le lien"
            onClick={handleCopyLink}
            aria-label="Copier le lien"
          />

          {/* QR Code */}
          <ShareBtn
            icon="▦"
            label="QR Code"
            onClick={openQr}
            aria-label="Afficher le QR Code"
          />

          {/* Facebook */}
          <ShareBtn
            icon={<IconFacebook />}
            label="Facebook"
            onClick={() => handleSocialClick('facebook', facebookUrl)}
            aria-label="Partager sur Facebook"
          />

          {/* X / Twitter */}
          <ShareBtn
            icon={<IconX />}
            label="X"
            onClick={() => handleSocialClick('twitter', twitterUrl)}
            aria-label="Partager sur X"
          />

          {/* LinkedIn */}
          <ShareBtn
            icon={<IconLinkedIn />}
            label="LinkedIn"
            onClick={() => handleSocialClick('linkedin', linkedinUrl)}
            aria-label="Partager sur LinkedIn"
          />

          {/* Email */}
          <ShareBtn
            icon="✉"
            label="E-mail"
            onClick={() => {
              trackShare({ channel: 'email', vehicleId, brand, model })
              window.location.href = emailUrl
            }}
            aria-label="Partager par e-mail"
          />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm font-medium px-5 py-3 rounded-full shadow-xl border border-gray-700 pointer-events-none animate-fade-in"
        >
          {toast}
        </div>
      )}

      {/* QR Code modal */}
      {qrOpen && (
        <QrModal
          url={canonicalUrl}
          vehicleId={vehicleId}
          vehicleLabel={vehicleLabel}
          onClose={() => setQrOpen(false)}
          onLinkCopied={() => {
            showToast('Lien copié !')
            trackLinkCopied(vehicleId)
          }}
        />
      )}
    </>
  )
}
