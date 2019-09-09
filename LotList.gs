var LotList = function() {
  this.obj   = SpreadsheetApp.getActiveSpreadsheet();
  this.sheet = this.obj.getSheetByName(lotSheetName);
  this.cntMember = 8;
  
  // 箱取得数を確認
  var reports = this.Box();

  // Discord送信
  this.callDiscord(reports);
}


// イベント編集
LotList.prototype.Box = function () {
  function compare(a, b) {
    return b.want - a.want || a.have - b.have;
  }

  var members  = this.sheet.getRange(3, 2, this.cntMember, 1).getValues();
  var lotComunStart = 8;

  // 1段目
  var keyNames = this.sheet.getRange(2, lotComunStart, 1, 16).getValues()[0];
  var values   = this.sheet.getRange(4, lotComunStart, this.cntMember, 16).getValues();
  // 2段目結合
  keyNames = keyNames.concat(this.sheet.getRange(12, lotComunStart, 1, 14).getValues()[0]);
  var values2   = this.sheet.getRange(14, lotComunStart, this.cntMember, 14).getValues();
  for (var idx = 0; idx < values.length; idx++) {
    values[idx] = values[idx].concat(values2[idx]);
  }

  // 整形
  var lots = {}
  for (var idx = 0; idx < keyNames.length; idx = idx + 2) {
    var lot = [];

    for (var midx = 0; midx < this.cntMember; midx++) {
      lot.push({
        'name': members[midx][0],
        'want': values[midx][idx] - values[midx][idx + 1] < 0 ? 0 : values[midx][idx] - values[midx][idx + 1],
        'have': values[midx][idx + 1]
      });
    }
    
    // ソート
    lots[keyNames[idx]] = lot.sort(compare);
  }

  // ロット対象者
  var targets = {'lots': {}, 'armers': {}}
  for (var key in lots) {
    targets['lots'][key] = [];

    if (lots[key][0]['want'] == 0) {
      // 希望者がすべて取得している場合は所持数が少ない人
      var min = lots[key][0]['have'];
      for (var idx = 0; idx < lots[key].length; idx++) {
        if (lots[key][idx]['have'] > min) break;
        targets['lots'][key].push(lots[key][idx]['name']);
      }

    } else {
      // 希望者がいる場合は対象者すべて
      for (var idx = 0; idx < lots[key].length; idx++) {
        if (lots[key][idx]['want'] == 0) break;
        targets['lots'][key].push(lots[key][idx]['name']);
      }

    }

  }
  
  // 武器希望
  var cntCol = 2;
  var armers = this.sheet.getRange(3, 4, this.cntMember, cntCol).getValues();
  var lots   = {}
  for (var midx = 0; midx < this.cntMember; midx++) {
    for (var col = 0; col < armers[midx].length; col++) {
      if (armers[midx][col] == '') continue;
      if (lots[armers[midx][col]] == undefined) lots[armers[midx][col]] = [[], []];
      lots[armers[midx][col]][col].push(members[midx][0]);
    }
  }
  
  for (var key in lots) {
    for (var rank=0; rank < cntCol; rank++) {
      lots[key][rank] = (lots[key][rank].length == 0) ? 'なし': lots[key][rank].join('、');
    }
    lots[key] = lots[key].join(' ＞ ')
  }
  targets['armers'] = lots;

  return targets;
}


LotList.prototype.callDiscord = function (reports) {
  var descriptions = [];
  for (var key in reports['armers']) {
    descriptions.push(key + '：' + reports['armers'][key]);
  }

  var embeds = formatCalBot("", "ロット優先順位", descriptions.join('\n'), "", 0xfffb00);
  embeds[0]['url'] = this.obj.getUrl() + "#gid=" + this.sheet.getSheetId();
  embeds[0]['fields'] = [];
  for (var key in reports['lots']) {
    embeds[0]['fields'].push({'name': key, 'value': reports['lots'][key].join('、')})
  }
  callDiscord(eventWebhook, null, embeds);
}
