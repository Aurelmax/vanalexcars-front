/**
 * Admin — Import AutoScout24
 * Full dark premium admin page. No Header/Footer.
 * Auth : cookie HttpOnly admin_session géré par middleware.ts + /api/auth/login
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// ─── Types ───────────────────────────────────────────────────────────────────

interface VehicleRow {
  id: string;
  title: string;
  brand: string;
  category: string;
  dealer: string;
  dealerCity: string;
  price: number;
  score: number;
  missingFields: string[];
  sourcePlatform: string;
  originalListingUrl?: string;
  sourceUrl?: string;
}

interface StatsResult {
  vehicles: VehicleRow[];
  stats: { total: number; avgScore: number; below80: number; below90: number };
}

type SSEEvent =
  | { type: 'log'; message: string }
  | { type: 'vehicle'; title: string; status: string; dealer?: string; city?: string; scoreBefore?: number; scoreAfter?: number; message?: string }
  | { type: 'done'; stats: { total: number; created?: number; updated?: number; enriched?: number; skipped?: number; errors: number } };

// ─── Brand / Category config ─────────────────────────────────────────────────

const BRANDS = [
  { label: 'BMW', slug: 'bmw' },
  { label: 'Mercedes', slug: 'mercedes-benz' },
  { label: 'Audi', slug: 'audi' },
  { label: 'Porsche', slug: 'porsche' },
  { label: 'Volkswagen', slug: 'volkswagen' },
  { label: 'Mini', slug: 'mini' },
  { label: 'Ford', slug: 'ford' },
  { label: 'Mazda', slug: 'mazda' },
  { label: 'Jaguar', slug: 'jaguar' },
  { label: 'MG', slug: 'mg' },
  { label: 'Aston Martin', slug: 'aston-martin' },
];

const CATEGORIES = [
  { label: 'Cabriolet', body: '2' },
  { label: 'SUV', body: '4' },
  { label: 'Berline', body: '1' },
  { label: 'Coupé', body: '9' },
  { label: 'Break', body: '3' },
];

const BASE_AS24 = 'https://www.autoscout24.de/lst';
const AS24_FILTERS = '?fregfrom=2024&cy=D&damaged_listing=exclude&ustate=N%2CU&atype=C';

function buildSearchUrl(brand: string, body: string): string {
  const base = brand ? `${BASE_AS24}/${brand}` : BASE_AS24;
  const bodyParam = body ? `&body=${body}` : '';
  return `${base}${AS24_FILTERS}${bodyParam}`;
}

// ─── Score badge ─────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-green-700 text-green-100' :
    score >= 50 ? 'bg-yellow-700 text-yellow-100' :
                  'bg-red-700 text-red-100';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${color}`}>
      {score}%
    </span>
  );
}

// ─── Timestamp helper ────────────────────────────────────────────────────────

function now(): string {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ─── SSE stream reader ───────────────────────────────────────────────────────

async function readSSEStream(
  url: string,
  method: 'POST' | 'GET',
  headers: Record<string, string>,
  body: object | null,
  onEvent: (event: SSEEvent) => void,
  onDone: () => void
) {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok || !response.body) {
    onEvent({ type: 'log', message: `Erreur HTTP ${response.status}: ${response.statusText}` });
    onDone();
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';

    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith('data: ')) continue;
      try {
        const event = JSON.parse(line.slice(6)) as SSEEvent;
        onEvent(event);
      } catch {
        // ignore malformed
      }
    }
  }

  onDone();
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ImportAS24Admin() {
  const router = useRouter();

  // Running state
  const [isRunning, setIsRunning] = useState(false);

  // Logs
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Vehicles table
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [tableStats, setTableStats] = useState<{ total: number; avgScore: number; below80: number; below90: number } | null>(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterScore, setFilterScore] = useState('');

  // Import config
  const [customUrl, setCustomUrl] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPages, setMaxPages] = useState(2);

  // Enrich config
  const [minScore, setMinScore] = useState(90);
  const [enrichLimit, setEnrichLimit] = useState(15);
  const [enrichBrand, setEnrichBrand] = useState('');

  // Drawer + individual enrich
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(null);
  const [enrichingId, setEnrichingId] = useState<string | null>(null);
  const [enrichRowMsg, setEnrichRowMsg] = useState<{ id: string; ok: boolean; msg: string } | null>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // ── Logout ───────────────────────────────────────────────────────────────
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  // ── Add log line ─────────────────────────────────────────────────────────
  const addLog = useCallback((line: string) => {
    setLogs(prev => [...prev, `[${now()}] ${line}`]);
  }, []);

  // ── Build import URL ─────────────────────────────────────────────────────
  function getImportUrl(): string {
    if (customUrl.trim()) return customUrl.trim();
    if (selectedBrand || selectedCategory) return buildSearchUrl(selectedBrand, selectedCategory);
    return '';
  }

  // ── Run import ───────────────────────────────────────────────────────────
  async function handleImport() {
    const searchUrl = getImportUrl();
    if (!searchUrl) {
      addLog('Erreur: sélectionnez une marque, catégorie ou entrez une URL.');
      return;
    }

    setIsRunning(true);
    addLog(`Démarrage import — URL: ${searchUrl} — Pages: ${maxPages}`);

    await readSSEStream(
      '/api/admin/import-as24',
      'POST',
      {},
      { searchUrl, maxPages },
      (event) => {
        if (event.type === 'log') {
          addLog(event.message);
        } else if (event.type === 'vehicle') {
          const statusIcon = event.status === 'created' ? '✅ Créé' : event.status === 'updated' ? '🔄 MàJ' : '❌ Erreur';
          addLog(`${statusIcon}: ${event.title}${event.dealer ? ` | ${event.dealer}` : ''}${event.city ? ` (${event.city})` : ''}${event.message ? ` — ${event.message}` : ''}`);
        } else if (event.type === 'done') {
          const s = event.stats;
          addLog(`Import terminé — Total: ${s.total} | Créés: ${s.created || 0} | MàJ: ${s.updated || 0} | Erreurs: ${s.errors}`);
        }
      },
      () => setIsRunning(false)
    );
  }

  // ── Run enrich ───────────────────────────────────────────────────────────
  async function handleEnrich() {
    setIsRunning(true);
    addLog(`Démarrage enrichissement — score < ${minScore}% | limite: ${enrichLimit}${enrichBrand ? ` | marque: ${enrichBrand}` : ''}`);

    // Proxy sécurisé : SCRAPER_SECRET ajouté côté serveur dans /api/admin/enrich-backend
    await readSSEStream(
      '/api/admin/enrich-backend',
      'POST',
      {},
      { minScore, limit: enrichLimit, brand: enrichBrand || undefined },
      (event) => {
        if (event.type === 'log') {
          addLog(event.message);
        } else if (event.type === 'vehicle') {
          if (event.status === 'enriched') {
            addLog(`✅ Enrichi: ${event.title} | ${event.scoreBefore}% → ${event.scoreAfter}%`);
          } else if (event.status === 'skipped') {
            addLog(`ℹ️ Ignoré: ${event.title} — rien à enrichir`);
          } else if (event.status === 'removed') {
            addLog(`🗑️ Inactivé: ${event.title}${event.message ? ` | ${event.message}` : ''}`);
          } else {
            addLog(`❌ Erreur: ${event.title}${event.message ? ` — ${event.message}` : ''}`);
          }
        } else if (event.type === 'done') {
          const s = event.stats;
          addLog(`Enrichissement terminé — Enrichis: ${s.enriched || 0} | Ignorés: ${s.skipped || 0} | Erreurs: ${s.errors}`);
        }
      },
      () => setIsRunning(false)
    );
  }

  // ── Enrich single vehicle ────────────────────────────────────────────────
  async function handleEnrichOne(vehicleId: string) {
    setEnrichingId(vehicleId);
    setEnrichRowMsg(null);
    try {
      // Proxy sécurisé : SCRAPER_SECRET ajouté côté serveur dans /api/admin/enrich-single
      const res = await fetch('/api/admin/enrich-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId }),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setEnrichRowMsg({ id: vehicleId, ok: true, msg: data.message || 'Enrichi ✓' });
        addLog(`✅ Enrichi: ${vehicles.find(v => v.id === vehicleId)?.title || vehicleId}`);
        setTimeout(() => { setEnrichRowMsg(null); loadStats(); }, 3000);
      } else {
        setEnrichRowMsg({ id: vehicleId, ok: false, msg: data.error || 'Erreur' });
        addLog(`❌ Erreur enrichissement: ${data.error || 'inconnue'}`);
        setTimeout(() => setEnrichRowMsg(null), 4000);
      }
    } catch (e: any) {
      setEnrichRowMsg({ id: vehicleId, ok: false, msg: e.message });
      addLog(`❌ Erreur réseau: ${e.message}`);
      setTimeout(() => setEnrichRowMsg(null), 4000);
    } finally {
      setEnrichingId(null);
    }
  }

  // ── Load stats ───────────────────────────────────────────────────────────
  async function loadStats() {
    setTableLoading(true);
    try {
      let url = `/api/admin/stats`;
      const params = new URLSearchParams();
      if (filterBrand) params.set('brand', filterBrand);
      if (filterCategory) params.set('category', filterCategory);
      if ([...params].length) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) {
        addLog(`Erreur stats: ${res.status}`);
        return;
      }
      const data: StatsResult = await res.json();
      setVehicles(data.vehicles);
      setTableStats(data.stats);
    } catch (e: any) {
      addLog(`Erreur réseau stats: ${e.message}`);
    } finally {
      setTableLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filtered vehicles ────────────────────────────────────────────────────
  const filteredVehicles = vehicles.filter(v => {
    if (filterBrand && v.brand !== filterBrand) return false;
    if (filterCategory && v.category !== filterCategory) return false;
    if (filterScore === 'below50' && v.score >= 50) return false;
    if (filterScore === 'below80' && v.score >= 80) return false;
    if (filterScore === 'below90' && v.score >= 90) return false;
    return true;
  });

  // ─── Main admin UI ────────────────────────────────────────────────────────
  // Auth garantie par middleware.ts — aucun écran de connexion ici

  return (
    <>
      <Head>
        <title>Admin Import AS24</title>
      </Head>
      <div className="min-h-screen bg-gray-950 text-white">

        {/* ── Header ── */}
        <header className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚗</span>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Import AutoScout24</h1>
              <p className="text-xs text-gray-400">Import &amp; enrichissement véhicules</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs bg-green-900 text-green-300 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
              Connecté
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-white transition px-3 py-1 rounded border border-gray-700 hover:border-gray-500"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">

          {/* ── Top row: Import + Enrich panels ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Import Panel */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-base font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <span>🚀</span> Import AutoScout24
              </h2>

              {/* Brand buttons */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Marque</p>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map(b => (
                    <button
                      key={b.slug}
                      onClick={() => {
                        setSelectedBrand(prev => prev === b.slug ? '' : b.slug);
                        setCustomUrl('');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition border ${
                        selectedBrand === b.slug
                          ? 'bg-yellow-500 text-black border-yellow-400'
                          : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-yellow-500 hover:text-yellow-400'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category buttons */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Catégorie</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.body}
                      onClick={() => {
                        setSelectedCategory(prev => prev === c.body ? '' : c.body);
                        setCustomUrl('');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition border ${
                        selectedCategory === c.body
                          ? 'bg-yellow-500 text-black border-yellow-400'
                          : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-yellow-500 hover:text-yellow-400'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom URL */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">URL personnalisée</p>
                <input
                  type="url"
                  value={customUrl}
                  onChange={e => {
                    setCustomUrl(e.target.value);
                    if (e.target.value) {
                      setSelectedBrand('');
                      setSelectedCategory('');
                    }
                  }}
                  placeholder="https://www.autoscout24.de/lst?..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition"
                />
              </div>

              {/* Preview URL */}
              {getImportUrl() && (
                <div className="mb-4 bg-gray-800 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-400 mb-1">URL d&apos;import :</p>
                  <p className="text-xs text-yellow-300 break-all">{getImportUrl()}</p>
                </div>
              )}

              {/* Max pages + Launch */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">Pages :</label>
                  <select
                    value={maxPages}
                    onChange={e => setMaxPages(Number(e.target.value))}
                    className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleImport}
                  disabled={isRunning || !getImportUrl()}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-2 px-4 rounded-lg transition text-sm"
                >
                  {isRunning ? '⏳ En cours…' : '🚀 Lancer l\'import'}
                </button>
              </div>
            </div>

            {/* Enrichment Panel */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-base font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <span>⚡</span> Enrichissement 2ème passe
              </h2>

              {/* Score slider */}
              <div className="mb-5">
                <div className="flex justify-between mb-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Enrichir les fiches sous</p>
                  <span className="text-sm font-bold text-yellow-400">{minScore}%</span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={100}
                  value={minScore}
                  onChange={e => setMinScore(Number(e.target.value))}
                  className="w-full accent-yellow-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>70%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Limit */}
              <div className="mb-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Nombre max de véhicules</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={5}
                    value={enrichLimit}
                    onChange={e => setEnrichLimit(Number(e.target.value))}
                    className="flex-1 accent-yellow-500"
                  />
                  <span className="text-sm font-bold text-white w-8 text-right">{enrichLimit}</span>
                </div>
              </div>

              {/* Brand filter */}
              <div className="mb-5">
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Filtre marque (optionnel)</label>
                <select
                  value={enrichBrand}
                  onChange={e => setEnrichBrand(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="">Toutes les marques</option>
                  {BRANDS.map(b => (
                    <option key={b.slug} value={b.slug.replace('mercedes-benz', 'mercedes')}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Summary */}
              <div className="bg-gray-800 rounded-lg px-3 py-2 mb-5 text-xs text-gray-400">
                Enrichira jusqu&apos;à <span className="text-white font-semibold">{enrichLimit}</span> véhicules avec un score{' '}
                <span className="text-white font-semibold">&lt; {minScore}%</span>
                {enrichBrand && <> de la marque <span className="text-yellow-400 font-semibold">{enrichBrand}</span></>}
                {' '}via Playwright (backend).
              </div>

              <button
                onClick={handleEnrich}
                disabled={isRunning}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition text-sm"
              >
                {isRunning ? '⏳ En cours…' : '⚡ Lancer l\'enrichissement'}
              </button>
            </div>
          </div>

          {/* ── Logs Terminal ── */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-400 ml-2 font-mono">Logs en temps réel</span>
              </div>
              <button
                onClick={() => setLogs([])}
                className="text-xs text-gray-500 hover:text-gray-300 transition px-2 py-1 rounded border border-gray-700 hover:border-gray-500"
              >
                Effacer
              </button>
            </div>
            <div className="h-56 overflow-y-auto bg-black p-4 font-mono text-xs">
              {logs.length === 0 ? (
                <p className="text-gray-600">En attente d&apos;activité…</p>
              ) : (
                logs.map((line, i) => {
                  const isError = line.includes('❌') || line.includes('Erreur');
                  const isSuccess = line.includes('✅') || line.includes('terminé');
                  const color = isError ? 'text-red-400' : isSuccess ? 'text-green-400' : 'text-green-300';
                  return (
                    <div key={i} className={`leading-5 ${color}`}>{line}</div>
                  );
                })
              )}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* ── Vehicle Table ── */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-white">Véhicules importés</h2>
                {tableStats && (
                  <div className="flex gap-3 text-xs">
                    <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">
                      Total: <span className="text-white font-semibold">{tableStats.total}</span>
                    </span>
                    <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">
                      Score moy: <span className="text-yellow-400 font-semibold">{tableStats.avgScore}%</span>
                    </span>
                    <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">
                      &lt;80%: <span className="text-red-400 font-semibold">{tableStats.below80}</span>
                    </span>
                    <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">
                      &lt;90%: <span className="text-yellow-400 font-semibold">{tableStats.below90}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Filters + Refresh */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterBrand}
                  onChange={e => setFilterBrand(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="">Toutes marques</option>
                  {[...new Set(vehicles.map(v => v.brand))].filter(Boolean).sort().map(b => (
                    <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>
                  ))}
                </select>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="">Toutes catégories</option>
                  {[...new Set(vehicles.map(v => v.category))].filter(Boolean).sort().map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
                <select
                  value={filterScore}
                  onChange={e => setFilterScore(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="">Tous scores</option>
                  <option value="below50">Score &lt; 50%</option>
                  <option value="below80">Score &lt; 80%</option>
                  <option value="below90">Score &lt; 90%</option>
                </select>
                <button
                  onClick={loadStats}
                  disabled={tableLoading}
                  className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
                >
                  {tableLoading ? '⏳' : '🔄'} Actualiser
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Score</th>
                    <th className="px-4 py-3 text-left">Titre</th>
                    <th className="px-4 py-3 text-left">Marque</th>
                    <th className="px-4 py-3 text-right">Prix</th>
                    <th className="px-4 py-3 text-left">Dealer</th>
                    <th className="px-4 py-3 text-left">Ville</th>
                    <th className="px-4 py-3 text-left">Champs manquants</th>
                    <th className="px-4 py-3 text-left">Source</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredVehicles.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        {tableLoading ? 'Chargement…' : 'Aucun véhicule. Cliquez sur Actualiser.'}
                      </td>
                    </tr>
                  ) : (
                    filteredVehicles.map(v => {
                      const isEnriching = enrichingId === v.id;
                      const rowMsg = enrichRowMsg?.id === v.id ? enrichRowMsg : null;
                      const listingUrl = v.originalListingUrl || v.sourceUrl || '';
                      const payloadUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200'}/admin/collections/vehicles/${v.id}`;
                      return (
                        <tr
                          key={v.id}
                          className={`hover:bg-gray-800/60 transition cursor-pointer ${isEnriching ? 'opacity-60' : ''}`}
                          onClick={() => setSelectedVehicle(v)}
                          title="Cliquer pour prévisualiser"
                        >
                          <td className="px-4 py-3">
                            <ScoreBadge score={v.score} />
                          </td>
                          <td className="px-4 py-3 text-white max-w-[220px] truncate" title={v.title}>
                            {v.title}
                          </td>
                          <td className="px-4 py-3 text-gray-300">
                            {v.brand.charAt(0).toUpperCase() + v.brand.slice(1)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-300 whitespace-nowrap">
                            {v.price > 0 ? `${v.price.toLocaleString('fr-FR')} €` : '—'}
                          </td>
                          <td className="px-4 py-3 text-gray-400 max-w-[150px] truncate" title={v.dealer}>
                            {v.dealer || '—'}
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {v.dealerCity || '—'}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px]">
                            {v.missingFields.length > 0 ? (
                              <span title={v.missingFields.join(', ')}>
                                {v.missingFields.slice(0, 3).join(', ')}
                                {v.missingFields.length > 3 && ` +${v.missingFields.length - 3}`}
                              </span>
                            ) : (
                              <span className="text-green-500">Complet</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {v.sourcePlatform ? (
                              <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">
                                {v.sourcePlatform.replace('autoscout24.de', 'AS24')}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1" onClick={e => e.stopPropagation()}>
                              {/* Payload */}
                              <button
                                onClick={() => window.open(payloadUrl, '_blank')}
                                title="Ouvrir dans Payload CMS"
                                className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-yellow-400 transition text-sm"
                              >
                                🔧
                              </button>
                              {/* AS24 */}
                              <button
                                onClick={() => listingUrl && window.open(listingUrl, '_blank')}
                                disabled={!listingUrl}
                                title={listingUrl ? 'Ouvrir l\'annonce AS24' : 'URL AS24 non disponible'}
                                className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition text-sm"
                              >
                                🔗
                              </button>
                              {/* Enrichir */}
                              <button
                                onClick={() => !isEnriching && handleEnrichOne(v.id)}
                                disabled={isEnriching}
                                title="Relancer l'enrichissement"
                                className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                              >
                                {isEnriching ? '⏳' : '▶'}
                              </button>
                              {/* Feedback message */}
                              {rowMsg && (
                                <span className={`text-xs ml-1 ${rowMsg.ok ? 'text-green-400' : 'text-red-400'}`}>
                                  {rowMsg.msg}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {filteredVehicles.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-800 text-xs text-gray-500">
                {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''} affiché{filteredVehicles.length > 1 ? 's' : ''}
                {filteredVehicles.length !== vehicles.length && ` (filtré depuis ${vehicles.length})`}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Drawer prévisualisation ── */}
      {selectedVehicle && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedVehicle(null)}
          />
          {/* Panel */}
          <aside className="fixed top-0 right-0 h-full w-[420px] max-w-full bg-gray-900 border-l border-gray-700 z-50 flex flex-col shadow-2xl">
            {/* Header drawer */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <h3 className="text-sm font-bold text-white truncate pr-4">{selectedVehicle.title}</h3>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-gray-400 hover:text-white transition text-lg leading-none shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Corps */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Score */}
              <div className="flex items-center gap-3">
                <ScoreBadge score={selectedVehicle.score} />
                <span className="text-xs text-gray-400">Score de complétude</span>
              </div>

              {/* Infos principales */}
              <div className="bg-gray-800 rounded-xl p-4 space-y-2 text-sm">
                <Row label="Marque" value={selectedVehicle.brand.charAt(0).toUpperCase() + selectedVehicle.brand.slice(1)} />
                <Row label="Catégorie" value={selectedVehicle.category} />
                <Row label="Prix" value={selectedVehicle.price > 0 ? `${selectedVehicle.price.toLocaleString('fr-FR')} €` : '—'} />
                <Row label="Dealer" value={selectedVehicle.dealer || '—'} />
                <Row label="Ville" value={selectedVehicle.dealerCity || '—'} />
                <Row label="Source" value={selectedVehicle.sourcePlatform?.replace('autoscout24.de', 'AS24') || '—'} />
              </div>

              {/* Champs manquants */}
              {selectedVehicle.missingFields.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Champs manquants</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedVehicle.missingFields.map(f => (
                      <span key={f} className="text-xs bg-red-900/60 text-red-300 px-2 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200'}/admin/collections/vehicles/${selectedVehicle.id}`, '_blank')}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold text-sm py-2.5 rounded-lg transition"
                >
                  🔧 Ouvrir dans Payload CMS
                </button>
                {(selectedVehicle.originalListingUrl || selectedVehicle.sourceUrl) && (
                  <button
                    onClick={() => window.open(selectedVehicle.originalListingUrl || selectedVehicle.sourceUrl, '_blank')}
                    className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-sm py-2.5 rounded-lg transition"
                  >
                    🔗 Voir l&apos;annonce AutoScout24
                  </button>
                )}
                <button
                  onClick={() => { setSelectedVehicle(null); handleEnrichOne(selectedVehicle.id); }}
                  disabled={enrichingId === selectedVehicle.id}
                  className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white font-semibold text-sm py-2.5 rounded-lg transition"
                >
                  {enrichingId === selectedVehicle.id ? '⏳ Enrichissement en cours…' : '▶ Relancer l\'enrichissement'}
                </button>
              </div>

              {/* Placeholder détails à venir */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-dashed border-gray-700 text-center text-xs text-gray-500">
                Prévisualisation complète — à venir
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

// Helper row pour le drawer
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="text-white text-right truncate">{value}</span>
    </div>
  );
}
