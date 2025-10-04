#!/usr/bin/env bash
set -euo pipefail

# Enhanced deployment script for Azure App Service
RG=${RG:-unite-flooring-rg}
APP=${APP:-unite-hello-web}

echo "🔧 Setting up Node.js environment..."
# Ensure we're using Node 20
if command -v nvm &> /dev/null; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm use 20 || nvm install 20
fi

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building Next.js app (standalone)..."
npm run build

echo "📄 Creating deployment archive..."
# Create a clean deployment package
rm -f deploy.zip
zip -r deploy.zip . \
    -x "node_modules/*" \
    -x ".next/cache/*" \
    -x ".git/*" \
    -x "*.log" \
    -x ".env.local" \
    >/dev/null

echo "🚀 Deploying to Azure App Service: $APP..."
az webapp deployment source config-zip \
    --resource-group "$RG" \
    --name "$APP" \
    --src deploy.zip \
    --timeout 600

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://$APP.azurewebsites.net"
echo ""
echo "📊 Testing the deployment..."
sleep 10  # Give the app a moment to start

# Test the API endpoint
if curl -f -s "https://$APP.azurewebsites.net/api/db-stats" >/dev/null; then
    echo "✅ API endpoint is responding"
    echo "📈 Database stats:"
    curl -s "https://$APP.azurewebsites.net/api/db-stats" | jq . 2>/dev/null || curl -s "https://$APP.azurewebsites.net/api/db-stats"
else
    echo "❌ API endpoint not responding yet. Check logs:"
    echo "   az webapp log tail -g $RG -n $APP"
fi