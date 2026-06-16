function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({success:true, message:'Google Sheets endpoint is active.'})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e) {
      throw new Error('No event data received');
    }
    var raw = '';
    if (e.postData && e.postData.contents) {
      raw = e.postData.contents;
    } else if (e.parameter && Object.keys(e.parameter).length > 0) {
      raw = JSON.stringify(e.parameter);
    }
    if (!raw) {
      throw new Error('No POST body received');
    }

    var data = JSON.parse(raw);
    var sheet = SpreadsheetApp.openById('1GrkWEItMne5JWt-IG-QtI5_wguKdE9UoveyTY-awpO8').getSheetByName('Sheet1');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({success:false, error:'Sheet not found'})).setMimeType(ContentService.MimeType.JSON);
    }

    var row = [
      new Date(),
      data.name || '',
      data.email || '',
      data.mobile || '',
      data.class || '',
      data.school || '',
      data.recommendation || '',
      data.counts ? data.counts.DATA || 0 : 0,
      data.counts ? data.counts.GRAPHICS || 0 : 0,
      data.counts ? data.counts.MARKETING || 0 : 0,
      data.counts ? data.counts.CONTENT_CREATOR || 0 : 0,
      (data.answers || []).join('|')
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success:false, error:error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
