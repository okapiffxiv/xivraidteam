var AddEvent2Cal = function() {
  var startDay = getStartDay();
  
  // 今日から次週開始日までの予定を確認
  var calDay = new Date();
  for(var addDay = 0; addDay <= 6; addDay++) {
    if(calDay >= startDay) break;
    
    this.createEvent(calDay);
    calDay.setDate(calDay.getDate() + 1);
  }

  // 次週の予定をカレンダーに登録
  this.arrangeSchedule(startDay);

  calDay = startDay;
  for(var addDay = 0; addDay <= 6; addDay++) {
    this.createEvent(calDay);
    calDay.setDate(calDay.getDate() + 1);
  }
}


// 活動日の調整
AddEvent2Cal.prototype.arrangeSchedule = function (startDay) {
  var sheet = getSheet(startDay);
  var lot = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(lotSheetName);
  var row = headerRows + startDay.getDate();
  var maxDays   = lot.getRange(ARRANGE_CELL).getValue();
  var possibles = lot.getRange(POSSIBLEDAYS_RANGE).getValues();

  var schedules = [];
  for (var addDay = 0; addDay <= 6; addDay++) {
    if (!possibles[addDay][0]) {
      sheet.getRange(CHECK_COL + (row + addDay)).uncheck();
      continue;
    }

    sheet.getRange(CHECK_COL + (row + addDay)).check();

    var startTime = getStartTime(sheet, row + addDay);
    if (startTime == null) continue;

    schedules.push({
      'time': Number(startTime.getHours() + ('00' + startTime.getMinutes()).slice(-2)),
      'row': row  + addDay
    });
  }

  // 「開始時間が早い>活動日が早い」日を優先
  schedules.sort(function(a,b) {return a.time - b.time || a.row - a.row});
  for (var idx = 0; idx < schedules.length; idx++) {
    if (idx <= maxDays - 1) continue;
    sheet.getRange(CHECK_COL + schedules[idx]['row']).uncheck();
  }
}


// イベント編集
AddEvent2Cal.prototype.createEvent = function (targetDay) {
  var sheet = getSheet(targetDay);
  var row = headerRows + targetDay.getDate();
  var eventCell = sheet.getRange(CALID_COL + row).getValue();
  var startTime = getStartTime(sheet, row);
  var memo = sheet.getRange(MEMO_COL + row).getValue();
  
  if (startTime == null && eventCell.length > 0) {
    // チェック、開始時間がついていないのにイベントIDがある場合はカレンダー削除
    var boo = this.delCal(sheet, row, eventCell);
    if (boo) {
      var embeds = formatCalBot(
        "イベント削除", 
        calTitle, 
        formatDate(targetDay) + "の予定は取り消し",
        memo,
        0xff2600
      );
      callDiscord(eventWebhook, null, embeds);
    }
    return;
  
  } else if (startTime != null && eventCell.length == 0) {
    // チェック、開始時間があるのにイベントIDがない場合はカレンダー登録
    var boo = this.addCal(sheet, row, startTime, startTime);
    if (boo) {
      var embeds = formatCalBot(
        "イベント登録", 
        calTitle, 
        formatDate(startTime) + " "+ formatTime(startTime) + "開始",
        memo,
        0x5c5cfB
      );
      callDiscord(eventWebhook, null, embeds);
    }
    return;

  } else if (startTime != null) {
    // カレンダーに登録している時刻と比較して、違った場合は編集
    var boo = this.editCal(sheet, row, startTime, startTime, eventCell);
    if (boo) {
      var embeds = formatCalBot(
        "イベント変更", 
        calTitle, 
        formatDate(startTime) + " "+ formatTime(startTime) + "開始",
        memo,
        0x00f900
      );
      callDiscord(eventWebhook, null, embeds);
    }
    return;
    
  } 
}


// カレンダーに登録
AddEvent2Cal.prototype.addCal = function(sheet, intRow, startTime, endTime) {
  if (calId == "") return true;
  var objCal = CalendarApp.getCalendarById(calId);
  var event = objCal.createEvent(calTitle, startTime, endTime);
  
  // イベントIDをセルに登録
  sheet.getRange(CALID_COL + intRow).setValue(event.getId());
  return true;
}


// カレンダー削除
AddEvent2Cal.prototype.delCal = function(sheet, intRow, eventId) {
  if (calId == "") return true;
  var objCal = CalendarApp.getCalendarById(calId);
  objCal.getEventById(eventId).deleteEvent();
  
  // イベントIDを削除
  sheet.getRange(CALID_COL + intRow).clear();
  return true;
}


// カレンダー編集
AddEvent2Cal.prototype.editCal = function(sheet, intRow, startTime, endTime, eventId) {
  if (calId == "") return true;
  var objCal = CalendarApp.getCalendarById(calId);
  var objEvent = objCal.getEventById(eventId);
  var calStartTime = objEvent.getStartTime();
  var calEndTime = objEvent.getEndTime();
  
  if(calStartTime.getTime() != startTime.getTime() || calEndTime.getTime() != endTime.getTime()) {
    objEvent.setTime(startTime, endTime);
    return true;
  }
  
  return false;
}