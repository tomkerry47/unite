# CRM Project - Unite Flooring Hello App

## Introduction 
This is a minimal Next.js 15 app that connects to Azure Database for PostgreSQL and shows simple counts, serving as a foundation for the Unite Flooring CRM system deployment and infrastructure setup.

**Status:** ✅ Ready for GitHub Actions deployment

## Getting Started
# Unite Hello (Next.js + Azure App Service)

A minimal Next.js 14 app that connects to Azure Database for PostgreSQL and shows simple counts.

## Local development

1. Copy env example:
   - cp .env.example .env.local
2. Set `DATABASE_URL` including password and `sslmode=require`.
3. Optionally set `PGSSLROOTCERT` to an absolute path to `certs/DigiCertGlobalRootCA.crt.pem`.
4. Optionally set `NEXT_PUBLIC_BASE_URL=http://localhost:3000` for SSR fetch.
5. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000

## API
- GET /api/db-stats → { connected, tablesCount, schemasCount, message? }

## Azure App Service deployment (Linux)

Assumptions:
- Azure CLI logged in: `az login`
- You have an Azure Database for PostgreSQL server and admin password

Steps:
1. Variables (adjust names):
   - RG=unite-rg
   - PLAN=unite-plan
   - APP=unite-hello-web
   - LOCATION=uksouth
2. Create infra:
   - az group create -n $RG -l $LOCATION
   - az appservice plan create -g $RG -n $PLAN --is-linux --sku P1v3
   - az webapp create -g $RG -p $PLAN -n $APP -r "node|20-lts"
3. Configure settings:
   - az webapp config appsettings set -g $RG -n $APP --settings \
     DATABASE_URL="postgres://uniteadmin:<password>@unite-flooring-db.postgres.database.azure.com:5432/postgres?sslmode=require" \
     NEXT_PUBLIC_BASE_URL="https://$APP.azurewebsites.net" \
     PGSSLROOTCERT="/home/site/wwwroot/certs/DigiCertGlobalRootCA.crt.pem"
4. Deploy code:
   - npm install && npm run build
   - zip -r deploy.zip . -x "node_modules/*" -x ".next/cache/*"
   - az webapp deployment source config-zip -g $RG -n $APP --src deploy.zip

If you prefer Oryx/zipdeploy from a repo CI, the above still applies for app settings.

## Notes
- This project uses Next.js standalone output for faster starts on App Service.
- For Azure Postgres, ensure server firewall allows Azure services or the Web App outbound IPs.
