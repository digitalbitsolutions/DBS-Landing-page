# DBS Project Docs

Documentacion operativa y tecnica del proyecto `DBS / Digital Bit Solutions`.

## 1. Vision general

Este repositorio contiene:

- una landing publica moderna para captacion de leads
- un mini CMS/dashboard interno
- integracion con Supabase para contenido, leads y operaciones
- soporte multidioma base (`es`, `en`, `ca`, `qu`)
- traduccion asistida con Groq
- automatizacion de emails de leads con Supabase Edge Functions + Resend

El proyecto esta pensado para una sola web, no multi-tenant.

## 2. Stack

- `Next.js 16` con App Router
- `React 19`
- `TypeScript`
- `Tailwind CSS v4`
- `shadcn/ui`
- `react-hook-form`
- `zod`
- `Supabase`
- `next-intl`
- `GSAP`
- `next-seo`
- `Vitest + Testing Library`

## 3. Superficies del producto

### Landing publica

La landing vive principalmente en:

- `src/app/[locale]/page.tsx`
- `src/components/sections/*`
- `src/components/layout/*`

Bloques principales:

- `SiteHeader`
- `HeroSplit`
- `HorizontalTicker`
- `ServicesGrid`
- `FeaturedProjects`
- `ProcessSteps`
- `CallBookingBanner`
- `ContactPanel`
- `SiteFooter`

### Dashboard interno

El panel vive en:

- `src/app/dashboard`

Secciones:

- `/dashboard`
- `/dashboard/leads`
- `/dashboard/projects`
- `/dashboard/services`
- `/dashboard/settings`

## 4. Estructura del repositorio

```txt
src/
  app/
    (marketing)/
    [locale]/
    api/
    dashboard/
    login/
    _panel-entry/
  components/
    cards/
    dashboard/
    forms/
    layout/
    motion/
    sections/
    seo/
    ui/
  lib/
    data/
    email-automation.ts
    env.ts
    groq.ts
    i18n.ts
    seo.ts
    supabase/
    validators/
supabase/
  functions/
  migrations/
  sql/
  seed.sql
messages/
```

## 5. Rutas importantes

### Publicas

- `/`
- `/{locale}`
- `/api/contact`

### Internas

- `/dashboard`
- `/dashboard/*`

### Acceso admin

La ruta publica del login admin no se expone desde la landing.

Se configura por entorno:

- `NEXT_PUBLIC_ADMIN_LOGIN_PATH`

Internamente se reescribe a:

- `/_panel-entry`

Archivos implicados:

- `src/lib/admin.ts`
- `middleware.ts`
- `src/app/_panel-entry/page.tsx`
- `src/app/login/page.tsx`

## 6. Variables de entorno

Variables de Next:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY`
- `NEXT_PUBLIC_GROQ_API`
- `NEXT_PUBLIC_ADMIN_LOGIN_PATH`

Notas:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` son compatibles entre si; basta una.
- `GROQ_API_KEY` es la opcion recomendada para traducciones server-side.
- `NEXT_PUBLIC_GROQ_API` solo se mantiene como compatibilidad temporal.
- `SUPABASE_SERVICE_ROLE_KEY` es necesaria para varias operaciones reales del dashboard y para la Edge Function de email automation.

## 7. Modelo de datos

### `site_settings`

Configuracion global del sitio:

- branding y hero
- SEO
- contacto
- idiomas activos y principal
- modelo Groq
- traducciones planas en `translations`
- automatizacion de emails

Campos clave de automatizacion:

- `lead_notification_enabled`
- `autoresponder_enabled`
- `internal_notification_subject`
- `autoresponder_subject`
- `autoresponder_body`
- `resend_from_name`
- `resend_from_email`

### `services`

Servicios publicados en landing:

- `title`
- `slug`
- `description`
- `icon`
- `order_index`
- `active`
- `translations`

### `projects`

Casos/proyectos del portfolio:

- `title`
- `slug`
- `short_description`
- `image_url`
- `gallery`
- `tags`
- `stack`
- `repo_url`
- `live_url`
- `featured`
- `order_index`
- `translations`

### `leads`

Leads capturados desde la landing:

- `name`
- `email`
- `company`
- `message`
- `locale`
- `source`
- `status`
- `notification_sent_at`
- `autoresponder_sent_at`
- `followup_reminder_sent_at`
- `email_last_error`
- `metadata`

## 8. Flujos principales

