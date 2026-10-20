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
| Calificado, reunión, cierre | Planilla | columnas `stage`, `qualified`, `meeting`, `outcome` (las completa Augusto) |

Los eventos se envían al `dataLayer` desde `lib/track.js`. Nunca se manda nombre,
correo ni teléfono a GA4.

## Puesta en marcha (una sola vez)

### 1. Planilla y Apps Script (desde la cuenta de Google de Augusto)

1. Crear una planilla nueva, por ejemplo "CRM El Doctor".
2. Extensiones → Apps Script. Pegar el contenido de
   `integrations/google-apps-script/Code.gs` y guardar.
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
3. Seguridad → WAF → crear una regla de límite de velocidad para `/api/lead`
   (por ejemplo, 5 pedidos por minuto por IP). El plan gratuito incluye una.

### 3. Antes de publicar (pendiente)

- **Cloudflare Turnstile** (anti-bots gratuito): crear el widget, agregar el
  script y el componente en los formularios, y cargar `TURNSTILE_SECRET_KEY`. La
  función ya lo verifica cuando la variable existe.
- **Aviso de privacidad**: `/privacy` es un borrador. El texto final lo tiene que
  revisar un abogado.
- **Google Tag Manager + GA4**: instalar GTM y crear en GA4 los eventos de la tabla
  de arriba; marcar `generate_lead` como evento clave. Cargar los tags solo con
  consentimiento de cookies.

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
