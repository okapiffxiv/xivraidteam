// 設定シートの読み込み
var Setting = function() {
  this.obj   = SpreadsheetApp.getActiveSpreadsheet();
  this.sheet = this.obj.getSheetByName(confSheetName);

  // 共通変数を設定
  discordIds = this.setDiscordIds();
  blinkMessage = this.sheet.getRange("F15").getValue();
  copyMessage = this.sheet.getRange("F16").getValue();
  calId = this.sheet.getRange("F11").getValue() + "@" + this.sheet.getRange("H11").getValue();
  blinkWebhook = this.sheet.getRange("F6").getValue();
  eventWebhook = this.sheet.getRange("F7").getValue();
  isReportBlink = this.sheet.getRange("C17").getValue();
  isReportSchedule = this.sheet.getRange("C18").getValue();
  isReportCreateCalendar = this.sheet.getRange("C19").getValue();
  isReportLot = this.sheet.getRange("C20").getValue();
}


Setting.prototype.setDiscordIds = function () {
  var ids = this.sheet.getRange("C7:C14").getValues();
  
  for (var i = 0; i < ids.length; i++) {
    ids[i] = ids[i][0].trim();
    if (!ids[i].match(/^<@/)) ids[i] = "<@" + ids[i];
    if (!ids[i].match(/>$/)) ids[i] = ids[i] + ">";
  }
  
  return ids;
}

new Setting();