// ─── Year / registration normalization ───────────────────────────────────────

export interface ParsedRegistration {
  year: number
  month?: number // 1-12
  displayDate: string // "juillet 2025" or "2025"
  confidence: 'source' | 'estimated'
}

export function parseRegistration(rawYear: number | null | undefined): ParsedRegistration | null {
  if (!rawYear) return null
  if (rawYear >= 1900 && rawYear <= 2100) {
    return { year: rawYear, displayDate: String(rawYear), confidence: 'source' }
  }
  // MMYYYY packed format (e.g., 72025 = 07/2025, 112023 = 11/2023)
  const s = String(rawYear)
  if (s.length === 5 || s.length === 6) {
    const monthLen = s.length === 5 ? 1 : 2
    const month = parseInt(s.slice(0, monthLen), 10)
    const year = parseInt(s.slice(monthLen), 10)
    if (month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
      const MONTHS_FR = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
      ]
      return { year, month, displayDate: `${MONTHS_FR[month - 1]} ${year}`, confidence: 'source' }
    }
  }
  return null
}

// ─── Power normalization ──────────────────────────────────────────────────────

export interface ParsedPower {
  kw?: number
  hp?: number
  display: string
  confidence: 'source' | 'estimated'
}

export function parsePower(raw: string | null | undefined): ParsedPower | null {
  if (!raw) return null
  const s = raw.trim()

  // Pattern: "170 kW (231 PS)" or "170 kW (231 ch)"
  const kwPsMatch = s.match(/(\d+)\s*kW[^(]*\((\d+)\s*(?:PS|ch|hp)\)/i)
  if (kwPsMatch) {
    const kw = parseInt(kwPsMatch[1])
    const hp = parseInt(kwPsMatch[2])
    return { kw, hp, display: `${kw} kW / ${hp} ch`, confidence: 'source' }
  }

  // Pattern: "231 PS" or "231 ch" or "231 CV"
  const hpMatch = s.match(/(\d+)\s*(?:PS|ch|hp|CV)/i)
  if (hpMatch) {
    const hp = parseInt(hpMatch[1])
    const kw = Math.round(hp / 1.36)
    return { kw, hp, display: `${kw} kW / ${hp} ch`, confidence: 'source' }
  }

  // Pattern: "170 kW"
  const kwMatch = s.match(/(\d+)\s*kW/i)
  if (kwMatch) {
    const kw = parseInt(kwMatch[1])
    const hp = Math.round(kw * 1.36)
    return { kw, hp, display: `${kw} kW / ${hp} ch`, confidence: 'estimated' }
  }

  return { display: s, confidence: 'source' }
}

// ─── Equipment filter ─────────────────────────────────────────────────────────

const EQUIPMENT_PARASITES = new Set([
  'deutschland', 'nederland', 'france', 'česky', 'polski', 'svenska', 'magyar',
  'italia', 'belgique', 'belgium', 'belgië', 'luxembourg', 'english', 'română',
  'türkçe', 'català', 'eesti', 'österreich', 'españa', 'suomi', 'norsk', 'dansk',
  'български', 'hrvatski', 'русский', 'українська', 'slovenščina', 'slovenčina',
  'português', 'ελληνικά', 'lietuvių', 'latviešu', 'de', 'nl', 'fr', 'en', 'es', 'it',
  'pl', 'cs', 'hu', 'ro', 'sk', 'sl', 'hr', 'bg', 'ru', 'uk', 'fi', 'no', 'da', 'sv', 'et',
  'nur mini', 'only mini', 'mini smile', 'mini original',
])

export function filterEquipment(items: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const item of items) {
    const trimmed = item.trim()
    if (!trimmed || trimmed.length < 3) continue
    const lower = trimmed.toLowerCase()
    if (EQUIPMENT_PARASITES.has(lower)) continue
    // Skip compound strings where all tokens are parasites (e.g. "Belgique/belgique")
    if (/[/|,]/.test(lower)) {
      const tokens = lower.split(/[/|,]/).map(t => t.trim()).filter(Boolean)
      if (tokens.length > 0 && tokens.every(t => EQUIPMENT_PARASITES.has(t) || /^[a-z]{2,3}$/.test(t))) continue
    }
    // Skip pure country codes (2-3 letters all caps)
    if (/^[A-Z]{2,3}$/.test(trimmed)) continue
    // Skip if it's just a number
    if (/^\d+$/.test(trimmed)) continue
    const key = lower.replace(/\s+/g, ' ')
    if (seen.has(key)) continue
    seen.add(key)
    result.push(trimmed)
  }
  return result
}

