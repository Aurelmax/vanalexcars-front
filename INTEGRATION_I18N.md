# Configuration i18n VanalexCars

Configuration multilingue typée et sécurisée pour VanalexCars avec Next.js.

## Configuration effectuée

### 1. Variables d'environnement (`.env.local`)

```env
NEXT_PUBLIC_SUPPORTED_LANGS=fr,en,es,it
NEXT_PUBLIC_DEFAULT_LANG=fr
```

### 2. Configuration Next.js (`next.config.mjs`)

Le routage i18n natif est activé :

```javascript
i18n: {
  locales: process.env.NEXT_PUBLIC_SUPPORTED_LANGS?.split(',') ?? ['fr'],
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LANG ?? 'fr',
  localeDetection: true,
}
```

Cela active automatiquement les routes :
- `/fr/contact`
- `/en/contact`
- `/es/contact`
- `/it/contact`

### 3. Utilitaires TypeScript (`lib/utils/i18n.ts`)

Fichier centralisé avec types sûrs :

```typescript
import { supportedLangs, defaultLang, isLangSupported, getSafeLang, getLangName } from '@/lib/utils/i18n'
```

**Fonctions disponibles :**
- `supportedLangs: string[]` - Liste des langues supportées
- `defaultLang: string` - Langue par défaut
- `isLangSupported(lang)` - Vérifie si une langue est supportée
- `getSafeLang(lang)` - Retourne la langue ou la langue par défaut
- `getLangName(lang)` - Retourne le nom complet de la langue

### 4. Composant LanguageSelector (`components/LanguageSelector.tsx`)

Composant réutilisable avec 2 variantes :

**Variante dropdown (par défaut) :**
```tsx
import LanguageSelector from '@/components/LanguageSelector'

<LanguageSelector />
```

**Variante boutons :**
```tsx
<LanguageSelector variant="buttons" />
```

## Intégration dans le Header

Pour ajouter le sélecteur de langue dans le Header, modifie `components/Header.tsx` :

```tsx
import LanguageSelector from './LanguageSelector'

export default function Header() {
  // ... code existant

  return (
    <header>
      <div className='flex justify-between items-center'>
        {/* Logo */}
        <Link href='/'>...</Link>

        {/* Navigation */}
        <nav>...</nav>

        {/* Sélecteur de langue */}
        <LanguageSelector variant="buttons" className="ml-4" />
      </div>
    </header>
  )
}
```

## Utilisation dans les composants

### Accéder à la langue actuelle

```tsx
import { useRouter } from 'next/router'

export default function MyComponent() {
  const { locale } = useRouter() // 'fr', 'en', 'es'

  return <div>Langue actuelle : {locale}</div>
}
```

### Créer des liens multilingues

```tsx
import Link from 'next/link'

<Link href="/contact" locale="en">
  Contact (English)
</Link>
```

### Changer de langue programmatiquement

```tsx
import { useRouter } from 'next/router'

export default function MyComponent() {
  const router = useRouter()

  const switchToEnglish = () => {
    router.push(router.pathname, router.asPath, { locale: 'en' })
  }

  return <button onClick={switchToEnglish}>Switch to English</button>
}
```

## Ce que l'ajout des langues change concrètement

### Routes automatiques générées par Next.js

- `/fr/contact`, `/fr/vehicles`, `/fr/services`
- `/en/contact`, `/en/vehicles`, `/en/services`
- `/es/contact`, `/es/vehicles`, `/es/services`
- `/it/contact`, `/it/vehicles`, `/it/services`

### Composant LanguageSelector

Le dictionnaire `langNames` dans [lib/utils/i18n.ts](lib/utils/i18n.ts) affiche désormais :
- 🇫🇷 Français
- 🇬🇧 English
- 🇪🇸 Español
- 🇮🇹 Italiano

### Middleware intelligent de détection automatique

Le fichier [middleware.ts](middleware.ts) détecte automatiquement la langue du navigateur :

**Comportement :**
- Visiteur italien → redirigé automatiquement vers `/it/`
- Navigateur anglais → `/en/`
- Par défaut → `/fr/`

**Fonctionnement :**
1. Lit l'en-tête `Accept-Language` du navigateur
2. Compare avec les langues supportées
3. Redirige vers la langue correspondante ou la langue par défaut
4. Ignore `/api`, `/_next` et les fichiers statiques

## Intégration avec Payload CMS

Si tu actives la localisation dans ton backend Payload CMS, consulte le guide détaillé : [PAYLOAD_I18N_INTEGRATION.md](PAYLOAD_I18N_INTEGRATION.md)

### Configuration rapide Payload

```typescript
// Dans ta collection Vehicles
localization: {
  locales: ['fr', 'en', 'es', 'it'],
  defaultLocale: 'fr',
  fallback: true,
}
```

Résultat :
- Tes contenus dans l'admin Payload auront les onglets 🇫🇷 🇬🇧 🇪🇸 🇮🇹
- Tu pourras servir tes données via `/api/vehicles?locale=it`

## Prochaines étapes recommandées

1. **Tester le middleware**
   ```bash
   pnpm dev
   ```
   Visite `http://localhost:3000` et observe la redirection automatique

2. **Intégrer le LanguageSelector dans le Header**
   ```tsx
   import LanguageSelector from './LanguageSelector'

   <LanguageSelector variant="buttons" className="ml-4" />
   ```

3. **Activer la localisation dans Payload CMS** (backend)
   Voir [PAYLOAD_I18N_INTEGRATION.md](PAYLOAD_I18N_INTEGRATION.md) pour les détails

4. **Créer les fichiers de traduction statiques**
   ```
   locales/
     fr/
       common.json
       vehicles.json
     en/
       common.json
       vehicles.json
   ```

5. **Mettre à jour le sitemap et robots.txt** pour le SEO multilingue

## Avantages de cette implémentation

- **Type-safe** : TypeScript garantit la sécurité des types
- **Centralisé** : Configuration unique dans `.env.local`
- **Nullish coalescing** : `??` au lieu de `||` pour plus de précision
- **SEO-friendly** : URLs multilingues natives (`/fr/`, `/en/`)
- **Détection auto** : Langue du navigateur détectée automatiquement
- **Réutilisable** : Composants et utilitaires modulaires

## Tests

Pour tester la configuration :

1. Démarre le serveur dev :
   ```bash
   pnpm dev
   ```

2. Accède aux URLs :
   - `http://localhost:3000` (français par défaut)
   - `http://localhost:3000/en` (anglais)
   - `http://localhost:3000/es` (espagnol)
   - `http://localhost:3000/it` (italien)

3. Le sélecteur de langue devrait changer l'URL automatiquement
