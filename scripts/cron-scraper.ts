/**
 * Cron job pour scraping automatique quotidien
 * Utilisation: node --loader tsx scripts/cron-scraper.ts
 * Ou avec crontab: 0 2 * * * cd /path && npm run scrape:daily
 */

interface ScraperConfig {
  brand: string;
  maxPages: number;
  enabled: boolean;
}

const SCRAPER_CONFIGS: ScraperConfig[] = [
  { brand: 'mini', maxPages: 3, enabled: true },
  { brand: 'bmw', maxPages: 5, enabled: true },
  { brand: 'mercedes', maxPages: 5, enabled: false }, // Désactivé par défaut
  { brand: 'audi', maxPages: 5, enabled: false },
  { brand: 'porsche', maxPages: 2, enabled: false },
  { brand: 'volkswagen', maxPages: 5, enabled: false },
];

async function runDailyScraper() {
  console.log('🕐 Début du scraping automatique quotidien');
  console.log(`📅 Date: ${new Date().toLocaleString('fr-FR')}\n`);

  const results: any[] = [];

  for (const config of SCRAPER_CONFIGS) {
    if (!config.enabled) {
      console.log(`⏭️  ${config.brand.toUpperCase()}: Désactivé, ignoré\n`);
      continue;
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚗 Traitement: ${config.brand.toUpperCase()}`);
    console.log(`${'='.repeat(50)}\n`);

    try {
      const response = await fetch('http://localhost:3001/api/scrape-and-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SCRAPER_SECRET || 'your-secret-key'}`,
        },
        body: JSON.stringify({
          brand: config.brand,
          maxPages: config.maxPages,
          downloadImages: false, // Désactivé pour l'instant
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      results.push({
        brand: config.brand,
        success: true,
        stats: data.stats,
      });

      console.log(`\n✅ ${config.brand.toUpperCase()} terminé:`);
      console.log(`   Créés: ${data.stats.created}`);
      console.log(`   Mis à jour: ${data.stats.updated}`);
      console.log(`   Erreurs: ${data.stats.errors}`);
    } catch (error: any) {
      console.error(`\n❌ Erreur ${config.brand.toUpperCase()}:`, error.message);
      results.push({
        brand: config.brand,
        success: false,
        error: error.message,
      });
    }

    // Pause entre chaque marque
    if (config !== SCRAPER_CONFIGS[SCRAPER_CONFIGS.length - 1]) {
      console.log('\n⏳ Pause de 30 secondes avant la marque suivante...');
      await sleep(30000);
    }
  }

  // Résumé final
  console.log('\n\n' + '='.repeat(50));
  console.log('📊 RÉSUMÉ DU SCRAPING QUOTIDIEN');
  console.log('='.repeat(50) + '\n');

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Réussis: ${successful.length}/${results.length}`);
  console.log(`❌ Échecs: ${failed.length}/${results.length}\n`);

  if (successful.length > 0) {
    console.log('Détails des succès:');
    successful.forEach((r) => {
      console.log(`  - ${r.brand.toUpperCase()}:`);
      console.log(`      Créés: ${r.stats.created}`);
      console.log(`      Mis à jour: ${r.stats.updated}`);
      console.log(`      Total traités: ${r.stats.total}`);
    });
  }

  if (failed.length > 0) {
    console.log('\nDétails des échecs:');
    failed.forEach((r) => {
      console.log(`  - ${r.brand.toUpperCase()}: ${r.error}`);
    });
  }

  const totalStats = successful.reduce(
    (acc, r) => ({
      created: acc.created + (r.stats.created || 0),
      updated: acc.updated + (r.stats.updated || 0),
      total: acc.total + (r.stats.total || 0),
      errors: acc.errors + (r.stats.errors || 0),
    }),
    { created: 0, updated: 0, total: 0, errors: 0 }
  );

  console.log('\n📈 TOTAUX:');
  console.log(`   Véhicules traités: ${totalStats.total}`);
  console.log(`   Nouveaux: ${totalStats.created}`);
  console.log(`   Mis à jour: ${totalStats.updated}`);
  console.log(`   Erreurs: ${totalStats.errors}`);

  console.log(`\n🕐 Fin: ${new Date().toLocaleString('fr-FR')}`);
  console.log('='.repeat(50) + '\n');

  // Envoyer une notification (email, Slack, etc.) - À implémenter
  if (totalStats.errors > 0) {
    console.warn('⚠️  Des erreurs sont survenues, vérifiez les logs');
  }

  return {
    success: failed.length === 0,
    results,
    totalStats,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Exécution
if (import.meta.url === `file://${process.argv[1]}`) {
  runDailyScraper()
    .then((result) => {
      if (result.success) {
        console.log('✅ Scraping quotidien terminé avec succès');
        process.exit(0);
      } else {
        console.error('❌ Scraping quotidien terminé avec des erreurs');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Erreur fatale du scraping quotidien:', error);
      process.exit(1);
    });
}

export { runDailyScraper };
