//// ■メモ
//1層 「帯/耳/首/腕/指」からランダム×3
//2層 「頭/手/足」からランダム ×2 + 硬化薬
//3層 「頭/手/足」からランダム + 「脚」 + 繊維 + 強化薬
//4層 「武器」+「胴」+ ランダム武器直ドロップ + マウント + ミニオン
//
//1層と2層の箱は重複の可能性あり。
//1層で帯は確定ではドロップしません。
//3層で脚は1枠確定、2つ出ることはありません。
//
//強化素材

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
    var min = lots[key][0]['have'];
    var idx = 0;

    // 希望者がいる場合は対象者すべて
    if (lots[key][0]['want'] > 0) {
      targets['lots'][key][0] =　[]
      for (idx; idx < lots[key].length; idx++) {
        if (lots[key][idx]['want'] == 0) break;
        targets['lots'][key][0].push(lots[key][idx]['name']);
      }
      
    }

    // 希望者がすべて取得している場合は所持数が少ない人。第2候補まで表示する。
    var entry = targets['lots'][key].length;
    var maxDrop = key.search(/帯|耳|首|腕|指|頭|手|足/) != -1 ? 3 : 1;
    if (entry == 0 || (entry > 0 && targets['lots'][key][0].length < maxDrop)) {
      var prevHave = lots[key][idx]['have'];
      for (idx; idx < lots[key].length; idx++) {
        if (lots[key][idx]['have'] > prevHave) {
          if (idx >= maxDrop) break;
          entry++;
        }

        if (targets['lots'][key][entry] == undefined) targets['lots'][key][entry] = [];
        targets['lots'][key][entry].push(lots[key][idx]['name']);
        prevHave = lots[key][idx]['have'];
        
      }
    }

    // 整形処理
    for (var idx = 0; idx < targets['lots'][key].length; idx++) {
      targets['lots'][key][idx] = targets['lots'][key][idx].join('、');
    }
    targets['lots'][key] = targets['lots'][key].join(' ＞ ');

  }
  
  // 武器希望
  var cntCol = 3;
  var armers = this.sheet.getRange(3, 3, this.cntMember, cntCol).getValues();
  var lots   = {}
  for (var midx = 0; midx < this.cntMember; midx++) {
    for (var col = 0; col < armers[midx].length; col++) {
      if (armers[midx][col] == '' || armers[midx][col] == '取得済') continue;
      if (lots[armers[midx][col]] == undefined) lots[armers[midx][col]] = [[], [], []];
      lots[armers[midx][col]][col].push(members[midx][0]);
    }
  }
  
  var armers = {}
  for (var key in lots) {
    for (var rank=0; rank < cntCol; rank++) {
      if (rank == 0) armers[key] = [];
      if (lots[key][rank].length > 0) {
        armers[key] = lots[key][rank].join('、');
        break;
      }
    }
  }
  targets['armers'] = armers;

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
    embeds[0]['fields'].push({'name': key, 'value': reports['lots'][key]})
  }
  callDiscord(eventWebhook, null, embeds);
}
