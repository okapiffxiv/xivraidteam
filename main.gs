// Googleカレンダーにイベントを登録
function カレンダーにイベントを登録() {
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
  var sheet = checkSchedule(targetDay);
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu("管理");
  menu.addItem("今月の予定表を作成", "今月の予定表を作成");
  menu.addToUi();
}
