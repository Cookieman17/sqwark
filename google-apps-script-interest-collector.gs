const SHEET_NAME = "Interest List";
const HEADERS = ["timestamp", "name", "email", "consent", "source"];

function doGet() {
  return jsonOutput_({ ok: true, service: "sqwark-interest-collector" });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const data = e && e.parameter ? e.parameter : {};
    const honeypot = clean_(data.company);
    const name = clean_(data.name);
    const email = clean_(data.email).toLowerCase();
    const consent = clean_(data.consent);
    const source = clean_(data.source);

    if (honeypot) {
      return jsonOutput_({ ok: true, ignored: true });
    }

    if (!email || !isValidEmail_(email)) {
      return jsonOutput_({ ok: false, error: "invalid_email" });
    }

    if (consent !== "yes") {
      return jsonOutput_({ ok: false, error: "missing_consent" });
    }

    const sheet = getSheet_();
    const existingRow = findEmailRow_(sheet, email);
    const rowValues = [new Date(), name, email, consent, source || "sqwark-site"];

    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
      return jsonOutput_({ ok: true, updated: true });
    }

    sheet.appendRow(rowValues);
    return jsonOutput_({ ok: true, created: true });
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function findEmailRow_(sheet, email) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return -1;
  }

  const values = sheet.getRange(2, 3, lastRow - 1, 1).getValues();

  for (let index = 0; index < values.length; index += 1) {
    if (String(values[index][0]).trim().toLowerCase() === email) {
      return index + 2;
    }
  }

  return -1;
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clean_(value) {
  return String(value || "").trim();
}

function jsonOutput_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
