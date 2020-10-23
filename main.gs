// 活動日の調整
function 活動日の調整() {
  new AddEvent2Cal();
}

// 未入力者にDiscordで連絡
function 未入力者にDiscordで連絡() {
  new ReportBlink();
}

// 来月の予定表を作成
function 来月の予定表を作成() {
  new CopyScheduleSheet();
}

// 今月の予定表を作成
function 今月の予定表を作成() {
  var targetDay = new Date();
  var sheet = getSheet(targetDay);
}

// 今日の予定を確認
function 今日の予定を確認() {
  var targetDay = new Date();
  var sheet = getSheet(targetDay);
  var row = headerRows + targetDay.getDate();
  var startTime = getStartTime(sheet, row);
  if (startTime != null) {
      var embeds = formatCalBot(
        "固定活動日のお知らせ", 
        calTitle, 
        formatDate(startTime) + " "+ formatTime(startTime) + "開始",
        "",
        0x5c5cfB
      );
      callDiscord(eventWebhook, null, embeds);
  }
}

// ロット優先順位表を送信
function ロット優先順位表を送信() {
  new LotList();
}

// トリガー設定
function setTrigger() {
  clearTrigger();

  if (isReportBlink) {
    ScriptApp.newTrigger("未入力者にDiscordで連絡").timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.FRIDAY).atHour(22).create();
    ScriptApp.newTrigger("未入力者にDiscordで連絡").timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.SATURDAY).atHour(22).create();
    ScriptApp.newTrigger("未入力者にDiscordで連絡").timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(22).create();
    ScriptApp.newTrigger("未入力者にDiscordで連絡").timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(12).create();
  }

  if (isReportSchedule) {
    ScriptApp.newTrigger("活動日の調整").timeBased().everyMinutes(5).create();
    ScriptApp.newTrigger("今日の予定を確認").timeBased().everyDays(1).atHour(12).create();
  }
  
  if (isReportLot) {
    ScriptApp.newTrigger("ロット優先順位表を送信").timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.TUESDAY).atHour(17).create();
  }
  
  if (isReportCreateCalendar) {
    ScriptApp.newTrigger("来月の予定表を作成").timeBased().onMonthDay(20).atHour(22).create();
  }
}

// トリガーの全削除
function clearTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu("管理");
  menu.addItem("今月の予定表を作成", "今月の予定表を作成");
  menu.addItem("来月の予定表を作成", "来月の予定表を作成");
  menu.addItem("ロット優先順位表を送信", "ロット優先順位表を送信");
  menu.addSeparator()
  menu.addItem("デフォルトのトリガーを設定", "setTrigger");
  menu.addItem("全トリガーを削除", "clearTrigger");
  menu.addToUi();
}
