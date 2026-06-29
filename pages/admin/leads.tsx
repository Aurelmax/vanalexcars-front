import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:                  { label: 'Nouvelle demande',            color: 'bg-blue-100 text-blue-700' },
  qualifying:           { label: 'En qualification',            color: 'bg-yellow-100 text-yellow-700' },
  contacted:            { label: 'Client contacté',             color: 'bg-orange-100 text-orange-700' },
  dealer_request_sent:  { label: 'Demande envoyée concess.',    color: 'bg-indigo-100 text-indigo-700' },
  dealer_offer_received:{ label: 'Offre concess. reçue',        color: 'bg-teal-100 text-teal-700' },
  mandate_pending:      { label: 'Mandat à créer',              color: 'bg-purple-100 text-purple-700' },
  mandate_created:      { label: 'Mandat créé',                 color: 'bg-green-100 text-green-700' },
  abandoned:            { label: 'Abandonné',                   color: 'bg-gray-100 text-gray-500' },
  refused:              { label: 'Refusé',                      color: 'bg-red-100 text-red-700' },
};

// Statuts à partir desquels la conversion en mandat est autorisée
const MANDATE_ELIGIBLE = ['dealer_offer_received', 'mandate_pending'];

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, { label }]) => ({ value, label }));

const BUDGET_LABELS: Record<string, string> = {
  '<30k':    '< 30 000 €',
  '30-50k':  '30–50 000 €',
  '50-80k':  '50–80 000 €',
  '80-120k': '80–120 000 €',
  '120-150k':'120–150 000 €',
};

const TIMELINE_LABELS: Record<string, string> = {
  immediate: 'Dès que possible',
  normale:   '1–2 mois',
  flexible:  'Flexible',
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABELS[status] || { label: status, color: 'bg-gray-100 text-gray-600' };
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>{s.label}</span>;
}