// ─── Color normalization ──────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  'schwarz': 'Noir',
  'weiß': 'Blanc',
  'weiss': 'Blanc',
  'silber': 'Argent',
  'grau': 'Gris',
  'blau': 'Bleu',
  'rot': 'Rouge',
  'grün': 'Vert',
  'braun': 'Marron',
  'gelb': 'Jaune',
  'orange': 'Orange',
  'beige': 'Beige',
  'gold': 'Doré',
  'violett': 'Violet',
  'pink': 'Rose',
  'lila': 'Lilas',
  'anthrazit': 'Anthracite',
  'champagner': 'Champagne',
  'bronze': 'Bronze',
  'burgund': 'Bordeaux',
  'kupfer': 'Cuivre',
  'mint': 'Menthe',
  'midnight black': 'Noir Midnight',
  'chili red': 'Rouge Chili',
  'pepper white': 'Blanc Pepper',
  'island blue': 'Bleu Island',
}

export function normalizeColor(raw: string | null | undefined): string | null {
  if (!raw) return null
  const lower = raw.toLowerCase().trim()
  for (const [de, fr] of Object.entries(COLOR_MAP)) {
    if (lower.includes(de)) return fr
  }
  // Capitalize first letter
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
}

// ─── Body type normalization ──────────────────────────────────────────────────

const BODY_TYPE_LABELS: Record<string, string> = {
  sedan: 'Berline',
  wagon: 'Break',
  suv: 'SUV',
  coupe: 'Coupé',
  convertible: 'Cabriolet',
  van: 'Monospace',
  sportback: 'Sportback',
  touring: 'Touring',
  other: '—',
  // Also accept old values
  berline: 'Berline',
  break: 'Break',
  cabriolet: 'Cabriolet',
  monospace: 'Monospace',
}

export function normalizeBodyType(raw: string | null | undefined): string {
  if (!raw) return '—'
  return BODY_TYPE_LABELS[raw.toLowerCase()] || raw
}

// ─── Crit'Air ─────────────────────────────────────────────────────────────────

export type CritAirLevel = 0 | 1 | 2 | 3 | 4 | 5 | 'NC'

export interface CritAirResult {
  level: CritAirLevel
  label: string
  textColor: string
  bgColor: string
  euroNorm: string
  confidence: 'confirmed' | 'estimated' | 'missing'
  zfeMessage: string
}

