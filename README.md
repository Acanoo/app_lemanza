# Lemanza Motores

Marketplace automotriz para Guatemala construido con Next.js 15, TypeScript, TailwindCSS, componentes estilo Shadcn/UI, Framer Motion, Prisma ORM y PostgreSQL.

## Funcionalidades

- Inicio con hero visual, buscador rápido, nuevos ingresos, beneficios y CTA a WhatsApp.
- Catálogo con filtros avanzados por tipo, marca, transmisión, ubicación, precio, año, kilometraje, combustible, tracción y estado.
- Detalle de vehículo con breadcrumb, galería animada, contador, soporte de vista 360, ficha técnica, WhatsApp, cotización y calculadora de cuotas.
- Formularios de cotización y newsletter con Zod, React Hook Form, API Routes y persistencia en PostgreSQL.
- Calculadora financiera con amortización real, tabla de interés/capital/saldo y guardado de simulaciones.
- Páginas de sucursales, beneficios, servicios y contacto.
- Panel admin protegido con HTTP Basic Auth y métricas iniciales.
- Servicios preparados para MarketCheck Cars API y CarAPI.
- Motor local de precios para Guatemala en `lib/pricing.ts`.
- Sitemap, robots y configuración lista para Vercel.

## Instalación

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Abre `http://localhost:3000`.

## Variables principales

Configura `.env` con:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `USD_TO_GTQ`
- `MARKETCHECK_API_KEY`
- `MARKETCHECK_BASE_URL`
- `CARAPI_TOKEN`
- `CARAPI_BASE_URL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `QUOTE_NOTIFICATION_EMAIL`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`

## Admin

Ruta: `/admin`

El panel usa autenticación HTTP Basic con `ADMIN_EMAIL` y `ADMIN_PASSWORD`. Para producción, se recomienda sustituirlo por Auth.js, Clerk o el proveedor corporativo de identidad.

## Deploy en Vercel

El proyecto incluye `vercel.json` y `.env.vercel.example`.

1. Crea una base PostgreSQL compatible con Vercel, Neon, Supabase o Vercel Postgres.
2. Importa el repo en Vercel.
3. Agrega las variables de `.env.vercel.example` en Project Settings > Environment Variables.
4. Usa:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Framework Preset: Next.js
5. Ejecuta migraciones/seed contra la base remota:

```bash
npm run db:push
npm run db:seed
```

Si prefieres Vercel CLI:

```bash
vercel link
vercel env pull .env.local
vercel deploy
vercel deploy --prod
```

## Nota legal

El diseño y la estructura funcional son propios para Lemanza Motores. No se copian logos, marca ni assets protegidos de terceros.
