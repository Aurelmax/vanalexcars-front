/**
 * Sync statut véhicules AS24 — vérifie si les annonces sont toujours actives.
 *
 * Règles métier :
 *  - 404 / 410 → inactive immédiatement (annonce clairement supprimée)
 *  - Timeout / erreur réseau / 5xx → erreur transitoire :
 *      • 1ère ou 2ème erreur consécutive → conserver active, incrémenter syncErrorCount
 *      • 3ème erreur consécutive (ou +) ET syncErrorSince ≥ 3 jours → passer en "to_review"
 *  - 200 → actif + réinitialiser le compteur d'erreurs
 *
 * Usage: tsx scripts/sync-as24-status.ts [--dry-run] [--limit N]
 * Exemples:
 *   tsx scripts/sync-as24-status.ts --dry-run        → simulation sans modifier
 *   tsx scripts/sync-as24-status.ts --limit 50       → vérifie 50 véhicules max
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';
const DELAY_MS = 1500;       // délai entre chaque requête AS24
const TIMEOUT_MS = 10_000;   // timeout par requête
const ERROR_THRESHOLD = 3;   // nombre d'erreurs consécutives avant to_review
const ERROR_DAYS = 3;        // jours consécutifs minimum avant to_review

// Patterns indiquant une redirection vers une page générique (annonce expirée)
const DEAD_REDIRECT_PATTERNS = [
  '/lst/',             // page de liste de résultats AS24
  '/angebote?',        // recherche générique
  'autoscout24.de/fr', // page d'accueil localisée
];

// ─── Détecter si une annonce est morte ───────────────────────────────────────

type CheckResult = 'active' | 'inactive' | 'transient_error';

async function checkListing(url: string): Promise<CheckResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Tenter HEAD d'abord (pas de body, rapide)
    let res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VanalexCars-StatusBot/1.0)' },
    });

    // Certains serveurs refusent HEAD → fallback GET
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VanalexCars-StatusBot/1.0)' },
      });
    }

    clearTimeout(timer);

    // 404 ou 410 → annonce clairement supprimée
    if (res.status === 404 || res.status === 410) return 'inactive';

    // 5xx → erreur serveur AS24 transitoire
    if (res.status >= 500) return 'transient_error';

    // Redirection vers une page générique → annonce expirée
    const finalUrl = res.url || url;
    const redirectedAway = DEAD_REDIRECT_PATTERNS.some(
      p => finalUrl.includes(p) && !url.includes(p)
    );
    if (redirectedAway) return 'inactive';

    // Tout autre code → actif
    return 'active';

  } catch {
    clearTimeout(timer);
    // Timeout ou erreur réseau → erreur transitoire
    return 'transient_error';
  }
}

// ─── Calculer si un véhicule doit passer en to_review ────────────────────────

function shouldFlagForReview(vehicle: any): boolean {
  const errorCount: number = vehicle.syncErrorCount || 0;
  const errorSince: string | null = vehicle.syncErrorSince || null;

  if (errorCount < ERROR_THRESHOLD) return false;
  if (!errorSince) return false;

  const daysSinceFirstError = (Date.now() - new Date(errorSince).getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceFirstError >= ERROR_DAYS;
}

// ─── PATCH vers Payload ───────────────────────────────────────────────────────

async function patchVehicle(vehicleId: string, data: Record<string, any>, dryRun: boolean): Promise<boolean> {
  if (dryRun) return true;

  const res = await fetch(`${BACKEND}/api/vehicles/${vehicleId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.ok;
}

// ─── Sleep ────────────────────────────────────────────────────────────────────

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const limitIdx = args.findIndex(a => a === '--limit');
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1] || '500', 10) : 500;

  console.log(`\n🔄 Sync statut AS24${dryRun ? ' [DRY RUN — aucune modification]' : ''}`);
  console.log(`📡 Backend: ${BACKEND}`);
  console.log(`🔢 Limite: ${limit} véhicules`);
  console.log(`⚠️  Règle to_review: ${ERROR_THRESHOLD} erreurs consécutives sur ${ERROR_DAYS} jours\n`);

  // Récupérer tous les véhicules actifs AS24 avec une URL de fiche
  const res = await fetch(
    `${BACKEND}/api/vehicles?limit=${limit}&where[sourcePlatform][equals]=autoscout24.de&where[status][in][0]=active&where[status][in][1]=to_review`,
  );
  if (!res.ok) {
    console.error('❌ Impossible de récupérer les véhicules:', res.status);
    process.exit(1);
  }

  const { docs: vehicles, totalDocs } = await res.json() as { docs: any[]; totalDocs: number };

  const toCheck = vehicles.filter((v: any) => {
    const url = v.originalListingUrl || (v.sourceUrl?.includes('/angebote/') ? v.sourceUrl : null);
    return !!url;
  });

  console.log(`📦 ${totalDocs} véhicules AS24 (actifs + to_review)`);
  console.log(`🎯 ${toCheck.length} ont une URL de fiche à vérifier\n`);

  const stats = {
    active: 0,
    inactive: 0,
    toReview: 0,
    errorKept: 0,
    patchOk: 0,
    patchFail: 0,
  };

  for (let i = 0; i < toCheck.length; i++) {
    const vehicle = toCheck[i];
    const listingUrl = vehicle.originalListingUrl || vehicle.sourceUrl;
    const prefix = `[${String(i + 1).padStart(3, ' ')}/${toCheck.length}]`;
    const label = (vehicle.title || vehicle.id).substring(0, 48);

    process.stdout.write(`${prefix} ${label}…`);

    const result = await checkListing(listingUrl);

    if (result === 'active') {
      stats.active++;
      process.stdout.write(` ✅ actif\n`);

      // Réinitialiser le compteur d'erreurs si nécessaire
      if ((vehicle.syncErrorCount || 0) > 0) {
        await patchVehicle(vehicle.id, { syncErrorCount: 0, syncErrorSince: null }, dryRun);
      }

    } else if (result === 'inactive') {
      stats.inactive++;
      process.stdout.write(` ❌ INACTIVE (404/410)`);

      const ok = await patchVehicle(vehicle.id, {
        status: 'inactive',
        syncErrorCount: 0,
        syncErrorSince: null,
      }, dryRun);

      stats[ok ? 'patchOk' : 'patchFail']++;
      process.stdout.write(dryRun ? ' (dry-run)\n' : ok ? ' → désactivé ✓\n' : ' → PATCH échoué ⚠️\n');

    } else {
      // Erreur transitoire (timeout / réseau / 5xx)
      const newCount = (vehicle.syncErrorCount || 0) + 1;
      const errorSince = vehicle.syncErrorSince || new Date().toISOString();

      // Simuler l'état mis à jour pour évaluer shouldFlagForReview
      const updatedVehicle = { ...vehicle, syncErrorCount: newCount, syncErrorSince: errorSince };

      if (shouldFlagForReview(updatedVehicle)) {
        stats.toReview++;
        process.stdout.write(` ⚠️  TO_REVIEW (${newCount} erreurs depuis ${Math.round((Date.now() - new Date(errorSince).getTime()) / 86400000)}j)`);

        const ok = await patchVehicle(vehicle.id, {
          status: 'to_review',
          syncErrorCount: newCount,
          syncErrorSince: errorSince,
        }, dryRun);

        stats[ok ? 'patchOk' : 'patchFail']++;
        process.stdout.write(dryRun ? ' (dry-run)\n' : ok ? ' → marqué ✓\n' : ' → PATCH échoué ⚠️\n');
      } else {
        stats.errorKept++;
        process.stdout.write(` ⚠️  erreur réseau (${newCount}/${ERROR_THRESHOLD}) — conservé actif\n`);

        await patchVehicle(vehicle.id, {
          syncErrorCount: newCount,
          syncErrorSince: errorSince,
        }, dryRun);
      }
    }

    if (i < toCheck.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n📊 Résumé${dryRun ? ' (DRY RUN)' : ''}:`);
  console.log(`   ✅ Restés actifs :              ${stats.active}`);
  console.log(`   ❌ Passés en inactive :          ${stats.inactive}`);
  console.log(`   ⚠️  Passés en to_review :         ${stats.toReview}`);
  console.log(`   🔄 Erreurs transitoires (gardés): ${stats.errorKept}`);
  if (!dryRun) {
    console.log(`   💾 PATCH réussis :              ${stats.patchOk}`);
    if (stats.patchFail > 0) console.log(`   💥 PATCH échoués :              ${stats.patchFail}`);
  }
  console.log('');
}

main().catch(e => { console.error('❌ Erreur fatale:', e); process.exit(1); });