### Captacion de lead

1. El usuario completa `LeadForm`
2. `POST /api/contact` valida con zod
3. Se inserta el lead en Supabase
4. El webhook/automatizacion de Supabase llama a la Edge Function
5. La function:
   - envia aviso interno a `contact_email`
   - envia autorespuesta al lead
   - actualiza timestamps y errores del lead

Archivos clave:

- `src/components/forms/LeadForm.tsx`
- `src/app/api/contact/route.ts`
- `src/lib/supabase/queries.ts`
- `supabase/functions/lead-email-automation/index.ts`
- `supabase/sql/lead_email_automation.sql`

### Edicion de contenido

1. El usuario entra al dashboard
2. Las pantallas leen desde `getDashboardData()`
3. Las mutaciones pasan por `src/app/dashboard/actions.ts`
4. `queries.ts` compone payloads y normaliza datos
5. Se invalida cache con `revalidatePath`

### Traducciones

1. Desde settings/services/projects se dispara una accion de traduccion
2. El servidor llama a Groq
3. Las traducciones se guardan en `translations`
4. La landing localizada resuelve contenido por locale

Archivos clave:

- `src/lib/groq.ts`
- `src/lib/data/marketing-copy.ts`
- `src/app/dashboard/actions.ts`
- `src/app/[locale]/page.tsx`

## 9. i18n

Idiomas habilitados:

- `es`
- `en`
- `ca`
- `qu`

La app usa:

- `next-intl`
- mensajes JSON en `messages/`
- rutas localizadas `/{locale}`

La mayor parte del contenido editable se resuelve desde Supabase y sus `translations`, no solo desde ficheros estáticos.

## 10. Seguridad y acceso

Puntos relevantes:

- el enlace al acceso admin se ha quitado de la landing
- la ruta admin publica se define por entorno
- el dashboard requiere sesion valida
- en local puede existir acceso admin de desarrollo con cookie
- el dashboard puede quedar en modo read-only si falta `SUPABASE_SERVICE_ROLE_KEY`

Archivos clave:

- `src/lib/auth.ts`
- `src/lib/admin.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`
- `middleware.ts`

## 11. Supabase

Migraciones actuales importantes:

- `supabase/migrations/202603130001_init_mini_cms.sql`
- `supabase/migrations/202603130002_add_hero_badge.sql`
- `supabase/migrations/202603130003_add_seo_settings.sql`
- `supabase/migrations/202603130004_add_i18n_settings.sql`
- `supabase/migrations/202603140001_add_groq_translations.sql`
- `supabase/migrations/202603140002_add_lead_email_automation.sql`

Semilla:

- `supabase/seed.sql`

Automation SQL:

- `supabase/sql/lead_email_automation.sql`

Edge Function:

- `supabase/functions/lead-email-automation/index.ts`

## 12. Desarrollo local

Comandos utiles:

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

Notas:

- la landing puede funcionar con contenido fallback si Supabase publico no esta listo
- el dashboard en local puede entrar en solo lectura segun entorno
- el comportamiento de traducciones y email depende de claves/secretos reales

## 13. Testing

La suite actual cubre:

- validadores
- helpers de Supabase
- helpers de email automation
- partes criticas del formulario de lead
- partes clave del dashboard
- settings y traducciones

Comandos:

```bash
npm run test
npm run test:watch
```

## 14. Deploy y operacion

### Vercel

Configurar al menos:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY`
- `NEXT_PUBLIC_ADMIN_LOGIN_PATH`

### Supabase Functions

Configurar secretos:

- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Desplegar:

```bash
supabase functions deploy lead-email-automation --no-verify-jwt
```

Aplicar despues:

- `supabase/sql/lead_email_automation.sql`

Importante:

- sustituir `YOUR_PROJECT_REF` en el SQL antes de ejecutarlo
- verificar dominio/remitente en Resend

## 15. Convenciones para tocar codigo

- usar Server Components por defecto
- usar `use client` solo donde haga falta
- no montar backend separado
- mantener la capa de datos concentrada en `queries.ts` cuando sea razonable
- no duplicar validaciones fuera de `zod` sin motivo
- preservar compatibilidad con Supabase y el fallback local

## 16. Siguientes fases sugeridas

- auth por roles real
- uploads de proyectos
- preview de cambios
- panel de traduccion mas granular
- analitica y embudos
- automatizaciones adicionales de leads
- hardening adicional del acceso admin
