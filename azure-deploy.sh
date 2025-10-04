#!/usr/bin/env bash
set -euo pipefail

RG=${RG:-unite-flooring-rg}
APP=${APP:-unite-hello-web}

echo "Building Next.js app (standalone)..."
npm install
npm run build

echo "Creating deployment archive..."
zip -r deploy.zip . -x "node_modules/*" -x ".next/cache/*" >/dev/null

echo "Deploying to Azure App Service $APP..."
az webapp deployment source config-zip -g "$RG" -n "$APP" --src deploy.zip -o table
echo "Done. Visit: https://$APP.azurewebsites.net"
