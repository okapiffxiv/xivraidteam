// 未記入をdiscordで連絡
var ReportBlink = function() {
  this.objSheet;
  this.discordIds = discordIds;
  this.startDay = getStartDay();
  
  // 未記入者の名前を取得
  var blinkPersons = this.blinkPerson();
  if (blinkPersons.length > 0) {
    this.callDiscord(blinkPersons);
  }
}

// 未記入者探し
ReportBlink.prototype.blinkPerson = function() {
  var colStart = 5;
  var colEnd = colStart + 7;
  var blinkPerson = [];
  var discordIds = this.discordIds;
  var targetDay = this.startDay;
  
  for(var addDay = 0; addDay <= 6; addDay++) {
    var row = headerRows + targetDay.getDate();

    // シート選択
    var s = getSheet(targetDay);

    for(var col = colStart; col <= colEnd; col++) {
      var value = s.getRange(row, col).getValue();
      var discordId = discordIds[col - colStart];
      
      if (value == "" && blinkPerson.indexOf(discordId) == -1) {
        blinkPerson.push(discordId);
      }

    }
    
    targetDay.setDate(targetDay.getDate() + 1);
  }
  
  return blinkPerson;
}

// discordにメッセージを送信
ReportBlink.prototype.callDiscord = function(blinkPersons) {
  callDiscord(blinkWebhook, blinkPersons.join(' ') + " " + blinkMessage);
}