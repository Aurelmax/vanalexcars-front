/**
 * /admin/mandates — Gestion des mandats d'importation VanalexCars
 * MVP : liste, création, changement de statut, génération PDF
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:          { label: 'Brouillon',       color: 'bg-gray-100 text-gray-700' },
  sent_to_client: { label: 'Envoyé client',   color: 'bg-blue-100 text-blue-700' },
  signed:         { label: 'Signé',           color: 'bg-purple-100 text-purple-700' },
  deposit_paid:   { label: 'Acompte payé',    color: 'bg-yellow-100 text-yellow-700' },
  active:         { label: 'Actif',           color: 'bg-green-100 text-green-700' },
  completed:      { label: 'Complété',        color: 'bg-teal-100 text-teal-700' },
  cancelled:      { label: 'Annulé',          color: 'bg-red-100 text-red-700' },
};

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, { label }]) => ({ value, label }));

const FUEL_OPTIONS = [
  { value: 'petrol', label: 'Essence' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybride' },
  { value: 'electric', label: 'Électrique' },
  { value: 'phev', label: 'Hybride rechargeable' },
];

const ID_DOC_OPTIONS = [
  { value: 'cni', label: "Carte nationale d'identité" },
  { value: 'passport', label: 'Passeport' },
  { value: 'residence_permit', label: 'Titre de séjour' },
];

const EMPTY_FORM = {
  reference: '',
  status: 'draft',
  // client
  clientFirstName: '', clientLastName: '', clientEmail: '', clientPhone: '',
  clientAddress: '', clientPostalCode: '', clientCity: '', clientCountry: 'France',
  clientIdType: '', clientIdNumber: '',
  // vehicle
  vehicleBrand: '', vehicleModel: '', vehicleVersion: '', vehicleVin: '',
  vehicleFirstReg: '', vehicleMileage: '', vehicleFuel: '', vehicleTransmission: '',
  vehicleColor: '', vehiclePower: '', vehicleCo2: '', vehiclePrice: '',
  vehicleVatIncluded: true, vehicleWarranty: '',
  // dealer
  dealerName: '', dealerAddress: '', dealerCountry: 'Allemagne',
  dealerContact: '', dealerEmail: '', dealerPhone: '',
  dealerOrderNumber: '', dealerOfferDate: '',
  // service
  servicePrice: '1490', depositAmount: '500', remainingBalance: '990',
  transportIncluded: true, transportProvider: 'Cars Trans', transportCost: '',
  adminSupport: true, cpiIncluded: true, registrationSupport: true, homeDelivery: true,
  // taxes
  registrationTaxEst: '', ecologicalMalusEst: '', taxNotes: '',
  // signature
  stripePaymentLink: '',
  // notes
  internalNotes: '',
};

function formatCurrency(val: number | string) {
  const n = Number(val);
  if (isNaN(n)) return '—';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABELS[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>{s.label}</span>;
}

export default function AdminMandates() {
  const [mandates, setMandates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMandate, setSelectedMandate] = useState<any | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMandates = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${BACKEND}/api/import-mandates?limit=100&sort=-createdAt${statusFilter ? `&where[status][equals]=${statusFilter}` : ''}`;
      const res = await fetch(url);
      const json = await res.json();
      setMandates(json.docs || []);
    } catch {
      setError('Impossible de charger les mandats.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchMandates(); }, [fetchMandates]);

  function fillFormFromMandate(m: any) {
    const c = m.clientInfo || {};
    const v = m.vehicleInfo || {};
    const d = m.dealerInfo || {};
    const s = m.serviceInfo || {};
    const t = m.taxesInfo || {};
    const sig = m.signatureInfo || {};
    setForm({
      reference: m.reference || '',
      status: m.status || 'draft',
      clientFirstName: c.firstName || '', clientLastName: c.lastName || '',
      clientEmail: c.email || '', clientPhone: c.phone || '',
      clientAddress: c.address || '', clientPostalCode: c.postalCode || '',
      clientCity: c.city || '', clientCountry: c.country || 'France',
      clientIdType: c.identityDocumentType || '', clientIdNumber: c.identityDocumentNumber || '',
      vehicleBrand: v.brand || '', vehicleModel: v.model || '',
      vehicleVersion: v.version || '', vehicleVin: v.vin || '',
      vehicleFirstReg: v.firstRegistrationDate || '',
      vehicleMileage: v.mileage != null ? String(v.mileage) : '',
      vehicleFuel: v.fuelType || '', vehicleTransmission: v.transmission || '',
      vehicleColor: v.color || '', vehiclePower: v.power || '',
      vehicleCo2: v.co2 != null ? String(v.co2) : '',
      vehiclePrice: v.vehiclePrice != null ? String(v.vehiclePrice) : '',
      vehicleVatIncluded: v.vehicleVatIncluded !== false,
      vehicleWarranty: v.warrantyInfo || '',
      dealerName: d.dealerName || '', dealerAddress: d.dealerAddress || '',
      dealerCountry: d.dealerCountry || 'Allemagne',
      dealerContact: d.dealerContactName || '',
      dealerEmail: d.dealerEmail || '', dealerPhone: d.dealerPhone || '',
      dealerOrderNumber: d.dealerOrderNumber || '',
      dealerOfferDate: d.dealerOfferDate ? d.dealerOfferDate.substring(0, 10) : '',
      servicePrice: s.servicePrice != null ? String(s.servicePrice) : '1490',
      depositAmount: s.depositAmount != null ? String(s.depositAmount) : '500',
      remainingBalance: s.remainingBalance != null ? String(s.remainingBalance) : '990',
      transportIncluded: s.transportIncluded !== false,
      transportProvider: s.transportProvider || 'Cars Trans',
      transportCost: s.transportEstimatedCost != null ? String(s.transportEstimatedCost) : '',
      adminSupport: s.adminSupportIncluded !== false,
      cpiIncluded: s.cpiIncluded !== false,
      registrationSupport: s.finalRegistrationSupportIncluded !== false,
      homeDelivery: s.homeDeliveryIncluded !== false,
      registrationTaxEst: t.registrationTaxEstimated != null ? String(t.registrationTaxEstimated) : '',
      ecologicalMalusEst: t.ecologicalMalusEstimated != null ? String(t.ecologicalMalusEstimated) : '',
      taxNotes: t.notesAboutTaxes || '',
      stripePaymentLink: sig.stripePaymentLink || '',
      internalNotes: m.internalNotes || '',
    });
  }

  function openCreate() {
    setSelectedMandate(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError(''); setSuccess('');
  }

  function openEdit(m: any) {
    setSelectedMandate(m);
    fillFormFromMandate(m);
    setShowForm(true);
    setError(''); setSuccess('');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement;
    setForm(f => ({
      ...f,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    }));
  }

  function buildPayload(f: typeof EMPTY_FORM) {
    return {
      reference: f.reference,
      status: f.status,
      clientInfo: {
        firstName: f.clientFirstName, lastName: f.clientLastName,
        email: f.clientEmail, phone: f.clientPhone,
        address: f.clientAddress, postalCode: f.clientPostalCode,
        city: f.clientCity, country: f.clientCountry,
        identityDocumentType: f.clientIdType || undefined,
        identityDocumentNumber: f.clientIdNumber,
      },
      vehicleInfo: {
        brand: f.vehicleBrand, model: f.vehicleModel,
        version: f.vehicleVersion, vin: f.vehicleVin,
        firstRegistrationDate: f.vehicleFirstReg,
        mileage: f.vehicleMileage ? Number(f.vehicleMileage) : undefined,
        fuelType: f.vehicleFuel || undefined,
        transmission: f.vehicleTransmission || undefined,
        color: f.vehicleColor, power: f.vehiclePower,
        co2: f.vehicleCo2 ? Number(f.vehicleCo2) : undefined,
        vehiclePrice: Number(f.vehiclePrice),
        vehicleCurrency: 'EUR',
        vehicleVatIncluded: f.vehicleVatIncluded,
        warrantyInfo: f.vehicleWarranty,
      },
      dealerInfo: {
        dealerName: f.dealerName, dealerAddress: f.dealerAddress,
        dealerCountry: f.dealerCountry, dealerContactName: f.dealerContact,
        dealerEmail: f.dealerEmail, dealerPhone: f.dealerPhone,
        dealerOrderNumber: f.dealerOrderNumber,
        dealerOfferDate: f.dealerOfferDate || undefined,
      },
      serviceInfo: {
        serviceName: 'Forfait Import VanalexCars',
        servicePrice: Number(f.servicePrice),
        depositAmount: Number(f.depositAmount),
        remainingBalance: Number(f.remainingBalance),
        transportIncluded: f.transportIncluded,
        transportProvider: f.transportProvider,
        transportEstimatedCost: f.transportCost ? Number(f.transportCost) : undefined,
        adminSupportIncluded: f.adminSupport,
        cpiIncluded: f.cpiIncluded,
        finalRegistrationSupportIncluded: f.registrationSupport,
        homeDeliveryIncluded: f.homeDelivery,
      },
      taxesInfo: {
        registrationTaxEstimated: f.registrationTaxEst ? Number(f.registrationTaxEst) : undefined,
        ecologicalMalusEstimated: f.ecologicalMalusEst ? Number(f.ecologicalMalusEst) : undefined,
        registrationTaxIncluded: false,
        ecologicalMalusIncluded: false,
        notesAboutTaxes: f.taxNotes,
      },
      signatureInfo: {
        stripePaymentLink: f.stripePaymentLink,
      },
      internalNotes: f.internalNotes,
    };
  }

  async function handleSave() {
    if (!form.reference || !form.clientLastName || !form.vehicleBrand || !form.dealerOrderNumber) {
      setError('Champs obligatoires manquants : Référence, Nom client, Marque, N° de commande.');
      return;
    }
    setSaving(true); setError(''); setSuccess('');
    try {
      const body = buildPayload(form);
      const url = selectedMandate
        ? `${BACKEND}/api/import-mandates/${selectedMandate.id}`
        : `${BACKEND}/api/import-mandates`;
      const method = selectedMandate ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess(selectedMandate ? 'Mandat mis à jour.' : 'Mandat créé avec succès.');
      setShowForm(false);
      fetchMandates();
    } catch (e: any) {
      setError('Erreur : ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`${BACKEND}/api/import-mandates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchMandates();
  }

  async function handleGeneratePdf(mandate: any) {
    setPdfLoading(mandate.id);
    try {
      const res = await fetch(`${BACKEND}/api/generate-mandate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mandateId: mandate.id }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mandat-${mandate.reference || mandate.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert('Erreur génération PDF : ' + e.message);
    } finally {
      setPdfLoading(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce mandat définitivement ?')) return;
    await fetch(`${BACKEND}/api/import-mandates/${id}`, { method: 'DELETE' });
    fetchMandates();
  }

  // ── Rendu formulaire ──────────────────────────────────────────────────────

  const Field = ({ label, name, type = 'text', required = false, placeholder = '' }: any) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input
        type={type} name={name} value={(form as any)[name]} onChange={handleChange}
        placeholder={placeholder} required={required}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
      />
    </div>
  );

  const Select = ({ label, name, options, required = false }: any) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <select name={name} value={(form as any)[name]} onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400">
        <option value="">—</option>
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  const Checkbox = ({ label, name }: any) => (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
      <input type="checkbox" name={name} checked={(form as any)[name]} onChange={handleChange}
        className="w-4 h-4 accent-yellow-500" />
      {label}
    </label>
  );

  const Textarea = ({ label, name, rows = 3 }: any) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <textarea name={name} value={(form as any)[name]} onChange={handleChange} rows={rows}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400" />
    </div>
  );

  const Section = ({ title, children }: any) => (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );

  const totalEst = (Number(form.vehiclePrice) || 0) + 1490 + (Number(form.registrationTaxEst) || 0) + (Number(form.ecologicalMalusEst) || 0);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Head>
        <title>Mandats d'importation — Vanalexcars Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="text-2xl font-bold text-gray-900">Vanalexcars Admin</Link>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Mandats</span>
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
              <Link href="/admin" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                Tableau de bord
              </Link>
              <Link href="/admin/vehicles" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                Véhicules
              </Link>
              <Link href="/admin/services" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                Services
              </Link>
              <Link href="/admin/testimonials" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                Témoignages
              </Link>
              <Link href="/admin/submissions" className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                Soumissions
              </Link>
              <Link href="/admin/mandates" className="py-4 px-1 border-b-2 border-yellow-500 text-yellow-600 font-medium text-sm">
                Mandats
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Titre + actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mandats d'importation</h1>
              <p className="text-sm text-gray-500 mt-1">Gestion des mandats de recherche, sélection et accompagnement</p>
            </div>
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 bg-yellow-500 text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-yellow-400 transition shrink-0">
              + Nouveau mandat
            </button>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold text-gray-600">Filtrer :</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-yellow-400">
              <option value="">Tous les statuts</option>
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button onClick={fetchMandates} className="text-sm text-gray-500 hover:text-gray-800 underline">Actualiser</button>
            <span className="ml-auto text-sm text-gray-500">{mandates.length} mandat(s)</span>
          </div>

          {/* Messages */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">{success}</div>}

          {/* Table */}
          {loading ? (
            <div className="text-center py-16 text-gray-500">Chargement…</div>
          ) : mandates.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📋</div>
              <p className="font-semibold">Aucun mandat pour l'instant</p>
              <p className="text-sm mt-1">Créez le premier mandat via le bouton ci-dessus</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Référence</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Véhicule</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Prix véhicule</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mandates.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono font-semibold text-yellow-700">{m.reference}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{m.clientInfo?.firstName} {m.clientInfo?.lastName}</p>
                        <p className="text-xs text-gray-500">{m.clientInfo?.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{m.vehicleInfo?.brand} {m.vehicleInfo?.model}</p>
                        <p className="text-xs text-gray-500">{m.vehicleInfo?.version}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold">{m.vehicleInfo?.vehiclePrice ? formatCurrency(m.vehicleInfo.vehiclePrice) : '—'}</td>
                      <td className="px-4 py-3">
                        <select value={m.status}
                          onChange={e => handleStatusChange(m.id, e.target.value)}
                          className="text-xs border-0 bg-transparent focus:ring-0 cursor-pointer font-semibold">
                          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(m.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(m)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-lg font-semibold transition">
                            Modifier
                          </button>
                          <button onClick={() => handleGeneratePdf(m)}
                            disabled={pdfLoading === m.id}
                            className="text-xs bg-yellow-500 hover:bg-yellow-400 text-black px-2.5 py-1.5 rounded-lg font-semibold transition disabled:opacity-50">
                            {pdfLoading === m.id ? '…' : '⬇ PDF'}
                          </button>
                          {m.serviceInfo?.stripePaymentLink && (
                            <a href={m.serviceInfo.stripePaymentLink} target="_blank" rel="noopener noreferrer"
                              className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2.5 py-1.5 rounded-lg font-semibold transition">
                              💳 Stripe
                            </a>
                          )}
                          <button onClick={() => handleDelete(m.id)}
                            className="text-xs text-red-400 hover:text-red-600 transition px-1">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* ── FORMULAIRE (slide-over) ────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="flex-1 bg-black/40" onClick={() => setShowForm(false)} />

          {/* Panel */}
          <div className="w-full max-w-3xl bg-white shadow-2xl flex flex-col overflow-hidden">
            {/* Header panel */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0 bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedMandate ? `Mandat — ${selectedMandate.reference}` : 'Nouveau mandat'}
                </h2>
                {selectedMandate && <StatusBadge status={selectedMandate.status} />}
              </div>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {/* Corps scroll */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}

              {/* Référence + Statut */}
              <Section title="📋 Référence & Statut">
                <Field label="Référence" name="reference" required placeholder="VX-2025-001" />
                <Select label="Statut" name="status" options={STATUS_OPTIONS} />
              </Section>

              {/* Client */}
              <Section title="👤 Informations client (Mandant)">
                <Field label="Prénom" name="clientFirstName" required />
                <Field label="Nom" name="clientLastName" required />
                <Field label="Email" name="clientEmail" type="email" />
                <Field label="Téléphone" name="clientPhone" />
                <div className="md:col-span-2">
                  <Field label="Adresse" name="clientAddress" />
                </div>
                <Field label="Code postal" name="clientPostalCode" />
                <Field label="Ville" name="clientCity" />
                <Field label="Pays" name="clientCountry" />
                <Select label="Type de pièce d'identité" name="clientIdType" options={ID_DOC_OPTIONS} />
                <Field label="Numéro de pièce d'identité" name="clientIdNumber" />
              </Section>

              {/* Véhicule */}
              <Section title="🚗 Véhicule identifié">
                <Field label="Marque" name="vehicleBrand" required />
                <Field label="Modèle" name="vehicleModel" required />
                <Field label="Version / finition" name="vehicleVersion" />
                <Field label="VIN" name="vehicleVin" placeholder="À compléter si disponible" />
                <Field label="1ère immatriculation" name="vehicleFirstReg" placeholder="ex: 01/2022" />
                <Field label="Kilométrage (km)" name="vehicleMileage" type="number" />
                <Select label="Carburant" name="vehicleFuel" options={FUEL_OPTIONS} />
                <Select label="Boîte" name="vehicleTransmission" options={[
                  { value: 'automatic', label: 'Automatique' },
                  { value: 'manual', label: 'Manuelle' },
                ]} />
                <Field label="Couleur" name="vehicleColor" />
                <Field label="Puissance" name="vehiclePower" placeholder="ex: 450 ch" />
                <Field label="CO₂ (g/km)" name="vehicleCo2" type="number" />
                <Field label="Prix du véhicule (€)" name="vehiclePrice" type="number" required />
                <div className="md:col-span-2 flex items-center gap-2">
                  <Checkbox label="TVA incluse" name="vehicleVatIncluded" />
                </div>
                <div className="md:col-span-2">
                  <Textarea label="Informations garantie" name="vehicleWarranty" rows={2} />
                </div>
              </Section>

              {/* Concessionnaire */}
              <Section title="🇩🇪 Concessionnaire allemand">
                <Field label="Nom du concessionnaire" name="dealerName" required />
                <Field label="Pays" name="dealerCountry" />
                <div className="md:col-span-2">
                  <Field label="Adresse" name="dealerAddress" />
                </div>
                <Field label="Nom du contact" name="dealerContact" />
                <Field label="Email" name="dealerEmail" type="email" />
                <Field label="Téléphone" name="dealerPhone" />
                <Field label="N° de commande / offre" name="dealerOrderNumber" required />
                <Field label="Date de l'offre" name="dealerOfferDate" type="date" />
              </Section>

              {/* Prestation */}
              <Section title="💼 Prestation VanalexCars">
                <Field label="Forfait (€ TTC)" name="servicePrice" type="number" />
                <Field label="Acompte (€)" name="depositAmount" type="number" />
                <Field label="Solde restant (€)" name="remainingBalance" type="number" />
                <Field label="Transporteur" name="transportProvider" />
                <Field label="Coût transport estimé (€)" name="transportCost" type="number" />
                <div className="md:col-span-2 grid grid-cols-2 gap-3 pt-1">
                  <Checkbox label="Transport inclus" name="transportIncluded" />
                  <Checkbox label="Démarches administratives" name="adminSupport" />
                  <Checkbox label="CPI inclus" name="cpiIncluded" />
                  <Checkbox label="Suivi carte grise" name="registrationSupport" />
                  <Checkbox label="Livraison à domicile" name="homeDelivery" />
                </div>
              </Section>

              {/* Taxes */}
              <Section title="⚠️ Frais non inclus (informatif)">
                <Field label="Carte grise estimée (€)" name="registrationTaxEst" type="number" />
                <Field label="Malus écologique estimé (€)" name="ecologicalMalusEst" type="number" />
                <div className="md:col-span-2">
                  <Textarea label="Notes sur les taxes" name="taxNotes" rows={2} />
                </div>
                {(form.vehiclePrice || form.registrationTaxEst || form.ecologicalMalusEst) && (
                  <div className="md:col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                    <p className="font-semibold text-gray-800 mb-1">Total estimé client :</p>
                    <p className="text-gray-600 text-xs">Véhicule {formatCurrency(form.vehiclePrice)} + Forfait {formatCurrency(1490)} + Carte grise ~{formatCurrency(form.registrationTaxEst || 0)} + Malus ~{formatCurrency(form.ecologicalMalusEst || 0)}</p>
                    <p className="font-bold text-lg text-gray-900 mt-1">≈ {formatCurrency(totalEst)}</p>
                  </div>
                )}
              </Section>

              {/* Paiement / Signature */}
              <Section title="💳 Paiement & Signature">
                <div className="md:col-span-2">
                  <Field label="Lien Stripe (acompte)" name="stripePaymentLink" placeholder="https://buy.stripe.com/..." />
                </div>
              </Section>

              {/* Notes internes */}
              <Section title="🔒 Notes internes (non transmises au client)">
                <div className="md:col-span-2">
                  <Textarea label="" name="internalNotes" rows={4} />
                </div>
              </Section>
            </div>

            {/* Footer panel */}
            <div className="shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                Annuler
              </button>
              {selectedMandate && (
                <button onClick={() => handleGeneratePdf(selectedMandate)}
                  disabled={pdfLoading === selectedMandate?.id}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-50">
                  {pdfLoading === selectedMandate?.id ? 'Génération…' : '⬇ Télécharger PDF'}
                </button>
              )}
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2 bg-yellow-500 text-black rounded-lg text-sm font-bold hover:bg-yellow-400 transition disabled:opacity-50">
                {saving ? 'Enregistrement…' : (selectedMandate ? 'Mettre à jour' : 'Créer le mandat')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

AdminMandates.getLayout = (page: React.ReactNode) => page;
