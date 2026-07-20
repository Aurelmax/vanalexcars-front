import React, { useState, useMemo } from 'react'
import {
  SimulatorParams,
  DEFAULT_SIMULATOR_PARAMS,
  calculateCritAir,
  calculateMalus,
  estimateCarteGrise,
  getTransportZoneFromDept,
  getTransportCost,
  calculateImportBreakdown,
  TransportMode,
  CostLine,
  CritAirResult,
} from '../../lib/importSimulator'

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CostLine['status'] }) {
  if (status === 'confirmed') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-400">
        <span>✓</span>
      </span>
    )
  }
  if (status === 'estimated') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
        <span>~</span>
      </span>
    )
  }
  if (status === 'missing') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
        <span>?</span>
      </span>
    )
  }
  if (status === 'to_verify') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-orange-400">
        <span>!</span>
      </span>
    )
  }
  return null
}

// ─── Crit'Air badge ────────────────────────────────────────────────────────────

function CritAirBadge({ result }: { result: CritAirResult }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-white/20 font-bold text-sm shrink-0 shadow-lg"
        style={{ backgroundColor: result.bgColor, color: result.textColor }}
      >
        <div className="text-center leading-tight">
          <div className="text-xs">Crit'Air</div>
          <div className="text-xl font-bold">{result.level}</div>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-semibold">{result.label}</span>
          {result.confidence === 'estimated' && (
            <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded-full">
              estimé
            </span>
          )}
        </div>
        <div className="text-sm text-gray-400 mb-1">Norme : {result.euroNorm}</div>
        <div className="text-sm text-gray-300">{result.zfeMessage}</div>
        <div className="text-xs text-gray-500 mt-1">
          Estimé sur base de l'année de 1ère mise en circulation
        </div>
      </div>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ImportSimulatorProps {
  vehiclePrice: number
  fuel: string
  year: number
  co2?: number | null
  powerKw?: number | null
  params?: SimulatorParams
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ImportSimulator({
  vehiclePrice,
  fuel,
  year,
  co2,
  powerKw,
  params = DEFAULT_SIMULATOR_PARAMS,
}: ImportSimulatorProps) {
  const [dept, setDept] = useState('')
  const [deptError, setDeptError] = useState('')
  const [transportMode, setTransportMode] = useState<TransportMode>('carrier')
  const [breakdownOpen, setBreakdownOpen] = useState(false)

  // Validate and normalize dept input
  const validDept = useMemo(() => {
    const trimmed = dept.trim().toUpperCase()
    if (!trimmed) return null
    // Accept 2A, 2B, 01-95
    if (/^(2[AB]|\d{1,2})$/.test(trimmed)) {
      const padded = trimmed.padStart(2, '0')
      // Check it's a real dept number (01-95) or 2A/2B
      if (padded === '2A' || padded === '2B') return padded
      const n = parseInt(padded)
      if (n >= 1 && n <= 95) return padded
    }
    return null
  }, [dept])

  // Crit'Air
  const critAir = useMemo(() => {
    return calculateCritAir({ fuel, year, co2: co2 ?? undefined })
  }, [fuel, year, co2])

  // Malus
  const malus = useMemo(() => {
    return calculateMalus(co2, fuel)
  }, [co2, fuel])

  // Carte grise
  const carteGrise = useMemo(() => {
    return estimateCarteGrise(validDept, powerKw ?? null, fuel)
  }, [validDept, powerKw, fuel])

  // Transport
  const transportZone = useMemo(() => {
    return validDept ? getTransportZoneFromDept(validDept) : null
  }, [validDept])

  const transportCost = useMemo(() => {
    return getTransportCost(transportZone, transportMode)
  }, [transportZone, transportMode])

  // Full breakdown
  const breakdown = useMemo(() => {
    return calculateImportBreakdown({
      vehiclePrice,
      params,
      transportCost,
      malusAmount: malus.amount,
      malusConfidence: malus.confidence,
      carteGriseAmount: carteGrise?.amount ?? null,
      carteGriseConfidence: carteGrise?.confidence ?? 'missing',
    })
  }, [vehiclePrice, params, transportCost, malus, carteGrise])

  const handleDeptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDept(val)
    if (val.trim() && !validDept && val.trim().length >= 2) {
      setDeptError('Département non reconnu (01–95, 2A, 2B)')
    } else {
      setDeptError('')
    }
  }

  const fmtEuro = (n: number | null) => {
    if (n === null) return '—'
    return n.toLocaleString('fr-FR') + ' €'
  }

  return (
    <div className="space-y-6">
      {/* ── Crit'Air card ──────────────────────────────────────────────────── */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Vignette Crit'Air & ZFE</h3>
        <CritAirBadge result={critAir} />
      </div>

      {/* ── Simulator inputs ────────────────────────────────────────────────── */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-1">Simulation import France</h3>
        <p className="text-sm text-gray-400 mb-6">
          Estimez le coût total d'importation depuis l'Allemagne jusqu'à votre domicile.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Department input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Département d'immatriculation
            </label>
            <input
              type="text"
              value={dept}
              onChange={handleDeptChange}
              placeholder="Ex: 69, 75, 2A…"
              maxLength={3}
              className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-premium-gold/50 transition ${
                deptError ? 'border-red-600' : 'border-gray-700'
              }`}
            />
            {deptError && <p className="text-xs text-red-400 mt-1">{deptError}</p>}
            {validDept && transportZone && (
              <p className="text-xs text-green-400 mt-1">
                Zone : {transportZone.label}
              </p>
            )}
            {validDept && carteGrise && (
              <p className="text-xs text-gray-400 mt-0.5">
                Région CG : {carteGrise.regionLabel} — {carteGrise.regionalRate} €/CV
              </p>
            )}
          </div>

          {/* Transport mode */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mode de livraison
            </label>
            <div className="space-y-2">
              {(
                [
                  ['carrier', 'Transporteur automobile', transportZone ? `${transportZone.carrierCostMin}–${transportZone.carrierCostMax} € · ${transportZone.carrierDelay}` : 'Prix selon département'],
                  ['selfDrive', 'Rapatriement route', transportZone ? `${transportZone.selfDriveCost} € · ${transportZone.selfDriveDelay}` : 'Prix selon département'],
                  ['selfPickup', 'Retrait client sur place', 'Gratuit — vous récupérez le véhicule en Allemagne'],
                ] as [TransportMode, string, string][]
              ).map(([mode, label, hint]) => (
                <label
                  key={mode}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    transportMode === mode
                      ? 'border-premium-gold/60 bg-premium-gold/5'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="transportMode"
                    value={mode}
                    checked={transportMode === mode}
                    onChange={() => setTransportMode(mode)}
                    className="mt-0.5 accent-premium-gold shrink-0"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">{label}</div>
                    <div className="text-xs text-gray-400">{hint}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Summary banner ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gray-800/60 rounded-xl border border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-premium-gold">
              {fmtEuro(vehiclePrice)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Prix Allemagne</div>
          </div>
          <div className="text-center border-x border-gray-700">
            <div className="text-2xl font-bold text-cyan-400">
              ~{fmtEuro(breakdown.totalLivre)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Budget livré estimé</div>
            {breakdown.hasMissingData && (
              <div className="text-xs text-yellow-500 mt-0.5">données manquantes</div>
            )}
          </div>
          <div className="text-center">
            {breakdown.totalImmatricule !== null ? (
              <>
                <div className="text-2xl font-bold text-green-400">
                  ~{fmtEuro(breakdown.totalImmatricule)}
                </div>
                <div className="text-xs text-gray-400 mt-1">Budget immatriculé</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-500">à estimer</div>
                <div className="text-xs text-gray-400 mt-1">Budget immatriculé</div>
                <div className="text-xs text-gray-600 mt-0.5">indiquez votre département</div>
              </>
            )}
          </div>
        </div>

        {/* ── Breakdown accordion ───────────────────────────────────────────── */}
        <div className="border border-gray-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setBreakdownOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 bg-gray-800/50 hover:bg-gray-800 transition text-left"
          >
            <span className="text-sm font-semibold text-white">
              Détail du budget d'importation
            </span>
            <span className="text-gray-400 text-lg leading-none">
              {breakdownOpen ? '▲' : '▼'}
            </span>
          </button>

          {breakdownOpen && (
            <div className="divide-y divide-gray-800">
              {/* Included lines */}
              <div className="px-5 py-3 bg-gray-900/30">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                  Inclus dans le budget livré
                </div>
              </div>
              {breakdown.lines
                .filter((l) => l.included)
                .map((line, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-800/30 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <StatusBadge status={line.status} />
                      <div>
                        <div className="text-sm text-gray-200">{line.label}</div>
                        {line.note && (
                          <div className="text-xs text-gray-500">{line.note}</div>
                        )}
                        {line.status === 'estimated' && (
                          <div className="text-xs text-yellow-600">à confirmer</div>
                        )}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-semibold shrink-0 ml-4 ${
                        line.amount === null
                          ? 'text-gray-500'
                          : line.amount < 0
                            ? 'text-green-400'
                            : 'text-white'
                      }`}
                    >
                      {line.amount === null
                        ? '—'
                        : line.amount < 0
                          ? `−${Math.abs(line.amount).toLocaleString('fr-FR')} €`
                          : `${line.amount.toLocaleString('fr-FR')} €`}
                    </div>
                  </div>
                ))}

              {/* Total livré */}
              <div className="flex items-center justify-between px-5 py-4 bg-cyan-900/20 border-t border-cyan-800/40">
                <div className="text-sm font-bold text-cyan-300">Total budget livré</div>
                <div className="text-lg font-bold text-cyan-400">
                  ~{breakdown.totalLivre.toLocaleString('fr-FR')} €
                </div>
              </div>

              {/* Not-included lines (CG + malus) */}
              <div className="px-5 py-3 bg-gray-900/30">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                  À payer séparément (administration française)
                </div>
              </div>
              {breakdown.lines
                .filter((l) => !l.included)
                .map((line, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-800/30 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <StatusBadge status={line.status} />
                      <div>
                        <div className="text-sm text-gray-200">{line.label}</div>
                        {line.note && (
                          <div className="text-xs text-gray-500">{line.note}</div>
                        )}
                        {line.status === 'estimated' && (
                          <div className="text-xs text-yellow-600">à confirmer</div>
                        )}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-semibold shrink-0 ml-4 ${
                        line.amount === null ? 'text-gray-500' : 'text-white'
                      }`}
                    >
                      {line.amount === null
                        ? '—'
                        : `${line.amount.toLocaleString('fr-FR')} €`}
                    </div>
                  </div>
                ))}

              {/* Total immatriculé */}
              {breakdown.totalImmatricule !== null && (
                <div className="flex items-center justify-between px-5 py-4 bg-green-900/20 border-t border-green-800/40">
                  <div className="text-sm font-bold text-green-300">
                    Total budget immatriculé
                  </div>
                  <div className="text-lg font-bold text-green-400">
                    ~{breakdown.totalImmatricule.toLocaleString('fr-FR')} €
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Legend ───────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="text-green-400 font-bold">✓</span> Confirmé
          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-400 font-bold">~</span> Estimé (à confirmer)
          </span>
          <span className="flex items-center gap-1">
            <span className="text-gray-500 font-bold">?</span> Données manquantes
          </span>
          <span className="flex items-center gap-1">
            <span className="text-orange-400 font-bold">!</span> À vérifier
          </span>
        </div>

        {/* ── Malus + CG details ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Malus écologique 2025</div>
            <div
              className={`text-xl font-bold ${
                malus.confidence === 'missing'
                  ? 'text-gray-500'
                  : malus.amount === 0
                    ? 'text-green-400'
                    : 'text-red-400'
              }`}
            >
              {malus.confidence === 'missing'
                ? '—'
                : malus.amount === 0
                  ? 'Exempté'
                  : `${malus.amount.toLocaleString('fr-FR')} €`}
            </div>
            <div className="text-xs text-gray-500 mt-1">{malus.note}</div>
          </div>

          <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Carte grise (estimation)</div>
            {carteGrise ? (
              <>
                <div className="text-xl font-bold text-white">
                  ~{carteGrise.amount.toLocaleString('fr-FR')} €
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {carteGrise.cvFiscaux} CV fiscaux · {carteGrise.regionLabel}
                </div>
                <div className="text-xs text-gray-600">Vérifier sur ants.fr</div>
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-gray-500">—</div>
                <div className="text-xs text-gray-500 mt-1">
                  Indiquez votre département
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Disclaimer ────────────────────────────────────────────────────── */}
        <p className="text-xs text-gray-600 mt-6 leading-relaxed">
          Estimation non contractuelle, confirmée après vérification du certificat de
          conformité, des émissions de CO₂ et du département d'immatriculation. Les
          montants indiqués sont des estimations basées sur les barèmes fiscaux 2025 en
          vigueur. Le malus écologique et la carte grise sont payables directement à
          l'administration française.
        </p>
      </div>
    </div>
  )
}