export function calculateCritAir(params: {
  fuel: string
  year: number
  co2?: number
}): CritAirResult {
  const { fuel, year } = params

  const confirmed = (
    level: CritAirLevel,
    label: string,
    text: string,
    bg: string,
    euro: string,
    zfe: string,
  ): CritAirResult => ({
    level,
    label,
    textColor: text,
    bgColor: bg,
    euroNorm: euro,
    confidence: 'confirmed',
    zfeMessage: zfe,
  })

  const estimated = (
    level: CritAirLevel,
    label: string,
    text: string,
    bg: string,
    euro: string,
    zfe: string,
  ): CritAirResult => ({
    level,
    label,
    textColor: text,
    bgColor: bg,
    euroNorm: euro,
    confidence: 'estimated',
    zfeMessage: zfe,
  })

  if (fuel === 'electric') {
    return confirmed(
      0,
      "Crit'Air 0",
      '#ffffff',
      '#2e7d32',
      'Zéro émission',
      'Autorisé dans toutes les ZFE — vignette verte',
    )
  }
  if (fuel === 'plugin-hybrid') {
    return estimated(
      1,
      "Crit'Air 1",
      '#ffffff',
      '#6a1b9a',
      'Euro 6 (PHEV)',
      'Autorisé dans la plupart des ZFE',
    )
  }

  // Petrol (essence) and mild hybrid
  if (fuel === 'essence' || fuel === 'hybrid') {
    if (year >= 2011)
      return estimated(
        1,
        "Crit'Air 1",
        '#ffffff',
        '#6a1b9a',
        'Euro 5/6',
        'Autorisé dans la plupart des ZFE',
      )
    if (year >= 2006)
      return estimated(
        2,
        "Crit'Air 2",
        '#1a1a1a',
        '#f9ca24',
        'Euro 4',
        'Restrictions lors des pics de pollution',
      )
    if (year >= 2001)
      return estimated(
        3,
        "Crit'Air 3",
        '#1a1a1a',
        '#f0932b',
        'Euro 3',
        'Restrictions en ZFE de niveau 3',
      )
    if (year >= 1997)
      return estimated(
        4,
        "Crit'Air 4",
        '#ffffff',
        '#e55039',
        'Euro 2',
        'Interdiction dans la plupart des ZFE',
      )
    return estimated(
      5,
      "Crit'Air 5",
      '#ffffff',
      '#922b21',
      'Euro 1 ou moins',
      'Interdit dans toutes les ZFE',
    )
  }

  // Diesel
  if (fuel === 'diesel') {
    if (year >= 2011)
      return estimated(
        2,
        "Crit'Air 2",
        '#1a1a1a',
        '#f9ca24',
        'Euro 5/6',
        'Autorisé en ZFE de niveau ≥2',
      )
    if (year >= 2006)
      return estimated(
        3,
        "Crit'Air 3",
        '#1a1a1a',
        '#f0932b',
        'Euro 4',
        'Restrictions en ZFE de niveau 3',
      )
    if (year >= 2001)
      return estimated(
        4,
        "Crit'Air 4",
        '#ffffff',
        '#e55039',
        'Euro 3',
        'Interdiction dans la plupart des ZFE',
      )
    return estimated(
      5,
      "Crit'Air 5",
      '#ffffff',
      '#922b21',
      'Euro 2 ou moins',
      'Interdit dans toutes les ZFE',
    )
  }

  return {
    level: 'NC',
    label: 'Non classé',
    textColor: '#ffffff',
    bgColor: '#546e7a',
    euroNorm: '—',
    confidence: 'missing',
    zfeMessage: 'Classification indisponible',
  }
}

// ─── Malus écologique 2025 ────────────────────────────────────────────────────

// Barème 2025 essence (source: legifrance.gouv.fr)
const MALUS_BAREME_2025 = [
  [0, 117, 0],
  [118, 118, 50],
  [119, 119, 75],
  [120, 120, 100],
  [121, 122, 125],
  [123, 123, 150],
  [124, 125, 170],
  [126, 127, 200],
  [128, 129, 230],
  [130, 132, 240],
  [133, 135, 280],
  [136, 137, 310],
  [138, 140, 330],
  [141, 143, 400],
  [144, 146, 460],
  [147, 149, 520],
  [150, 152, 570],
  [153, 155, 650],
  [156, 158, 740],
  [159, 161, 840],
  [162, 164, 950],
  [165, 167, 1050],
  [168, 170, 1200],
  [171, 173, 1350],
  [174, 176, 1500],
  [177, 179, 1700],
  [180, 182, 1900],
  [183, 185, 2100],
  [186, 188, 2400],
  [189, 191, 2700],
] as const

export interface MalusResult {
  amount: number
  confidence: 'confirmed' | 'estimated' | 'missing'
  co2Used?: number
  note: string
}

export function calculateMalus(co2Gkm?: number | null, fuel?: string): MalusResult {
  if (!co2Gkm || co2Gkm <= 0) {
    return {
      amount: 0,
      confidence: 'missing',
      note: 'Malus à calculer après réception du COC (CO₂ WLTP requis)',
    }
  }

  // Electric: no malus
  if (fuel === 'electric')
    return { amount: 0, confidence: 'confirmed', co2Used: 0, note: 'Exempté (véhicule électrique)' }

  const co2 = Math.round(co2Gkm)

  // Find in barème
  for (const [min, max, amount] of MALUS_BAREME_2025) {
    if (co2 >= min && co2 <= max) {
      return {
        amount,
        confidence: 'confirmed',
        co2Used: co2,
        note: `Barème 2025 — ${co2} g/km CO₂ WLTP`,
      }
    }
  }

  // Above 191 g/km: 50€/g above 191 + 40,000€ base
  if (co2 > 191) {
    const amount = Math.min(40000 + (co2 - 191) * 50, 60000)
    return {
      amount,
      confidence: 'confirmed',
      co2Used: co2,
      note: `Barème 2025 — ${co2} g/km CO₂ (tranche haute)`,
    }
  }

  return {
    amount: 0,
    confidence: 'confirmed',
    co2Used: co2,
    note: `Barème 2025 — ${co2} g/km CO₂`,
  }
}

