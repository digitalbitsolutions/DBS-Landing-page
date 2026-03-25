# Manual de estructura y deploy al host

Este documento describe:

- la estructura principal del proyecto
- el flujo correcto de despliegue al host compartido con `CloudLinux Node.js Selector`
- las decisiones operativas que siempre se deben consultar al humano antes de conectar al servidor

## 1. Regla operativa obligatoria

Antes de cualquier despliegue al host, el agente o la persona operadora debe consultar al humano:

- la ubicacion exacta de la llave privada SSH
- la ubicacion exacta de la llave publica SSH
- la passphrase de la llave privada, si existe
- el usuario SSH
- la IP o hostname del servidor
- el puerto SSH/SFTP

No se debe asumir:

- que las llaves estan en una ruta fija
- que la passphrase es la misma que en un despliegue anterior
- que el puerto SSH es `22`

Si el humano no ha confirmado esos datos en la sesion actual, hay que pedirlos.

## 2. Estructura principal del proyecto

Raiz del repositorio:

```txt
docs/                 documentacion operativa y tecnica
messages/             archivos de traduccion
public/               assets publicos
scripts/              utilidades locales
src/                  aplicacion Next.js
supabase/             migraciones, SQL y funciones relacionadas
deploy.sh             helper historico para despliegues con shell
unzip_helper.php      helper historico para descomprimir dist.zip en hosting
```

Estructura relevante dentro de `src/`:

```txt
src/
  app/
    (marketing)/      landing publica
    dashboard/        panel interno
    api/              endpoints
    login/            login publico
    internal-login/   login interno real
  components/         componentes visuales y formularios
  lib/
    admin.ts          rutas del admin
    env.ts            validacion de variables de entorno
    i18n.ts           locales y prefijos
    supabase/         clientes y middleware de Supabase
```

## 3. Tipo de despliegue usado en este host

Este host no usa `Vercel`.

El despliegue real de produccion se hace sobre:

- hosting compartido con `CloudLinux Node.js Selector`
- app Node asociada al dominio principal
- `Passenger` como runtime del proceso Node

Rutas remotas importantes:

```txt
/home/digitalbit/public_html
/home/digitalbit/nodeapps/digitalbitsolutions
/home/digitalbit/logs/digitalbitsolutions-nodejs.log
```

Comportamiento observado:

- `public_html` es el document root del dominio
- `nodeapps/digitalbitsolutions` es la raiz real de la app Node
- `public_html/.htaccess` debe contener la configuracion de Passenger creada por CloudLinux
- no se debe mezclar esa configuracion con proxies manuales a `127.0.0.1:3000`

## 4. Requisitos previos para desplegar

Antes de subir una version nueva, confirmar:

1. acceso SFTP/SSH funcional
2. app Node ya creada en el panel del hosting
3. `Application root` configurado como `nodeapps/digitalbitsolutions`
4. `Application startup file` configurado como `server.js`
5. `Application mode` configurado como `Production`

Variables de entorno minimas:

```env
NODE_ENV=production
NEXT_PUBLIC_ADMIN_LOGIN_PATH=/nucleo-7k9x-portal
```

Variables de Supabase:

- si no existen valores reales, no deben dejarse vacias
- si aun no hay proyecto Supabase, es mejor eliminarlas del panel

