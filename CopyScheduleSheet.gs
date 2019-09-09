var CopyScheduleSheet = function() {
  var targetDay = new Date();
  
  // 来月
  targetDay.setDate(1);
  targetDay.setMonth(targetDay.getMonth() + 1);
  
  var sheet = getSheet(targetDay);
  this.callDiscord();
}

// discordにメッセージを送信
CopyScheduleSheet.prototype.callDiscord = function() {
  callDiscord(blinkWebhook, copyMessage);
}