# AGENTS.md

Guia operativa para agentes que trabajen en `C:\digitalbitsolutions\landing`.

## Objetivo del proyecto

Este repositorio contiene la landing de Digital Bit Solutions junto con un mini CMS interno.
La app esta construida con `Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Supabase + shadcn/ui`.

Hay dos superficies principales:

- Landing publica en `src/app/(marketing)`
- Dashboard autenticado en `src/app/dashboard`

## Stack y herramientas

- Framework: `Next.js` con App Router
- UI: `React 19`, `Tailwind CSS v4`, componentes en `src/components/ui`
- Formularios: `react-hook-form` + `zod`
- Backend/BBDD/Auth: `Supabase`
- Lint: `ESLint`

## Comandos utiles

```bash
npm install
npm run dev
npm run lint
npm run build
```

Usa `npm run lint` como validacion minima tras cambios de codigo.
Usa `npm run build` cuando toques rutas, metadata, middleware, tipos o integracion con Supabase.

## Estructura del repo

```txt
src/
  app/
    (marketing)/        landing publica
    api/contact/        endpoint publico para leads
    dashboard/          CMS interno y server actions
    login/              acceso por Supabase Auth
  components/
    dashboard/          piezas del panel interno
    forms/              formularios cliente
    layout/             header/footer
    sections/           bloques de la landing
    ui/                 primitives tipo shadcn
  lib/
    data/               lectura de datos y fallbacks
    supabase/           clientes SSR, middleware y admin
    validators/         schemas zod
    auth.ts             helpers de acceso y proteccion
supabase/
  migrations/           esquema SQL base
```

## Convenciones del proyecto

- Usa imports con alias `@/*` en lugar de rutas relativas largas.
- Manten `strict` TypeScript limpio; no introduzcas `any` sin necesidad real.
- Reutiliza componentes de `src/components/ui` antes de crear primitives nuevas.
- Los textos del producto estan en espanol; conserva el tono y el idioma salvo que el cambio pida otra cosa.
- Sigue el patron existente:
  - Server Components por defecto en rutas
  - `"use client"` solo cuando haga falta estado, efectos o eventos del navegador
  - validacion con `zod` en `src/lib/validators`
  - formularios con `react-hook-form`
- Para cambios visuales, respeta la direccion actual:
  - tipografias definidas en `src/app/layout.tsx`
  - tokens y estilos globales en `src/app/globals.css`

## Supabase y datos

- La app debe seguir funcionando sin Supabase publico configurado:
  - `src/lib/data/site.ts` usa contenido fallback para la landing
- No elimines ese comportamiento fallback salvo instruccion explicita.
- Variables esperadas:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- No hardcodees secretos ni modifiques `.env.local` salvo que el usuario lo pida.
- Si cambias esquema o queries, revisa tambien:
  - `src/lib/supabase/database.types.ts`
  - `supabase/migrations/`

## Auth y rutas protegidas

- La proteccion del dashboard pasa por:
  - `middleware.ts`
  - `src/lib/supabase/middleware.ts`
  - `src/lib/auth.ts`
- Si cambias acceso o sesiones, valida al menos login, logout y acceso a `/dashboard`.

## Server actions y APIs

- Las mutaciones del dashboard viven en `src/app/dashboard/actions.ts`.
- El formulario publico usa `src/app/api/contact/route.ts`.
- Antes de mover logica entre cliente y servidor, revisa el patron actual de validacion y `revalidatePath`.

## Criterios para editar

- Haz cambios pequenos y coherentes con la arquitectura existente.
- No renombres carpetas ni muevas rutas del App Router sin necesidad clara.
- No sustituyas componentes UI existentes por soluciones paralelas.
- Evita dependencias nuevas si el stack actual ya cubre el caso.
- Respeta cambios locales del usuario; el arbol puede estar sucio.

## Checklist antes de cerrar trabajo

1. Ejecutar `npm run lint`.
2. Ejecutar `npm run build` si el cambio afecta rutas, tipos, auth, metadata o Supabase.
3. Revisar que no se rompa la landing sin variables de entorno.
4. Si se toco el dashboard, comprobar el flujo autenticado.
5. Resumir claramente que se cambio y que no se pudo verificar.

## Si necesitas contexto rapido

Empieza por estos archivos:

- `README.md`
- `package.json`
- `src/lib/data/site.ts`
- `src/app/(marketing)/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/actions.ts`
- `src/lib/env.ts`
