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
 * Primera vez: ejecutar configurarCRM() desde el editor (menú de funciones →
 * configurarCRM → Ejecutar). Crea las pestañas, las listas desplegables y el
 * resumen. Se puede volver a ejecutar sin perder datos.
 *
 * Las columnas comerciales (etapa, próxima acción, resultado) las completa
 * Augusto a mano: doPost nunca las toca (solo pone la etapa inicial).
 */

var SHEET_NAME = 'Leads';
var SUMMARY_NAME = 'Resumen';
var TIMEZONE = 'America/Cancun'; // Tulum

// Orden de columnas. Las últimas las completa Augusto.
var COLUMNS = [
  'lead_id', 'received_at', 'form_id', 'ref', 'page',
  'name', 'email', 'whatsapp', 'country', 'country_cf',
  'interest', 'property_id', 'move_in', 'budget_range', 'bedrooms', 'pets',
  'check_in', 'check_out', 'guests', 'occasion', 'guide', 'message',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'landing_page', 'referrer',
  // ── Completa Augusto ──
  'stage', 'qualified', 'last_contact', 'next_action', 'next_action_date', 'meeting', 'outcome', 'lost_reason', 'notes',
];

// Listas desplegables de las columnas que completa Augusto.
var STAGES = ['Nuevo', 'Contactado', 'Calificado', 'Reunión', 'Propuesta', 'Ganado', 'Perdido'];
var CHOICES = {
  stage: STAGES,
  qualified: ['Sí', 'No'],
  meeting: ['Agendada', 'Realizada', 'No asistió'],
  outcome: ['Abierto', 'Ganado', 'Perdido'],
  // whatsapp_manual: consultas que llegaron directo por WhatsApp y Augusto anota a mano.
  form_id: ['rental_inquiry', 'villa_inquiry', 'guide_download', 'whatsapp_manual'],
};
var DATE_COLUMNS = ['last_contact', 'next_action_date'];

function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond({ ok: false, error: 'invalid_json' });
  }

  if (!payload || !payload.secret || payload.secret !== props.getProperty('WEBHOOK_SECRET')) {
    return respond({ ok: false, error: 'unauthorized' });
  }

  var row = payload.row || {};
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return respond({ ok: false, error: 'busy' });
  try {
    var sheet = getSheet();
    sheet.appendRow(COLUMNS.map(function (key) { return cellValue(key, row); }));
  } finally {
    lock.releaseLock();
  }

  // El aviso por correo no debe hacer fallar el guardado (la fila ya está).
  try {
    notify(props.getProperty('NOTIFY_EMAIL'), row);
  } catch (err) {
    console.error('notify failed: ' + err);
  }
  return respond({ ok: true });
}

/** Valor de cada celda: fecha real, WhatsApp como texto y etapa inicial. */
function cellValue(key, row) {
  if (key === 'stage') return 'Nuevo';
  if (key === 'outcome') return 'Abierto';
  var value = row[key] !== undefined && row[key] !== null ? String(row[key]) : '';
  if (key === 'received_at' && value) {
    var date = new Date(value);
    return isNaN(date.getTime()) ? value : date;
  }
  // Sin el apóstrofo, Sheets convierte 5219841083283 en 5.21984E+12.
  if (key === 'whatsapp' && value && value.charAt(0) !== "'") return "'" + value;
  return value;
}

function getSheet() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    formatLeadsSheet(sheet);
  }
  return sheet;
}

/**
 * Ejecutar una vez desde el editor. Deja la planilla lista: zona horaria,
 * encabezados, formatos, listas desplegables y pestaña de resumen.
 */
function configurarCRM() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  book.setSpreadsheetTimeZone(TIMEZONE);
  var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME, 0);
  formatLeadsSheet(sheet);
  buildSummary(book);
  // La "Hoja 1" vacía que trae una planilla nueva sobra.
  ['Hoja 1', 'Sheet1'].forEach(function (name) {
    var blank = book.getSheetByName(name);
    if (blank && blank.getLastRow() === 0 && book.getSheets().length > 1) book.deleteSheet(blank);
  });
  try {
    SpreadsheetApp.getUi().alert('CRM listo. Probá enviando un formulario desde el sitio.');
  } catch (err) {
    console.log('CRM listo.'); // ejecutado fuera de la planilla: no hay ventana para el aviso
  }
}

