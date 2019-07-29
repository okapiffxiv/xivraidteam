var AddEvent2Cal = function() {
  var startDay = getStartDay();
  
  // 今日から次週開始日までの予定を確認
  var calDay = new Date();
  for(var addDay = 0; addDay <= 6; addDay++) {
    if(calDay >= startDay) break;
    
    this.createEvent(calDay);
    calDay.setDate(calDay.getDate() + 1);
  }

  // 1週間の予定をカレンダーに登録
  calDay = startDay;
  for(var addDay = 0; addDay <= 6; addDay++) {
    this.createEvent(calDay);
    calDay.setDate(calDay.getDate() + 1);
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
  var objCal = CalendarApp.getCalendarById(calId);
  var event = objCal.createEvent(calTitle, startTime, endTime);
  
  // イベントIDをセルに登録
  sheet.getRange(CALID_COL + intRow).setValue(event.getId());
  return true;
}


// カレンダー削除
AddEvent2Cal.prototype.delCal = function(sheet, intRow, eventId) {
  var objCal = CalendarApp.getCalendarById(calId);
  objCal.getEventById(eventId).deleteEvent();
  
  // イベントIDを削除
  sheet.getRange(CALID_COL + intRow).clear();
  return true;
}


// カレンダー編集
AddEvent2Cal.prototype.editCal = function(sheet, intRow, startTime, endTime, eventId) {
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