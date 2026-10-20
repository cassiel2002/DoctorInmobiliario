/**
 * ── PLANILLA CRM DE AUGUSTO: receptor de formularios ──
 *
 * Se instala en la planilla de Google de Augusto (Extensiones → Apps Script).
 * Recibe cada formulario desde la función de Cloudflare, agrega una fila en la
 * pestaña "Leads" y le avisa por correo.
 *
 * Propiedades del script (Configuración del proyecto → Propiedades del script):
 *   WEBHOOK_SECRET  la misma clave que SHEETS_WEBHOOK_SECRET en Cloudflare
 *   NOTIFY_EMAIL    correo donde Augusto recibe el aviso de cada consulta
 *
 * Las columnas comerciales (etapa, próxima acción, resultado) las completa
 * Augusto a mano: este script nunca las toca.
 */

var SHEET_NAME = 'Leads';

// Orden de columnas. Las últimas las completa Augusto.
var COLUMNS = [
  'lead_id', 'received_at', 'form_id', 'page',
  'name', 'email', 'whatsapp', 'country', 'country_cf',
  'interest', 'property_id', 'move_in', 'budget_range', 'bedrooms', 'pets', 'guide', 'message',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'landing_page', 'referrer',
  // ── Completa Augusto ──
  'stage', 'qualified', 'last_contact', 'next_action', 'next_action_date', 'meeting', 'outcome', 'lost_reason', 'notes',
];

function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond({ ok: false, error: 'invalid_json' });
  }

  if (!payload || payload.secret !== props.getProperty('WEBHOOK_SECRET')) {
    return respond({ ok: false, error: 'unauthorized' });
  }

  var row = payload.row || {};
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet();
    sheet.appendRow(COLUMNS.map(function (key) {
      if (key === 'stage') return 'New';
      return row[key] !== undefined ? row[key] : '';
    }));
  } finally {
    lock.releaseLock();
  }

  notify(props.getProperty('NOTIFY_EMAIL'), row);
  return respond({ ok: true });
}

function getSheet() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function notify(email, row) {
  if (!email) return;
  var kind = row.form_id === 'guide_download' ? 'Descarga de guía' : 'Consulta de renta';
  var lines = [
    kind + ' — ' + (row.name || ''),
    '',
    'Correo: ' + (row.email || '-'),
    'WhatsApp: ' + (row.whatsapp || '-'),
    'País: ' + (row.country || '-'),
    'Mudanza: ' + (row.move_in || '-'),
    'Presupuesto: ' + (row.budget_range || '-'),
    'Propiedad: ' + (row.property_id || '-'),
    'Mensaje: ' + (row.message || '-'),
    '',
    'Origen: ' + [row.utm_source, row.utm_medium, row.utm_campaign].filter(String).join(' / '),
    'ID: ' + row.lead_id,
    '',
    'Acordate de completar la etapa y la próxima acción en la planilla.',
  ];
  MailApp.sendEmail(email, '[El Doctor] ' + kind + ': ' + (row.name || 'nueva consulta'), lines.join('\n'));
}

function respond(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
