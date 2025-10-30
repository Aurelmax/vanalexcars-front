# Intégration i18n avec Payload CMS

Guide d'intégration de la configuration multilingue avec Payload CMS pour VanalexCars.

## Configuration Payload CMS

### 1. Activer la localisation dans votre collection

Dans votre backend Payload (port 4200), ajoutez la configuration de localisation à vos collections :

```typescript
// collections/Vehicles.ts (exemple)
import { CollectionConfig } from 'payload/types'

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  admin: {
    useAsTitle: 'title',
  },
  // 🌍 Configuration i18n
  localization: {
    locales: ['fr', 'en', 'es', 'it'],
    defaultLocale: 'fr',
    fallback: true, // Utilise la langue par défaut si traduction manquante
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true, // 🔑 Ce champ sera traduisible
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true, // 🔑 Ce champ sera traduisible
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      localized: false, // ❌ Ce champ ne sera pas traduit
    },
    {
      name: 'images',
      type: 'array',
      localized: false, // ❌ Les images sont partagées
      fields: [
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
}
```

### 2. Résultat dans l'admin Payload

Une fois configuré, l'interface admin affichera :

```
┌─────────────────────────────────────────┐
│ Édition: Véhicule                       │
├─────────────────────────────────────────┤
│ Langues: 🇫🇷 FR | 🇬🇧 EN | 🇪🇸 ES | 🇮🇹 IT │
├─────────────────────────────────────────┤
│ Title (localized)                       │
│ [                                    ]  │
│                                         │
│ Description (localized)                 │
│ [                                    ]  │
│                                         │
│ Price                                   │
│ [                                    ]  │
└─────────────────────────────────────────┘
```

## Utilisation dans le Frontend

### 1. Récupérer les données localisées depuis le frontend

Modifiez vos services pour accepter un paramètre `locale` :

```typescript
// lib/services/vehicleService.ts
export async function getVehicles(locale: string = 'fr') {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/vehicles?locale=${locale}&limit=10`
  )

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des véhicules')
  }

  return response.json()
}

export async function getVehicleBySlug(slug: string, locale: string = 'fr') {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/vehicles?where[slug][equals]=${slug}&locale=${locale}`
  )

  if (!response.ok) {
    throw new Error('Véhicule non trouvé')
  }

  return response.json()
}
```

### 2. Utiliser dans vos pages Next.js

```tsx
// pages/vehicles/index.tsx
import { GetServerSideProps } from 'next'
import { getVehicles } from '@/lib/services/vehicleService'

export default function VehiclesPage({ vehicles, locale }) {
  return (
    <div>
      <h1>
        {locale === 'fr' && 'Nos Véhicules'}
        {locale === 'en' && 'Our Vehicles'}
        {locale === 'es' && 'Nuestros Vehículos'}
        {locale === 'it' && 'I Nostri Veicoli'}
      </h1>

      {vehicles.map(vehicle => (
        <div key={vehicle.id}>
          <h2>{vehicle.title}</h2>
          <p>{vehicle.description}</p>
          <p>{vehicle.price} €</p>
        </div>
      ))}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const vehicles = await getVehicles(locale || 'fr')

  return {
    props: {
      vehicles: vehicles.docs,
      locale: locale || 'fr',
    },
  }
}
```

### 3. Exemple avec hooks personnalisés

```tsx
// lib/hooks/useVehicles.ts
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getVehicles } from '@/lib/services/vehicleService'

export function useVehicles() {
  const { locale } = useRouter()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true)
      try {
        const data = await getVehicles(locale || 'fr')
        setVehicles(data.docs)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [locale])

  return { vehicles, loading, locale }
}

// Utilisation dans un composant
export default function VehiclesList() {
  const { vehicles, loading } = useVehicles()

  if (loading) return <div>Chargement...</div>

  return (
    <div>
      {vehicles.map(vehicle => (
        <div key={vehicle.id}>{vehicle.title}</div>
      ))}
    </div>
  )
}
```

## Collections à localiser

Voici les collections recommandées pour la localisation :

### ✅ À localiser (champs textuels)

- **Vehicles** : `title`, `description`, `features`
- **Services** : `title`, `description`, `benefits`
- **Testimonials** : `content`, `clientName`
- **Pages** : `title`, `content`, `metaDescription`
- **Blog Posts** : `title`, `content`, `excerpt`

### ❌ À ne PAS localiser (données partagées)

- Prix
- Images (URLs)
- Dates
- Nombres
- Statuts
- Identifiants

## Requêtes API Payload

### Exemples de requêtes

```bash
# Récupérer tous les véhicules en français
GET /api/vehicles?locale=fr

# Récupérer tous les véhicules en anglais
GET /api/vehicles?locale=en

# Récupérer un véhicule spécifique en espagnol
GET /api/vehicles/abc123?locale=es

# Récupérer avec fallback (si traduction manquante, utilise 'fr')
GET /api/vehicles?locale=it&fallbackLocale=fr
```

### Structure de réponse

```json
{
  "docs": [
    {
      "id": "abc123",
      "title": "BMW Serie 3",
      "description": "Berline sportive et élégante",
      "price": 35000,
      "locale": "fr",
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "totalDocs": 10,
  "limit": 10,
  "page": 1
}
```

## Migration des données existantes

Si vous avez déjà des données en français, voici comment les migrer :

```typescript
// scripts/migrateToMultilang.ts
import payload from 'payload'

async function migrateVehicles() {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.DATABASE_URI,
  })

  const vehicles = await payload.find({
    collection: 'vehicles',
    limit: 1000,
  })

  for (const vehicle of vehicles.docs) {
    // Les données existantes deviennent la version française
    await payload.update({
      collection: 'vehicles',
      id: vehicle.id,
      data: {
        title: {
          fr: vehicle.title,
          en: '', // À remplir manuellement ou via traduction auto
          es: '',
          it: '',
        },
        description: {
          fr: vehicle.description,
          en: '',
          es: '',
          it: '',
        },
      },
    })
  }

  console.log('Migration terminée !')
}

migrateVehicles()
```

## Bonnes pratiques

1. **Fallback systématique** : Toujours activer `fallback: true` pour éviter les contenus vides
2. **Traductions progressives** : Commencez par FR/EN, ajoutez ES/IT progressivement
3. **SEO multilingue** : Utilisez `next-seo` avec des meta tags localisés
4. **Cache intelligent** : Cachez les réponses API par locale
5. **Tests de traduction** : Vérifiez que tous les champs localisés ont leurs traductions

## Prochaines étapes

1. Activer la localisation dans Payload CMS (backend)
2. Mettre à jour les services frontend avec le paramètre `locale`
3. Tester les routes : `/fr/vehicles`, `/en/vehicles`, `/es/vehicles`, `/it/vehicles`
4. Ajouter les traductions progressivement dans l'admin Payload
5. Implémenter un système de traduction automatique (optionnel)