// ─── Carte grise estimation ───────────────────────────────────────────────────

export const REGION_CG_RATES: Record<string, { label: string; rate: number; depts: string[] }> = {
  IDF: {
    label: 'Île-de-France',
    rate: 46.15,
    depts: ['75', '77', '78', '91', '92', '93', '94', '95'],
  },
  ARA: {
    label: 'Auvergne-Rhône-Alpes',
    rate: 43.0,
    depts: ['01', '03', '07', '15', '26', '38', '42', '43', '63', '69', '73', '74'],
  },
  BFC: {
    label: 'Bourgogne-Franche-Comté',
    rate: 56.0,
    depts: ['21', '25', '39', '58', '70', '71', '89', '90'],
  },
  BRE: { label: 'Bretagne', rate: 55.0, depts: ['22', '29', '35', '56'] },
  CVL: {
    label: 'Centre-Val de Loire',
    rate: 49.8,
    depts: ['18', '28', '36', '37', '41', '45'],
  },
  COR: { label: 'Corse', rate: 41.0, depts: ['20', '2A', '2B'] },
  GE: {
    label: 'Grand Est',
    rate: 48.0,
    depts: ['08', '10', '51', '52', '54', '55', '57', '67', '68', '88'],
  },
  HDF: {
    label: 'Hauts-de-France',
    rate: 33.0,
    depts: ['02', '59', '60', '62', '80'],
  },
  NOR: {
    label: 'Normandie',
    rate: 35.0,
    depts: ['14', '27', '50', '61', '76'],
  },
  NAQ: {
    label: 'Nouvelle-Aquitaine',
    rate: 41.0,
    depts: ['16', '17', '19', '23', '24', '33', '40', '47', '64', '79', '86', '87'],
  },
  OCC: {
    label: 'Occitanie',
    rate: 44.0,
    depts: ['09', '11', '12', '30', '31', '32', '34', '46', '48', '65', '66', '81', '82'],
  },
  PDL: {
    label: 'Pays de la Loire',
    rate: 51.0,
    depts: ['44', '49', '53', '72', '85'],
  },
  PACA: {
    label: "Provence-Alpes-Côte d'Azur",
    rate: 51.2,
    depts: ['04', '05', '06', '13', '83', '84'],
  },
}

export function getRegionFromDept(dept: string): { label: string; rate: number } | null {
  const padded = dept.padStart(2, '0')
  for (const region of Object.values(REGION_CG_RATES)) {
    if (region.depts.includes(padded)) return { label: region.label, rate: region.rate }
  }
  return null
}

export function estimateCvFiscaux(powerKw: number, fuel: string): number {
  if (fuel === 'electric') return 1
  if (fuel === 'diesel') return Math.max(1, Math.ceil(powerKw / 16))
  return Math.max(1, Math.ceil(powerKw / 13)) // petrol, hybrid
}

export interface CarteGriseEstimate {
  cvFiscaux: number
  regionalRate: number
  regionLabel: string
  amount: number
  confidence: 'estimated' | 'missing'
}

export function estimateCarteGrise(
  dept: string | null,
  powerKw: number | null,
  fuel: string,
): CarteGriseEstimate | null {
  if (!dept || !powerKw) return null
  const region = getRegionFromDept(dept)
  if (!region) return null
  const cv = estimateCvFiscaux(powerKw, fuel)
  // Formula: CV × (regional_rate + 2.76) + fixed_national_fee
  const amount = Math.round(cv * (region.rate + 2.76) + 68)
  return {
    cvFiscaux: cv,
    regionalRate: region.rate,
    regionLabel: region.label,
    amount,
    confidence: 'estimated',
  }
}

// ─── Transport zones ──────────────────────────────────────────────────────────

export type TransportMode = 'carrier' | 'selfDrive' | 'selfPickup'

export interface TransportZone {
  label: string
  depts: string[]
  carrierCostMin: number
  carrierCostMax: number
  carrierDelay: string
  selfDriveCost: number
  selfDriveDelay: string
}