export default function AdminLeads() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [converting, setConverting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${BACKEND}/api/leads?limit=100&sort=-createdAt${statusFilter ? `&where[status][equals]=${statusFilter}` : ''}`;
      const res = await fetch(url);
      const json = await res.json();
      setLeads(json.docs || []);
    } catch {
      setError('Impossible de charger les leads.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function updateStatus(id: string, status: string) {
    await fetch(`${BACKEND}/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchLeads();
    if (selected?.id === id) setSelected((s: any) => ({ ...s, status }));
  }

  async function convertToMandate(lead: any) {
    setConverting(lead.id);
    setError('');
    try {
      const date = new Date();
      const ref = `VX-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const dealer = lead.dealerInfo || {};
      const offer = lead.dealerOffer || {};

      const mandatePayload = {
        reference: ref,
        status: 'draft',
        sourceLead: lead.id,
        clientInfo: {
          firstName: lead.fullName?.split(' ')[0] || '',
          lastName: lead.fullName?.split(' ').slice(1).join(' ') || lead.fullName || '',
          email: lead.email || '',
          phone: lead.phone || '',
        },
        vehicleInfo: {
          brand: lead.vehicleSearched || '',
          vehiclePrice: offer.confirmedVehiclePrice || undefined,
        },
        dealerInfo: {
          dealerName: dealer.dealerName || '',
          dealerContactName: dealer.dealerContact || '',
          dealerCity: dealer.dealerCity || '',
          dealerCountry: dealer.dealerCountry || 'Allemagne',
          dealerOrderNumber: offer.dealerOfferReference || '',
          dealerOfferDate: offer.dealerOfferDate || undefined,
        },
        serviceInfo: {
          servicePrice: 1490,
          depositAmount: 500,
          remainingBalance: 990,
          transportIncluded: true,
          transportProvider: 'Cars Trans',
          adminSupportIncluded: true,
          cpiIncluded: true,
          finalRegistrationSupportIncluded: true,
          homeDeliveryIncluded: true,
        },
        internalNotes: [
          lead.message ? `Critères client : ${lead.message}` : '',
          lead.budget ? `Budget déclaré : ${BUDGET_LABELS[lead.budget] || lead.budget}` : '',
          lead.timeline ? `Délai souhaité : ${TIMELINE_LABELS[lead.timeline] || lead.timeline}` : '',
          offer.dealerNotes ? `Notes concess. : ${offer.dealerNotes}` : '',
        ].filter(Boolean).join('\n'),
      };

      const res = await fetch(`${BACKEND}/api/import-mandates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mandatePayload),
      });

      if (!res.ok) throw new Error('Erreur création mandat');
      const mandate = await res.json();

      await fetch(`${BACKEND}/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'mandate_created',
          convertedMandate: mandate.id || mandate.doc?.id,
        }),
      });

      setSuccess(`Mandat ${ref} créé. Redirection vers les mandats…`);
      fetchLeads();
      setTimeout(() => router.push('/admin/mandates'), 1500);
    } catch {
      setError('Erreur lors de la conversion en mandat.');
    } finally {
      setConverting(null);
    }
  }

  const newCount = leads.filter(l => l.status === 'new').length;
  const canConvert = selected && MANDATE_ELIGIBLE.includes(selected.status);

  return (
    <>
      <Head>
        <title>Leads — Vanalexcars Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="text-2xl font-bold text-gray-900">Vanalexcars Admin</Link>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Leads</span>
                {newCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{newCount} nouvelle{newCount > 1 ? 's' : ''}</span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/admin-formulaires" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium">← Formulaires</Link>
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">Payload CMS</Link>
                <Link href="/" className="text-gray-600 hover:text-gray-900">Voir le site</Link>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <Link href="/admin/vehicles" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">Véhicules</Link>
              <Link href="/admin/leads" className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">Leads</Link>
              <Link href="/admin/mandates" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">Mandats</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Demandes entrantes</h1>
              <p className="text-sm text-gray-500 mt-1">Qualifiez → contactez le concessionnaire → convertissez en mandat</p>
            </div>
          </div>

          {/* Workflow visuel */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 overflow-x-auto">
            <div className="flex items-center gap-2 text-xs font-medium whitespace-nowrap">
              {[
                { s: 'new', label: 'Reçu' },
                { s: 'qualifying', label: 'Qualification' },
                { s: 'contacted', label: 'Contacté' },
                { s: 'dealer_request_sent', label: 'Demande concess.' },
                { s: 'dealer_offer_received', label: 'Offre reçue' },
                { s: 'mandate_pending', label: 'Mandat à créer' },
                { s: 'mandate_created', label: 'Mandat créé' },
              ].map((step, i, arr) => (
                <React.Fragment key={step.s}>
                  <span className={`px-2 py-1 rounded-full ${STATUS_LABELS[step.s]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {step.label}
                  </span>
                  {i < arr.length - 1 && <span className="text-gray-300">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>}
          {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-sm">{success}</div>}

          {/* Filtres */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold text-gray-600">Filtrer :</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400">
              <option value="">Tous les statuts</option>
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button onClick={fetchLeads} className="text-sm text-gray-500 hover:text-gray-800 underline">Actualiser</button>
            <span className="ml-auto text-sm text-gray-500">{leads.length} lead(s)</span>
          </div>

          <div className="flex gap-6">

            {/* Liste */}
            <div className="w-80 shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <span className="text-sm font-semibold text-gray-700">Leads</span>
                </div>
                {loading ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Chargement…</div>
                ) : leads.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Aucun lead pour l'instant</div>
                ) : (
                  <div className="divide-y max-h-[600px] overflow-y-auto">
                    {leads.map(lead => (
                      <button
                        key={lead.id}
                        onClick={() => setSelected(lead)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${selected?.id === lead.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{lead.fullName}</p>
                            <p className="text-xs text-gray-500 truncate">{lead.vehicleSearched}</p>
                          </div>
                          <StatusBadge status={lead.status} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{new Date(lead.createdAt).toLocaleDateString('fr-FR')}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Détail */}
            <div className="flex-1 min-w-0">
              {!selected ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center h-64">
                  <p className="text-gray-400 text-sm">Sélectionnez un lead dans la liste</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                  {/* En-tête */}
                  <div className="px-6 py-5 border-b flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selected.fullName}</h2>
                      <p className="text-sm text-gray-500">{selected.vehicleSearched}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <select
                        value={selected.status}
                        onChange={e => { updateStatus(selected.id, e.target.value); setSelected((s: any) => ({ ...s, status: e.target.value })); }}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400"
                      >
                        {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>

                      {selected.status === 'mandate_created' ? (
                        <Link href="/admin/mandates"
                          className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
                          ✓ Voir le mandat
                        </Link>
                      ) : canConvert ? (
                        <button
                          onClick={() => convertToMandate(selected)}
                          disabled={converting === selected.id}
                          className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition disabled:opacity-50"
                        >
                          {converting === selected.id ? 'Conversion…' : '→ Convertir en mandat'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Disponible après réception de l'offre concess.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-5 space-y-6">

                    {/* Infos client + projet */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Coordonnées</h3>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-xs text-gray-500">Email</dt>
                            <dd className="text-sm font-medium"><a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">{selected.email}</a></dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500">Téléphone</dt>
                            <dd className="text-sm font-medium">
                              {selected.phone ? <a href={`tel:${selected.phone}`}>{selected.phone}</a> : <span className="text-gray-400">—</span>}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500">Date de la demande</dt>
                            <dd className="text-sm font-medium">{new Date(selected.createdAt).toLocaleString('fr-FR')}</dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Projet</h3>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-xs text-gray-500">Véhicule recherché</dt>
                            <dd className="text-sm font-medium">{selected.vehicleSearched || '—'}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500">Budget</dt>
                            <dd className="text-sm font-medium">{BUDGET_LABELS[selected.budget] || selected.budget || '—'}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500">Délai souhaité</dt>
                            <dd className="text-sm font-medium">{TIMELINE_LABELS[selected.timeline] || selected.timeline || '—'}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Message client */}
                    {selected.message && (
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Critères client</h3>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                      </div>
                    )}

                    {/* Section concessionnaire */}
                    <DealerSection lead={selected} backendUrl={BACKEND} onSave={() => { fetchLeads(); }} onUpdate={(updated) => setSelected(updated)} />

                    {/* Notes internes */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Notes internes</h3>
                      <NotesEditor lead={selected} backendUrl={BACKEND} onSave={fetchLeads} />
                    </div>

                    {/* Actions rapides */}
                    <div className="flex flex-wrap gap-3 pt-2 border-t">
                      <a href={`mailto:${selected.email}?subject=Votre%20demande%20VanalexCars%20—%20${encodeURIComponent(selected.vehicleSearched || '')}`}
                        className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                        ✉ Envoyer un email
                      </a>
                      {selected.phone && (
                        <a href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=Bonjour%20${encodeURIComponent(selected.fullName?.split(' ')[0] || '')}%2C%20je%20reviens%20vers%20vous%20concernant%20votre%20demande%20VanalexCars.`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 border border-green-300 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition">
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

AdminLeads.getLayout = (page: React.ReactNode) => page;

// ── Section concessionnaire + offre ──────────────────────────────────────────
function DealerSection({ lead, backendUrl, onSave, onUpdate }: { lead: any; backendUrl: string; onSave: () => void; onUpdate: (l: any) => void }) {
  const di = lead.dealerInfo || {};
  const do_ = lead.dealerOffer || {};

  const [form, setForm] = useState({
    dealerName: di.dealerName || '',
    dealerContact: di.dealerContact || '',
    dealerCity: di.dealerCity || '',
    dealerCountry: di.dealerCountry || 'Allemagne',
    dealerOfferReference: do_.dealerOfferReference || '',
    dealerOfferDate: do_.dealerOfferDate ? do_.dealerOfferDate.substring(0, 10) : '',
    vehicleAvailabilityConfirmed: do_.vehicleAvailabilityConfirmed || false,
    confirmedVehiclePrice: do_.confirmedVehiclePrice ? String(do_.confirmedVehiclePrice) : '',
    dealerNotes: do_.dealerNotes || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const di2 = lead.dealerInfo || {};
    const do2 = lead.dealerOffer || {};
    setForm({
      dealerName: di2.dealerName || '',
      dealerContact: di2.dealerContact || '',
      dealerCity: di2.dealerCity || '',
      dealerCountry: di2.dealerCountry || 'Allemagne',
      dealerOfferReference: do2.dealerOfferReference || '',
      dealerOfferDate: do2.dealerOfferDate ? do2.dealerOfferDate.substring(0, 10) : '',
      vehicleAvailabilityConfirmed: do2.vehicleAvailabilityConfirmed || false,
      confirmedVehiclePrice: do2.confirmedVehiclePrice ? String(do2.confirmedVehiclePrice) : '',
      dealerNotes: do2.dealerNotes || '',
    });
  }, [lead.id]);

  async function save() {
    setSaving(true);
    const body = {
      dealerInfo: {
        dealerName: form.dealerName,
        dealerContact: form.dealerContact,
        dealerCity: form.dealerCity,
        dealerCountry: form.dealerCountry,
      },
      dealerOffer: {
        dealerOfferReference: form.dealerOfferReference,
        dealerOfferDate: form.dealerOfferDate || undefined,
        vehicleAvailabilityConfirmed: form.vehicleAvailabilityConfirmed,
        confirmedVehiclePrice: form.confirmedVehiclePrice ? Number(form.confirmedVehiclePrice) : undefined,
        dealerNotes: form.dealerNotes,
      },
    };
    const res = await fetch(`${backendUrl}/api/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const updated = await res.json();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onUpdate({ ...lead, ...updated });
    onSave();
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>
        Concessionnaire &amp; Offre
        <span className="text-xs text-gray-400 font-normal ml-1">— À remplir après contact avec le concess. allemand</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Nom du concessionnaire</label>
          <input value={form.dealerName} onChange={e => setForm(f => ({ ...f, dealerName: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
            placeholder="Ex: BMW Zentrum München GmbH" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Contact (nom)</label>
          <input value={form.dealerContact} onChange={e => setForm(f => ({ ...f, dealerContact: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
            placeholder="Ex: Klaus Müller" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Ville</label>
          <input value={form.dealerCity} onChange={e => setForm(f => ({ ...f, dealerCity: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
            placeholder="Ex: Munich" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Pays</label>
          <input value={form.dealerCountry} onChange={e => setForm(f => ({ ...f, dealerCountry: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400" />
        </div>

        {/* Séparateur offre */}
        <div className="sm:col-span-2 border-t pt-3 mt-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bon de commande / Offre</p>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Référence bon de commande</label>
          <input value={form.dealerOfferReference} onChange={e => setForm(f => ({ ...f, dealerOfferReference: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
            placeholder="Ex: BC-2025-04871" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Date de l'offre</label>
          <input type="date" value={form.dealerOfferDate} onChange={e => setForm(f => ({ ...f, dealerOfferDate: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Prix véhicule confirmé (€ TTC)</label>
          <input type="number" value={form.confirmedVehiclePrice} onChange={e => setForm(f => ({ ...f, confirmedVehiclePrice: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
            placeholder="Ex: 48500" />
        </div>
        <div className="flex items-center gap-3 pt-5">
          <input type="checkbox" id="avail" checked={form.vehicleAvailabilityConfirmed}
            onChange={e => setForm(f => ({ ...f, vehicleAvailabilityConfirmed: e.target.checked }))}
            className="w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-400" />
          <label htmlFor="avail" className="text-sm text-gray-700 font-medium cursor-pointer">
            Disponibilité confirmée par le concess.
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-500 block mb-1">Notes sur l'offre</label>
          <textarea value={form.dealerNotes} onChange={e => setForm(f => ({ ...f, dealerNotes: e.target.value }))}
            rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 resize-none"
            placeholder="Conditions particulières, délai de livraison concess., remarques…" />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button onClick={save} disabled={saving}
          className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
          {saving ? 'Sauvegarde…' : 'Sauvegarder'}
        </button>
        {saved && <span className="text-xs text-green-600 font-medium">✓ Sauvegardé</span>}
      </div>
    </div>
  );
}

// ── Éditeur de notes internes ─────────────────────────────────────────────────
function NotesEditor({ lead, backendUrl, onSave }: { lead: any; backendUrl: string; onSave: () => void }) {
  const [notes, setNotes] = useState(lead.internalNotes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setNotes(lead.internalNotes || ''); }, [lead.id, lead.internalNotes]);

  async function save() {
    setSaving(true);
    await fetch(`${backendUrl}/api/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ internalNotes: notes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSave();
  }

  return (
    <div>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
        placeholder="Notes de qualification, suivis, remarques…"
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 resize-none" />
      <div className="flex items-center gap-3 mt-2">
        <button onClick={save} disabled={saving}
          className="text-sm bg-gray-800 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition disabled:opacity-50">
          {saving ? 'Sauvegarde…' : 'Sauvegarder'}
        </button>
        {saved && <span className="text-xs text-green-600 font-medium">✓ Sauvegardé</span>}
      </div>
    </div>
  );
}
