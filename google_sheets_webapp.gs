function doGet(e) {
  try {
    var sheet = SpreadsheetApp.openById('1GrkWEItMne5JWt-IG-QtI5_wguKdE9UoveyTY-awpO8').getSheetByName('Sheet1');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({success:false, error:'Sheet not found'})).setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = sheet.getDataRange().getValues();
    if (!data || data.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({submissions:[]})).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Skip header row, convert to objects
    var submissions = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      submissions.push({
        timestamp: row[0] ? new Date(row[0]).getTime() : '',
        name: row[1] || '',
        email: row[2] || '',
        mobile: row[3] || '',
        class: row[4] || '',
        school: row[5] || '',
        recommendation: row[6] || '',
        counts: {
          DATA: row[7] || 0,
          GRAPHICS: row[8] || 0,
          MARKETING: row[9] || 0,
          CONTENT_CREATOR: row[10] || 0
        },
        answers: (row[11] || '').split('|').filter(function(a) { return a.length > 0; })
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({submissions:submissions})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success:false, error:error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
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
