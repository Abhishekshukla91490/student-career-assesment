// Minimal Apps Script to store only requested candidate details
// Columns: Timestamp | Name | Phone | Recommendation | CareerPath

const SPREADSHEET_ID = '1GrkWEItMne5JWt-IG-QtI5_wguKdE9UoveyTY-awpO8';
const SHEET_NAME = 'Sheet1';

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return jsonOut({success:false, error:'Sheet not found'});

    const data = sheet.getDataRange().getValues();
    const submissions = [];
    for (let i = 1; i < data.length; i++) {
      const r = data[i];
      submissions.push({
        timestamp: r[0] ? new Date(r[0]).getTime() : '',
        name: r[1] || '',
        phone: r[2] || '',
        recommendation: r[3] || '',
        careerPath: r[4] || ''
      });
    }
    return jsonOut({submissions: submissions});
  } catch (err) {
    return jsonOut({success:false, error: err.toString()});
  }
}

function doPost(e) {
  try {
    let raw = '';
    if (e.postData && e.postData.contents) raw = e.postData.contents;
    else if (e.parameter && Object.keys(e.parameter).length) raw = JSON.stringify(e.parameter);
    if (!raw) return jsonOut({success:false, error:'No POST body'});

    const data = JSON.parse(raw);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return jsonOut({success:false, error:'Sheet not found'});

    const row = [
      new Date(),
      data.name || '',
      data.phone || data.mobile || '',
      data.recommendation || '',
      data.careerPath || ''
    ];

    sheet.appendRow(row);
    return jsonOut({success:true});
  } catch (err) {
    return jsonOut({success:false, error: err.toString()});
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}
