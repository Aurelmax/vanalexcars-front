#!/bin/bash

echo "🚀 Test d'import de véhicules MINI..."
echo ""

curl -X POST http://localhost:3001/api/scrape-and-import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer vanalexcars-secret-key-2024" \
  -d '{"brand": "mini", "maxPages": 1, "downloadImages": false}' \
  2>&1 | jq '.' || cat

echo ""
echo "✅ Import terminé"
echo ""
echo "📊 Consultez les logs du serveur frontend pour plus de détails"
