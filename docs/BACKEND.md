# Backend de formularios y medición del funnel

El sitio es estático (`next build` genera `out/`). Los formularios se reciben en una
**función de Cloudflare** que guarda cada consulta en una **planilla de Google de
Augusto** (su CRM) y le avisa por correo. No hay servidor que mantener.

```
Formulario (React) ──POST /api/lead──▶ functions/api/lead.js (Cloudflare)
                                         │ valida, filtra bots, crea lead_id
                                         ▼
                              Apps Script en la planilla de Augusto
                                         │ agrega fila en "Leads" + correo
                                         ▼
                 respuesta { ok, lead_id } ──▶ el sitio dispara generate_lead en GA4
```

El mismo `lead_id` queda en GA4 y en la planilla: así se une la parte web del
funnel (de dónde vino, qué hizo) con la comercial (si se calificó, si cerró).

## Qué mide cada herramienta

| Etapa | Dónde se ve | Evento o columna |
| --- | --- | --- |
| Alcance, visitas al perfil, clics en el link | Instagram Insights | — |
| Llegada al sitio y origen | GA4 | `page_view` + UTMs |
| Clics en botones | GA4 | `cta_click` (`cta_id`, `cta_location`) |
| Interés en una propiedad | GA4 | `property_click` (`property_id`) |
| WhatsApp | GA4 | `whatsapp_click` (`cta_location`) |
| Empezó el formulario | GA4 | `form_start` (`form_id`) |
| Consulta guardada | GA4 + planilla | `generate_lead` (`form_id`, `lead_id`) / fila nueva |
| Consulta por WhatsApp | Planilla (a mano) | fila con `form_id` = `whatsapp_manual` y el `Ref:` del mensaje en `ref` |
| Calificado, reunión, cierre | Planilla | columnas `stage`, `qualified`, `meeting`, `outcome` (las completa Augusto) |

Los eventos se envían a GA4 con `gtag('event')` desde `lib/track.js`
(`components/Analytics.jsx` carga GA4). Nunca se manda nombre, correo ni teléfono a GA4.

**WhatsApp es la vía principal y no pasa por el servidor.** Para que el funnel
cierre, Augusto anota cada consulta de WhatsApp en la planilla: `form_id` =
`whatsapp_manual`, `ref` = el código `Ref:` que trae el mensaje (por ejemplo
`IG-BIO-HALO`), y el resto de las columnas que sepa.

## Puesta en marcha (una sola vez)

### 1. Planilla y Apps Script (desde la cuenta de Google de Augusto)

1. Crear una planilla nueva, por ejemplo "CRM El Doctor".
2. Extensiones → Apps Script. Pegar el contenido de
   `integrations/google-apps-script/Code.gs` y guardar.
   Elegir `configurarCRM` en el menú de funciones y tocar **Ejecutar** (autorizar
   los permisos). Crea la pestaña "Leads" con listas desplegables, la pestaña
   "Resumen" y pone la zona horaria de Tulum. Se puede repetir sin perder datos.
3. Configuración del proyecto → Propiedades del script → agregar:
   - `WEBHOOK_SECRET`: una clave larga al azar (por ejemplo, generada con
     `openssl rand -hex 32`). No la escribas en el código ni en el chat.
   - `NOTIFY_EMAIL`: el correo de Augusto.
4. Implementar → Nueva implementación → Tipo "Aplicación web":
   - Ejecutar como: **Yo** (la cuenta de Augusto).
   - Quién tiene acceso: **Cualquier usuario**. Es necesario para que Cloudflare
     pueda llamarla; la protege `WEBHOOK_SECRET`.
5. Autorizar los permisos y copiar la URL que termina en `/exec`.

### 2. Cloudflare Pages

1. Conectar el repositorio de GitHub en Cloudflare Pages.
   - Comando de build: `pnpm build`
   - Carpeta de salida: `out`
   - La carpeta `functions/` se publica sola como funciones.
2. Settings → Variables and secrets (en Production y en Preview):
   - `SHEETS_WEBHOOK_URL` (secreto): la URL `/exec` del paso 1.
   - `SHEETS_WEBHOOK_SECRET` (secreto): la misma clave del paso 1.
   - `ALLOWED_ORIGINS`: `https://www.eldoctorinmobiliario.com,https://eldoctorinmobiliario.com`
     (más la URL de Preview de Pages si querés probar ahí).
   - `NEXT_PUBLIC_GA_ID` (variable común, no secreto): el ID de medición de GA4
     (`G-XXXXXXX`). Se lee **en el build**: después de cargarla hay que volver a
     desplegar. Sin ella, el sitio no carga GA4 ni muestra el aviso de cookies.
3. Seguridad → WAF → crear una regla de límite de velocidad para `/api/lead`
   (por ejemplo, 5 pedidos por minuto por IP). El plan gratuito incluye una.

### 3. Antes de publicar (pendiente)

- **Cloudflare Turnstile** (anti-bots gratuito): crear el widget, agregar el
  script y el componente en los formularios, y cargar `TURNSTILE_SECRET_KEY`. La
  función ya lo verifica cuando la variable existe.
- **Aviso de privacidad**: `/privacy` es un borrador. El texto final lo tiene que
  revisar un abogado.
- **GA4** (ya integrado, falta la cuenta): crear la propiedad en
  analytics.google.com → flujo de datos web con el dominio → copiar el ID `G-…` a
  `NEXT_PUBLIC_GA_ID`. Los eventos llegan solos; en GA4 → Administrar → Eventos
  clave, marcar `generate_lead` (y `whatsapp_click`) cuando aparezcan.
  Consentimiento (Consent Mode v2): publicidad siempre denegada; analítica denegada
  hasta aceptar en el EEE, Reino Unido y Suiza, y activa en el resto salvo que la
  persona la rechace en el aviso. Si más adelante se usa Google Tag Manager o el
  píxel de Meta, se agregan en `components/Analytics.jsx`.

## Probar

```bash
pnpm test     # tests de la función (sin Cloudflare ni Google)
pnpm build    # genera out/
```

Prueba completa en Cloudflare: enviar una consulta desde la URL de Preview y
confirmar que llega la fila a la planilla y el correo a Augusto, con el mismo
`lead_id` que aparece en GA4 (DebugView).

En `pnpm dev` no existe `/api/lead`: el formulario muestra el error y ofrece
WhatsApp. Es el comportamiento esperado.

## Si algo falla

| Síntoma | Causa probable |
| --- | --- |
| `forbidden_origin` (403) | Falta el dominio en `ALLOWED_ORIGINS` |
| `not_configured` (500) | Faltan `SHEETS_WEBHOOK_URL` o `SHEETS_WEBHOOK_SECRET` |
| `storage_failed` (502) | Clave distinta entre Cloudflare y Apps Script, o la implementación no es "Cualquier usuario" |
| Llega la fila pero no el correo | Falta `NOTIFY_EMAIL` o no se autorizó MailApp |
| Cambié `Code.gs` y no se nota | Apps Script sirve la versión implementada: Implementar → Administrar implementaciones → editar → Nueva versión (la URL `/exec` no cambia) |
| GA4 no recibe nada | Falta `NEXT_PUBLIC_GA_ID` o no se volvió a desplegar después de cargarla; revisar con GA4 → DebugView |
