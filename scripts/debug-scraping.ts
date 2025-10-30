/**
 * Script de debug pour voir la structure des données ImporteMoi
 */

import { scrapeImporteMoiPage } from './scrape-importemoi';

async function debug() {
  const vehicles = await scrapeImporteMoiPage('https://importemoi.fr/mini-occasion-allemagne');

  if (vehicles.length > 0) {
    console.log('\n📝 Premier véhicule scrapé:');
    console.log(JSON.stringify(vehicles[0], null, 2));
  }
}

debug().catch(console.error);
