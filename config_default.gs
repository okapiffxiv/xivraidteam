var headerRows = 3;
var CALID_COL = "Q";

// コピー元のシート名
var baseSheetName = "予定表（Base）";


//// discord
// タイトル
var calTitle = '固定活動日';
// id
var discordIds = [
  "<@1>",
  "<@2>",
  "<@3>", 
  "<@4>",
  "<@5>",
  "<@6>",
  "<@7>",
  "<@8>"
];

// 未記入者に送るメッセージ
var blinkMessage = "予定表に記入してネ！";
var copyMessage = "来月の予定表を用意したゾ☆";
  
// Google Calendar
// カレンダーID
var calId = "";
// webhook url
var bookWebhook = "";
var eventWebhook = "";