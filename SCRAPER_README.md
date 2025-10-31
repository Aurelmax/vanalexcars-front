# 🤖 Scraper ImporteMoi - Documentation

Système automatisé de scraping et d'import de véhicules depuis ImporteMoi.fr vers votre Payload CMS.

## 📋 Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Automatisation](#automatisation)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Installation

### 1. Vérifier les dépendances

Toutes les dépendances sont déjà installées dans le projet :
- `node-fetch` : Pour les requêtes HTTP
- `tsx` : Pour exécuter les scripts TypeScript

### 2. Configuration environnement

Copiez le fichier d'exemple :

\`\`\`bash
cp .env.scraper.example .env.local
\`\`\`

Modifiez `.env.local` et définissez une clé secrète unique :

\`\`\`env
SCRAPER_SECRET=votre-cle-secrete-unique-ici
NEXT_PUBLIC_API_URL=http://localhost:4200
\`\`\`

---

## ⚙️ Configuration

### Marques à scraper

Éditez `scripts/cron-scraper.ts` pour activer/désactiver les marques :

\`\`\`typescript
const SCRAPER_CONFIGS: ScraperConfig[] = [
  { brand: 'mini', maxPages: 3, enabled: true },      // ✅ Activé
  { brand: 'bmw', maxPages: 5, enabled: true },       // ✅ Activé
  { brand: 'mercedes', maxPages: 5, enabled: false }, // ❌ Désactivé
  // ...
];
\`\`\`

### Paramètres par marque

- **brand** : Nom de la marque (mini, bmw, mercedes, audi, porsche, volkswagen)
- **maxPages** : Nombre maximum de pages à scraper (~35 véhicules/page)
- **enabled** : Activer/désactiver le scraping pour cette marque

---

## 📖 Utilisation

### Scraping manuel (test)

#### Scraper uniquement (sans import)

\`\`\`bash
# Scraper 2 pages de MINI
npm run scrape:mini

# Scraper 3 pages de BMW
npm run scrape:bmw

# Scraper 3 pages de Mercedes
npm run scrape:mercedes

# Scraper 3 pages d'Audi
npm run scrape:audi

# Scraper 2 pages de Porsche
npm run scrape:porsche

# Scraper 3 pages de Volkswagen
npm run scrape:volkswagen

# Scraper N pages d'une marque spécifique
npx tsx scripts/scrape-importemoi.ts <brand> <pages>
# Exemple: npx tsx scripts/scrape-importemoi.ts porsche 5
\`\`\`

#### Scraper + Import dans Payload CMS

\`\`\`bash
# Via l'API (recommandé)
curl -X POST http://localhost:3001/api/scrape-and-import \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer votre-cle-secrete" \\
  -d '{"brand": "mini", "maxPages": 2, "downloadImages": false}'
\`\`\`

### Import quotidien automatique

\`\`\`bash
# Exécuter le cron job manuellement
npm run scrape:daily
\`\`\`

---

## ⏰ Automatisation

### Méthode 1 : Crontab Linux/Mac

Ouvrez crontab :
\`\`\`bash
crontab -e
\`\`\`

Ajoutez cette ligne (2h du matin tous les jours) :
\`\`\`cron
0 2 * * * cd /chemin/vers/vanalexcars/frontend && npm run scrape:daily >> /var/log/scraper.log 2>&1
\`\`\`

### Méthode 2 : PM2 (recommandé pour production)

Installez PM2 :
\`\`\`bash
npm install -g pm2
\`\`\`

Créez un fichier `ecosystem.config.js` :
\`\`\`javascript
module.exports = {
  apps: [{
    name: 'vanalexcars-scraper',
    script: 'npm',
    args: 'run scrape:daily',
    cron_restart: '0 2 * * *', // 2h du matin
    autorestart: false,
    watch: false,
  }]
};
\`\`\`

Démarrez :
\`\`\`bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
\`\`\`

### Méthode 3 : Vercel Cron (si hébergé sur Vercel)

Ajoutez dans `vercel.json` :
\`\`\`json
{
  "crons": [{
    "path": "/api/scrape-and-import",
    "schedule": "0 2 * * *"
  }]
}
\`\`\`

---

## 🏗️ Architecture

### Flux de données

\`\`\`
ImporteMoi.fr
    ↓ (1) Fetch HTML
scripts/scrape-importemoi.ts
    ↓ (2) Extract JSON
    ↓ (3) Transform data
pages/api/scrape-and-import.ts
    ↓ (4) Check duplicates
    ↓ (5) Create/Update
Payload CMS (MongoDB)
    ↓ (6) Display
Frontend VanalexCars
\`\`\`

### Fichiers principaux

| Fichier | Description |
|---------|-------------|
| \`scripts/scrape-importemoi.ts\` | Script de scraping (extrait le JSON) |
| \`pages/api/scrape-and-import.ts\` | API d'import dans Payload CMS |
| \`scripts/cron-scraper.ts\` | Cron job automatique quotidien |

### Brand IDs ImporteMoi

Mapping des IDs de marques utilisés par ImporteMoi (vérifiés) :

| Marque | ID ImporteMoi | Slug VanalexCars |
|--------|---------------|------------------|
| MINI | 16338 | mini |
| BMW | 13 | bmw |
| Mercedes-Benz | 47 | mercedes |
| Audi | 9 | audi |
| Porsche | 57 | porsche |
| Volkswagen | 74 | volkswagen |

### Données scrapées

Pour chaque véhicule :
- ✅ Informations de base (titre, marque, modèle, prix, année)
- ✅ Caractéristiques (kilométrage, carburant, transmission, portes, places)
- ✅ Type de carrosserie (sedan, suv, sportback, touring, etc.)
- ✅ Couleurs (extérieure, intérieure/sellerie)
- ✅ Spécifications (moteur, puissance HP/kW, consommation, CO2)
- ✅ Équipements structurés (liste de features extraites du HTML)
- ✅ Métadonnées (ID externe, référence, source, date de publication)
- ⏳ Images (téléchargement désactivé par défaut)

### Gestion du cycle de vie

**Création/Mise à jour:**
- Détection automatique des doublons via `externalReference`
- Création si nouveau véhicule
- Mise à jour si véhicule existant

**Suppression des véhicules obsolètes:**
- ⏳ **À implémenter**: Système de nettoyage automatique
- Les véhicules vendus/retirés d'ImporteMoi doivent être détectés
- Stratégie recommandée: Marquer comme "sold" après 7 jours sans mise à jour
- Alternative: Suppression automatique après 30 jours d'inactivité

---

## 🔧 Troubleshooting

### Problème : "Non autorisé" (401)

**Solution** : Vérifiez que la clé \`SCRAPER_SECRET\` est correctement définie dans \`.env.local\` et que vous l'utilisez dans le header \`Authorization\`.

### Problème : "Aucun véhicule trouvé"

**Causes possibles** :
- ImporteMoi a changé la structure HTML
- La marque n'a aucun véhicule disponible
- Problème de connexion réseau

**Solution** : Testez manuellement :
\`\`\`bash
npm run scrape:mini
\`\`\`

### Problème : Véhicules en double

**Solution** : Le système utilise \`externalReference\` pour détecter les doublons. Vérifiez que ce champ est bien unique dans Payload CMS.

### Problème : Import lent

**Solution** : Ajustez le nombre de pages (\`maxPages\`) et le délai entre les requêtes dans le code.

---

## 📊 Monitoring

### Logs

Les logs sont affichés dans la console lors de l'exécution :

\`\`\`
🔍 Scraping: https://importemoi.fr/mini-occasion-allemagne
✅ 35 véhicules extraits du JSON
✅ Page 1/2: 35 véhicules récupérés
✅ Créé: MINI Cooper S Cabrio
📊 Résumé de l'import:
   Total: 70
   Créés: 65
   Mis à jour: 5
   Erreurs: 0
\`\`\`

### Statistiques

Après chaque import, vous recevez :
- Nombre total de véhicules traités
- Nombre de créations
- Nombre de mises à jour
- Nombre d'erreurs et détails

---

## ⚠️ Considérations légales

**Important** : Le scraping de sites web peut violer les conditions d'utilisation (ToS) du site cible.

**Recommandations** :
1. ✅ Utilisez avec modération (1 fois/jour maximum)
2. ✅ Respectez les délais entre les requêtes (rate limiting)
3. ✅ Ne partagez pas les données scrapées publiquement
4. ⚠️ Contactez ImporteMoi pour une API officielle si possible

**Ce scraper est fourni à titre éducatif et pour usage personnel uniquement.**

---

## 🆘 Support

En cas de problème :
1. Vérifiez les logs
2. Testez manuellement avec \`npm run scrape:mini\`
3. Vérifiez que Payload CMS est accessible
4. Consultez la documentation Payload CMS

---

## 📝 Roadmap

### 🔴 Haute Priorité

- [ ] **Gestion des véhicules obsolètes**
  - Ajouter champ `lastScrapedAt` (timestamp de dernière mise à jour)
  - Script de nettoyage: marquer "sold" si non mis à jour depuis 7 jours
  - Option: suppression automatique après 30 jours d'inactivité
  - Endpoint API: `POST /api/cleanup-old-vehicles`

- [ ] **Téléchargement et gestion des images**
  - Télécharger images depuis ImporteMoi CDN
  - Upload dans Payload CMS media library
  - Optimisation automatique (WebP, compression)
  - Associer 5-10 images par véhicule

### 🟡 Priorité Moyenne

- [ ] **Dashboard de monitoring visuel**
  - Page admin: `/admin/scraper-stats`
  - Tableau de bord avec métriques en temps réel:
    - Dernier import par marque (timestamp, durée)
    - Nombre de véhicules actifs par marque
    - Taux de mise à jour (créés vs mis à jour)
    - Graphiques: évolution stock, prix moyen, erreurs
    - Logs des 100 dernières opérations
  - API backend: `GET /api/scraper/stats`
  - Alertes visuelles si erreurs > 10%

- [ ] **Système de notifications**
  - Email/Slack après chaque import quotidien
  - Alertes en cas d'erreurs critiques
  - Résumé hebdomadaire des imports

### 🟢 Améliorations Futures

- [ ] **Tests et qualité**
  - Tests unitaires pour le parser
  - Tests d'intégration pour l'API
  - Validation des données scrapées

- [ ] **Optimisations**
  - Cache des pages déjà scrapées (Redis)
  - Parallélisation du scraping (Promise.all)
  - Gestion avancée du rate limiting
  - Retry automatique avec backoff exponentiel

- [ ] **Features avancées**
  - Scraping d'autres plateformes (AutoScout24, Mobile.de)
  - Détection de variations de prix (alertes baisse)
  - Analyse de marché (prix moyens, tendances)
  - Export CSV/Excel des données

---

## 📊 API Endpoints Proposés

### `/api/scraper/stats` (GET)
Retourne les statistiques de scraping:
```json
{
  "lastImport": {
    "mini": { "timestamp": "2025-10-31T02:00:00Z", "duration": 45, "created": 12, "updated": 24, "errors": 0 },
    "bmw": { "timestamp": "2025-10-31T02:01:00Z", "duration": 120, "created": 45, "updated": 63, "errors": 2 }
  },
  "activeVehicles": {
    "mini": 156,
    "bmw": 289,
    "audi": 234,
    "total": 679
  },
  "updateRate": {
    "created": 57,
    "updated": 87,
    "percentage": 39.6
  },
  "recentErrors": [
    { "brand": "bmw", "vehicle": "BMW X5 ...", "error": "Validation failed", "timestamp": "..." }
  ]
}
```

### `/api/cleanup-old-vehicles` (POST)
Nettoie les véhicules obsolètes:
```json
{
  "dryRun": false,
  "daysThreshold": 7,
  "action": "mark_sold" // ou "delete"
}
```

Retourne:
```json
{
  "affected": 23,
  "vehicles": [
    { "id": "...", "title": "Mini Cooper ...", "lastScraped": "2025-10-20" }
  ]
}
```
