import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:              { label: 'Nouvelle demande',    color: 'bg-blue-100 text-blue-700' },
  qualifying:       { label: 'En qualification',    color: 'bg-yellow-100 text-yellow-700' },
  contacted:        { label: 'Client contacté',     color: 'bg-orange-100 text-orange-700' },
  proposal_sent:    { label: 'Proposition envoyée', color: 'bg-purple-100 text-purple-700' },
  mandate_pending:  { label: 'Mandat à créer',      color: 'bg-teal-100 text-teal-700' },
  mandate_created:  { label: 'Mandat créé',         color: 'bg-green-100 text-green-700' },
  abandoned:        { label: 'Abandonné',           color: 'bg-gray-100 text-gray-500' },
  refused:          { label: 'Refusé',              color: 'bg-red-100 text-red-700' },
};

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, { label }]) => ({ value, label }));

const BUDGET_LABELS: Record<string, string> = {
  '<30k':   '< 30 000 €',
  '30-50k': '30–50 000 €',
  '50-80k': '50–80 000 €',
  '80-120k':'80–120 000 €',
  '120k+':  '> 120 000 €',
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
      // Générer une référence automatique
      const date = new Date();
      const ref = `VX-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      // Créer le mandat pré-rempli
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
        ].filter(Boolean).join('\n'),
      };

      const res = await fetch(`${BACKEND}/api/import-mandates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mandatePayload),
      });

      if (!res.ok) throw new Error('Erreur création mandat');
      const mandate = await res.json();

      // Mettre à jour le lead : statut + référence au mandat
      await fetch(`${BACKEND}/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'mandate_created',
          convertedMandate: mandate.id || mandate.doc?.id,
        }),
      });

      setSuccess(`Mandat ${ref} créé avec succès.`);
      fetchLeads();
      // Rediriger vers la page mandats après 1.5s
      setTimeout(() => router.push('/admin/mandates'), 1500);
    } catch {
      setError('Erreur lors de la conversion en mandat.');
    } finally {
      setConverting(null);
    }
  }

  const newCount = leads.filter(l => l.status === 'new').length;

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
                <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">Payload CMS</Link>
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Voir le site</Link>
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

          {/* Titre */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Demandes entrantes</h1>
              <p className="text-sm text-gray-500 mt-1">Qualifiez les leads avant de les convertir en mandat</p>
            </div>
          </div>

          {/* Alertes */}
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

          {/* Disposition : liste + détail */}
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
            <div className="flex-1">
              {!selected ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center h-64">
                  <p className="text-gray-400 text-sm">Sélectionnez un lead dans la liste</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* En-tête fiche */}
                  <div className="px-6 py-5 border-b flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selected.fullName}</h2>
                      <p className="text-sm text-gray-500">{selected.vehicleSearched}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Changement de statut inline */}
                      <select
                        value={selected.status}
                        onChange={e => updateStatus(selected.id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400"
                      >
                        {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>

                      {/* Bouton conversion — désactivé si déjà converti */}
                      {selected.status === 'mandate_created' ? (
                        <Link href="/admin/mandates"
                          className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
                          ✓ Voir le mandat
                        </Link>
                      ) : (
                        <button
                          onClick={() => convertToMandate(selected)}
                          disabled={converting === selected.id}
                          className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {converting === selected.id ? 'Conversion…' : '→ Convertir en mandat'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Corps fiche */}
                  <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Coordonnées */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Coordonnées</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-xs text-gray-500">Email</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">{selected.email}</a>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Téléphone</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {selected.phone ? <a href={`tel:${selected.phone}`} className="hover:underline">{selected.phone}</a> : <span className="text-gray-400">—</span>}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Date de la demande</dt>
                          <dd className="text-sm font-medium text-gray-900">{new Date(selected.createdAt).toLocaleString('fr-FR')}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Véhicule */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Projet</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-xs text-gray-500">Véhicule recherché</dt>
                          <dd className="text-sm font-medium text-gray-900">{selected.vehicleSearched || '—'}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Budget</dt>
                          <dd className="text-sm font-medium text-gray-900">{BUDGET_LABELS[selected.budget] || selected.budget || '—'}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Délai souhaité</dt>
                          <dd className="text-sm font-medium text-gray-900">{TIMELINE_LABELS[selected.timeline] || selected.timeline || '—'}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Message */}
                    {selected.message && (
                      <div className="sm:col-span-2">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Critères et précisions</h3>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                      </div>
                    )}

                    {/* Notes internes */}
                    <div className="sm:col-span-2">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Notes internes</h3>
                      <NotesEditor lead={selected} backendUrl={BACKEND} onSave={fetchLeads} />
                    </div>

                    {/* Actions rapides */}
                    <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2 border-t">
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

// Sous-composant pour les notes internes avec sauvegarde inline
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
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={4}
        placeholder="Ajoutez vos notes de qualification ici…"
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 resize-none"
      />
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