Variables de Supabase a cargar solo cuando existan valores reales:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
```

Importante:

- valores vacios o placeholders provocan errores `500`
- si no hay Supabase real, la landing puede arrancar sin esas variables

## 5. Flujo correcto de build local

Desde la raiz del proyecto:

```bash
npm ci
npm run lint
npm run build
```

El proyecto usa:

- `Next.js 16`
- `output: "standalone"` en `next.config.ts`

Tras el build, los artefactos relevantes son:

```txt
.next/
.next/standalone/server.js
.next/standalone/package.json
.next/standalone/node_modules/
.next/server/
.next/static/
.next/node_modules/
public/
```

## 6. Empaquetado correcto para el host

Para este host, la carpeta remota `nodeapps/digitalbitsolutions` debe contener como minimo:

```txt
server.js
package.json
public/
.next/
```

Y dentro de `.next/` deben existir:

```txt
BUILD_ID
app-path-routes-manifest.json
build-manifest.json
export-marker.json
fallback-build-manifest.json
images-manifest.json
package.json
prerender-manifest.json
required-server-files.json
routes-manifest.json
server/
static/
node_modules/
```

Importante:

- `server/` y `static/` no son suficientes por si solos
- `BUILD_ID`, manifiestos y `.next/node_modules/` tambien son necesarios

## 7. Como se sube al host

### 7.1 Confirmar credenciales con el humano

Antes de conectar:

1. pedir ruta de llave privada
2. pedir ruta de llave publica
3. pedir passphrase si aplica
4. pedir host/IP
5. pedir usuario
6. pedir puerto SSH/SFTP

### 7.2 Validar acceso

Probar autenticacion al servidor.

Si el hosting no permite shell interactivo, probar al menos:

- `SFTP`
- lectura de `/home/<usuario>/public_html`
- lectura de `/home/<usuario>/nodeapps/<app>`

### 7.3 Preparar el directorio de despliegue

Construir una carpeta temporal local con:

- `server.js` desde `.next/standalone/server.js`
- `package.json` desde `.next/standalone/package.json`
- `public/`
- `.next/server/`
- `.next/static/`
- todos los ficheros raiz de `.next/`
- `.next/node_modules/`

### 7.4 Subir a la raiz real de la app Node

Subir por SFTP a:

```txt
/home/digitalbit/nodeapps/digitalbitsolutions
```

No desplegar la version activa dentro de `public_html` como flujo principal.

`public_html` debe quedar solo como punto de entrada del dominio con el `.htaccess` de Passenger.

### 7.5 Gestionar `node_modules`

Regla especifica de CloudLinux Node.js Selector:

- no debe mantenerse una carpeta `node_modules` manual en la raiz de la app antes de ejecutar `Run NPM Install`

Flujo recomendado:

1. subir app a `nodeapps/digitalbitsolutions`
2. si existe una carpeta `node_modules` subida manualmente, eliminarla
3. ejecutar `Run NPM Install` desde el panel
4. pulsar `Restart`

## 8. Configuracion correcta de `public_html/.htaccess`

El archivo debe conservar el bloque generado por CloudLinux Passenger:

```apache
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home/digitalbit/nodeapps/digitalbitsolutions"
PassengerBaseURI "/"
PassengerNodejs "/home/digitalbit/nodevenv/nodeapps/digitalbitsolutions/22/bin/node"
PassengerAppType node
PassengerStartupFile server.js
PassengerAppLogFile "/home/digitalbit/logs/digitalbitsolutions-nodejs.log"
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END
```

No debe incluir:

```apache
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```

Ese proxy manual entra en conflicto con Passenger y puede provocar:

- loops de redireccion
- respuestas a `/es/503.shtml`
- errores `500` o `502`

## 9. Verificaciones post deploy

Tras cada despliegue:

1. abrir `https://digitalbitsolutions.com/`
2. abrir `https://digitalbitsolutions.com/nucleo-7k9x-portal`
3. confirmar que el panel carga
4. confirmar que la landing publica carga
5. si hay error, revisar:
   - `/home/digitalbit/logs/digitalbitsolutions-nodejs.log`

## 10. Errores reales encontrados en este entorno

### Error: `Directory "public_html" not allowed`

Causa:

- CloudLinux no permite usar `public_html` como `Application root`

Solucion:

- usar `nodeapps/digitalbitsolutions`

### Error: `Could not find a production build in the './.next' directory`

Causa:

- faltaban `BUILD_ID` y manifiestos raiz de `.next/`

Solucion:

- subir tambien los ficheros raiz de `.next/`, no solo `server/` y `static/`

### Error: `Failed to load external module next-seo-...`

Causa:

- faltaba `.next/node_modules/`

Solucion:

- subir `.next/node_modules/` al servidor

### Error `500` por `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Causa:

- variables vacias o invalidas en el panel Node.js

Solucion:

- eliminarlas hasta tener valores reales

### Loop de redireccion hacia `/es/503.shtml`

Causa:

- conflicto entre Passenger y el proxy manual viejo en `public_html/.htaccess`

Solucion:

- dejar solo la configuracion de Passenger

## 11. Recomendacion operativa final

Para futuros despliegues, este debe ser el orden:

1. pedir al humano ubicacion de llaves y passphrase
2. validar acceso SFTP
3. ejecutar `npm ci`
4. ejecutar `npm run lint`
5. ejecutar `npm run build`
6. preparar artefactos completos de `standalone + .next`
7. subir a `/home/digitalbit/nodeapps/digitalbitsolutions`
8. eliminar `node_modules` manual si se subio
9. ejecutar `Run NPM Install`
10. reiniciar la app en el panel
11. revisar landing, admin y log

## 12. Estado funcional sin Supabase

La landing puede arrancar sin Supabase si no existen variables invalidas.

Sin Supabase:

- la home puede renderizar
- el panel puede abrir en ciertas rutas
- login real, storage, CRUD y leads no quedan operativos

Con Supabase real:

- cargar `NEXT_PUBLIC_SUPABASE_URL`
- cargar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- cargar `SUPABASE_SERVICE_ROLE_KEY`
- reiniciar la app