export const TRANSPORT_ZONES: TransportZone[] = [
  {
    label: 'Est — Alsace, Lorraine, Bourgogne',
    depts: ['54', '55', '57', '67', '68', '88', '90', '21', '25', '39', '70', '71'],
    carrierCostMin: 550,
    carrierCostMax: 750,
    carrierDelay: '3–5 jours ouvrés',
    selfDriveCost: 300,
    selfDriveDelay: '2–3 jours',
  },
  {
    label: 'Nord — Hauts-de-France, Normandie',
    depts: ['02', '59', '60', '62', '80', '14', '27', '50', '61', '76'],
    carrierCostMin: 750,
    carrierCostMax: 950,
    carrierDelay: '4–6 jours ouvrés',
    selfDriveCost: 400,
    selfDriveDelay: '2–4 jours',
  },
  {
    label: 'Île-de-France & Centre',
    depts: ['75', '77', '78', '91', '92', '93', '94', '95', '18', '28', '36', '37', '41', '45'],
    carrierCostMin: 700,
    carrierCostMax: 900,
    carrierDelay: '4–6 jours ouvrés',
    selfDriveCost: 400,
    selfDriveDelay: '2–3 jours',
  },
  {
    label: 'Grand Est — Lorraine, Champagne',
    depts: ['08', '10', '51', '52', '58', '89'],
    carrierCostMin: 650,
    carrierCostMax: 850,
    carrierDelay: '3–5 jours ouvrés',
    selfDriveCost: 350,
    selfDriveDelay: '2–3 jours',
  },
  {
    label: 'Bretagne & Pays de la Loire',
    depts: ['22', '29', '35', '56', '44', '49', '53', '72', '85'],
    carrierCostMin: 900,
    carrierCostMax: 1200,
    carrierDelay: '5–8 jours ouvrés',
    selfDriveCost: 500,
    selfDriveDelay: '3–5 jours',
  },
  {
    label: 'Nouvelle-Aquitaine',
    depts: ['16', '17', '19', '23', '24', '33', '40', '47', '64', '79', '86', '87'],
    carrierCostMin: 850,
    carrierCostMax: 1100,
    carrierDelay: '5–7 jours ouvrés',
    selfDriveCost: 450,
    selfDriveDelay: '3–4 jours',
  },
  {
    label: 'Occitanie & PACA',
    depts: [
      '04', '05', '06', '09', '11', '12', '13', '30', '31', '32', '34',
      '46', '48', '65', '66', '81', '82', '83', '84',
    ],
    carrierCostMin: 900,
    carrierCostMax: 1200,
    carrierDelay: '5–8 jours ouvrés',
    selfDriveCost: 500,
    selfDriveDelay: '3–5 jours',
  },
  {
    label: 'Auvergne-Rhône-Alpes',
    depts: ['01', '03', '07', '15', '26', '38', '42', '43', '63', '69', '73', '74'],
    carrierCostMin: 750,
    carrierCostMax: 1000,
    carrierDelay: '4–6 jours ouvrés',
    selfDriveCost: 400,
    selfDriveDelay: '2–4 jours',
  },
  {
    label: 'Corse',
    depts: ['2A', '2B', '20'],
    carrierCostMin: 1400,
    carrierCostMax: 1800,
    carrierDelay: '8–14 jours ouvrés',
    selfDriveCost: 0,
    selfDriveDelay: 'Non disponible (traversée maritime)',
  },
]

export function getTransportZoneFromDept(dept: string): TransportZone | null {
  const padded = dept.padStart(2, '0')
  return TRANSPORT_ZONES.find((z) => z.depts.includes(padded)) ?? null
}

export function getTransportCost(zone: TransportZone | null, mode: TransportMode): number {
  if (!zone) return 0
  if (mode === 'selfPickup') return 0
  if (mode === 'selfDrive') return zone.selfDriveCost
  return Math.round((zone.carrierCostMin + zone.carrierCostMax) / 2)
}

// ─── Default simulator parameters ────────────────────────────────────────────

export interface SimulatorParams {
  honoraires: number
  fraisDossier: number
  cpiWw: number
  plaquesExport: number
  coc: number
  formalitesAdmin: number
  margeSecurity: number
}

export const DEFAULT_SIMULATOR_PARAMS: SimulatorParams = {
  honoraires: 1490,
  fraisDossier: 0,
  cpiWw: 150,
  plaquesExport: 200,
  coc: 150,
  formalitesAdmin: 200,
  margeSecurity: 300,
}

// ─── Full import cost breakdown ───────────────────────────────────────────────

