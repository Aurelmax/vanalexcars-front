/**
 * Umami analytics utilities
 * Sends events via window.umami.track() — no-op if Umami is not loaded.
 */

export type ShareChannel =
  | 'native'
  | 'whatsapp'
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'email'
  | 'copy-link'
  | 'qr-code'
  | 'ask-opinion'

export interface ShareEventData {
  channel: ShareChannel
  vehicleId: string
  brand?: string
  model?: string
}

function umamiTrack(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  try {
    const umami = (window as Window & { umami?: { track: (e: string, d?: Record<string, unknown>) => void } }).umami
    if (typeof umami?.track === 'function') {
      umami.track(event, data)
    }
  } catch { /* silent — never block UX for analytics */ }
}

export function trackShare({ channel, vehicleId, brand, model }: ShareEventData) {
  umamiTrack('share-vehicle', {
    channel,
    vehicleId,
    vehicle: [brand, model].filter(Boolean).join(' ') || undefined,
  })
}

export function trackQrCodeOpen(vehicleId: string) {
  umamiTrack('qr-code-open', { vehicleId })
}

export function trackQrCodeDownload(vehicleId: string) {
  umamiTrack('qr-code-download', { vehicleId })
}

export function trackLinkCopied(vehicleId: string) {
  umamiTrack('link-copied', { vehicleId })
}
