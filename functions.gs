// 次週の開始日を取得
function getStartDay() {
  var today = new Date();

  if (today.getDay() >= 2) {
    // 火曜以降なら来週の火曜から
    today.setDate(today.getDate() + 7 - today.getDay() + 2);
  } else {
    // 日月なら今週の火曜から
    today.setDate(today.getDate() - today.getDay() + 2);
  }

  return today;
}


// シートオブジェクトを返す
function getSheet(targetDay) {
  // シート名
  var mon = "0" + (targetDay.getMonth() + 1);
  mon = mon.slice(-2);
  var sheetName = "" + targetDay.getFullYear() + mon;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  
  // 該当シートがなければ作成
  if (sheet == null) {
    var baseS = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(baseSheetName);
    var copyS = baseS.copyTo(SpreadsheetApp.getActiveSpreadsheet());
    copyS.setName("" + sheetName);
    
    // 年月を記入
    copyS.getRange("E2").setValue(targetDay.getFullYear());
    copyS.getRange("G2").setValue(targetDay.getMonth() + 1);

    copyS.showSheet();
    return copyS;
  }
  
  return sheet;
}

// シートコピー
function copySheet(name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(baseSheetName);
  var copyS = sheet.copyTo(SpreadsheetApp.getActiveSpreadsheet());
  copyS.setName("" + name);
  return copyS;
}


// discord
function callDiscord(url, text, embeds) {
  if (url == '') return true;
  var payload = {"content": text, "embeds": embeds};  
  var params = {
    "method" : "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  
  response = UrlFetchApp.fetch(url, params);
}

function formatCalBot(author, title, desc, memo, color) {
  var embeds = {
    "author" : {"name": author},
    "title": title,
    "description": desc,
    "url": "https://calendar.google.com/calendar/embed?src=" + calId
  };
  
  if (memo != "") embeds["fields"] = [{"name": "memo", "value": memo}];
  
  if (color != null) embeds["color"] = color;
  return [embeds];
}


function getStartTime(sheet, intRow) {
  var booCheck, timeCell, startTime, selTime, endTime
  
  // チェックがついてない
  booCheck = sheet.getRange(CHECK_COL + intRow).getValue();
  if (!booCheck) return null;
  
  // 開始時間セルが空
  timeCell = sheet.getRange('D' + intRow).getValue();
  if (timeCell.length == 0) return null;

  // 開始時間
  selTime   = new Date(timeCell);
  startTime = new Date(sheet.getRange('A' + intRow).getValue());
  startTime.setHours(selTime.getHours());
  startTime.setMinutes(selTime.getMinutes());
  
  return startTime;
}


function formatDate(d) {
  return Utilities.formatDate( d, "Asia/Tokyo", "yyyy年M月d日(E)");
}

function formatTime(d) {
  return Utilities.formatDate( d, "Asia/Tokyo", "HH:mm");
}