export interface CostLine {
  label: string
  amount: number | null
  note?: string
  status: 'confirmed' | 'estimated' | 'missing' | 'to_verify'
  included: boolean
  isReference?: boolean  // Display-only reference line (not part of any total)
}

export interface ImportBreakdown {
  lines: CostLine[]
  totalLivre: number
  totalImmatricule: number | null
  hasMissingData: boolean
}

export function calculateImportBreakdown(opts: {
  vehiclePrice: number
  params: SimulatorParams
  transportCost: number
  malusAmount: number
  malusConfidence: string
  carteGriseAmount: number | null
  carteGriseConfidence: string
  remise?: number
}): ImportBreakdown {
  const {
    vehiclePrice,
    params,
    transportCost,
    malusAmount,
    malusConfidence,
    carteGriseAmount,
    remise = 0,
  } = opts

  const prixAchat = vehiclePrice - remise

  const lines: CostLine[] = [
    // Reference lines — display only, not counted in any total
    {
      label: 'Prix concession allemande',
      amount: vehiclePrice,
      status: 'confirmed',
      included: false,
      isReference: true,
    },
    ...(remise > 0
      ? [
          {
            label: 'Remise négociée estimée',
            amount: remise,
            note: 'Variable selon négociation',
            status: 'estimated' as const,
            included: false,
            isReference: true,
          },
        ]
      : []),
    // Single vehicle cost line included in total
    {
      label: remise > 0 ? "Prix d'achat après remise" : "Prix du véhicule",
      amount: prixAchat,
      status: remise > 0 ? 'estimated' : 'confirmed',
      included: true,
    },
    {
      label: "Plaques d'exportation",
      amount: params.plaquesExport,
      note: 'Plaques temporaires allemandes',
      status: 'estimated',
      included: true,
    },
    {
      label: 'Transport vers la France',
      amount: transportCost > 0 ? transportCost : null,
      note:
        transportCost > 0 ? 'Transporteur automobile' : 'Sélectionnez votre département',
      status: transportCost > 0 ? 'estimated' : 'missing',
      included: true,
    },
    {
      label: "CPI WW — Contrôle à l'importation",
      amount: params.cpiWw,
      note: "Contrôle technique d'importation",
      status: 'estimated',
      included: true,
    },
    {
      label: 'Certificat de conformité (COC)',
      amount: params.coc,
      note: 'Demande auprès du constructeur',
      status: 'estimated',
      included: true,
    },
    {
      label: 'Formalités administratives',
      amount: params.formalitesAdmin,
      note: 'Quitus fiscal, douanes, dédouanement',
      status: 'estimated',
      included: true,
    },
    {
      label: 'Honoraires Vanalexcars',
      amount: params.honoraires,
      note: 'Recherche, négociation, suivi complet',
      status: 'confirmed',
      included: true,
    },
    {
      label: 'Carte grise française',
      amount: carteGriseAmount,
      note: carteGriseAmount
        ? opts.carteGriseConfidence === 'estimated'
          ? 'Estimation — vérifier sur ants.fr'
          : ''
        : 'Sélectionnez votre département',
      status: carteGriseAmount ? 'estimated' : 'missing',
      included: false, // not included in "budget livré" — separate from import
    },
    {
      label: 'Malus écologique',
      amount: malusAmount > 0 ? malusAmount : null,
      note:
        malusConfidence === 'missing'
          ? 'CO₂ WLTP requis — données disponibles après réception du COC'
          : malusAmount === 0
            ? 'Exempté'
            : 'Barème 2025',
      status:
        malusConfidence === 'confirmed'
          ? 'confirmed'
          : malusConfidence === 'missing'
            ? 'missing'
            : 'estimated',
      included: false, // payable directement à l'administration
    },
  ]

  const totalLivre = lines
    .filter((l) => l.included && l.amount !== null)
    .reduce((s, l) => s + (l.amount ?? 0), 0)

  const missingForImmat = lines.filter((l) => !l.included && l.amount === null)
  const totalImmatricule =
    missingForImmat.length === 0
      ? totalLivre +
        (lines.find((l) => l.label === 'Carte grise française')?.amount ?? 0) +
        (lines.find((l) => l.label === 'Malus écologique')?.amount ?? 0)
      : null

  const hasMissingData = lines.some((l) => l.status === 'missing')

  return { lines, totalLivre, totalImmatricule, hasMissingData }
}