function formatLeadsSheet(sheet) {
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
  var header = sheet.getRange(1, 1, 1, COLUMNS.length);
  header.setValues([COLUMNS]).setFontWeight('bold').setBackground('#0a0a0a').setFontColor('#c5a059');
  sheet.setFrozenRows(1);

  var rows = sheet.getMaxRows() - 1;
  sheet.getRange(2, col('received_at'), rows, 1).setNumberFormat('yyyy-mm-dd hh:mm');
  DATE_COLUMNS.forEach(function (key) {
    var range = sheet.getRange(2, col(key), rows, 1);
    range.setNumberFormat('yyyy-mm-dd');
    range.setDataValidation(SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(false).build());
  });
  Object.keys(CHOICES).forEach(function (key) {
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(CHOICES[key], true).setAllowInvalid(key === 'form_id').build();
    sheet.getRange(2, col(key), rows, 1).setDataValidation(rule);
  });

  // Columnas de Augusto con fondo suave, para distinguirlas de las automáticas.
  var firstManual = col('stage');
  sheet.getRange(1, firstManual, 1, COLUMNS.length - firstManual + 1).setBackground('#8a6e3a').setFontColor('#ffffff');

  // Filas "Nuevo" resaltadas: consultas que todavía nadie respondió.
  var stageLetter = letter(col('stage'));
  var newRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$' + stageLetter + '2="Nuevo"')
    .setBackground('#fff4d6')
    .setRanges([sheet.getRange(2, 1, rows, COLUMNS.length)])
    .build();
  sheet.setConditionalFormatRules([newRule]);

  if (!sheet.getFilter()) sheet.getRange(1, 1, sheet.getMaxRows(), COLUMNS.length).createFilter();
}

/** Pestaña "Resumen": conteos por formulario, origen, etapa y resultado. */
function buildSummary(book) {
  var sheet = book.getSheetByName(SUMMARY_NAME) || book.insertSheet(SUMMARY_NAME);
  sheet.clear();
  var range = "Leads!A2:" + letter(COLUMNS.length);
  var blocks = [
    ['Leads por formulario', 'form_id'],
    ['Leads por origen (utm_source)', 'utm_source'],
    ['Leads por campaña (utm_campaign)', 'utm_campaign'],
    ['Leads por etapa', 'stage'],
    ['Resultado', 'outcome'],
  ];
  sheet.getRange(1, 1).setValue('Total de leads').setFontWeight('bold');
  sheet.getRange(1, 2).setFormula('=COUNTA(Leads!A2:A)');
  var column = 1;
  blocks.forEach(function (block) {
    var c = 'Col' + col(block[1]);
    sheet.getRange(3, column).setValue(block[0]).setFontWeight('bold');
    sheet.getRange(4, column).setFormula(
      '=IFERROR(QUERY(' + range + ', "select ' + c + ', count(Col1) where Col1 is not null group by ' + c +
      ' order by count(Col1) desc label count(Col1) \'Leads\'", 0), "Sin datos")'
    );
    column += 3;
  });
}

function col(key) {
  var index = COLUMNS.indexOf(key);
  if (index === -1) throw new Error('Columna desconocida: ' + key);
  return index + 1;
}

function letter(n) {
  var s = '';
  while (n > 0) {
    var m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function notify(email, row) {
  if (!email) return;
  var kinds = { guide_download: 'Descarga de guía', rental_inquiry: 'Consulta de renta anual', villa_inquiry: 'Consulta de villa' };
  var kind = kinds[row.form_id] || 'Consulta';
  var lines = [
    kind + ' — ' + (row.name || ''),
    '',
    'Correo: ' + (row.email || '-'),
    'WhatsApp: ' + (String(row.whatsapp || '-').replace(/^'/, '')),
    row.form_id === 'villa_inquiry'
      ? 'Fechas: ' + (row.check_in || '-') + ' → ' + (row.check_out || '-') + ' · Huéspedes: ' + (row.guests || '-')
      : (row.form_id === 'rental_inquiry' ? 'Mudanza: ' + (row.move_in || '-') : 'País: ' + (row.country || '-')),
    'Propiedad: ' + (row.property_id || '-'),
    'Mensaje: ' + (row.message || '-'),
    '',
    'Ref: ' + (row.ref || '-'),
    'Origen: ' + ([row.utm_source, row.utm_medium, row.utm_campaign].filter(function (v) { return v; }).join(' / ') || 'directo'),
    'ID: ' + row.lead_id,
    '',
    'Planilla: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    'Acordate de completar la etapa y la próxima acción.',
  ];
  var options = row.email ? { replyTo: String(row.email).replace(/^'/, '') } : {};
  MailApp.sendEmail(email, '[El Doctor] ' + kind + ': ' + (row.name || 'nueva consulta'), lines.join('\n'), options);
}

function respond(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
