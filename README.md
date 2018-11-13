# xivraidteam
- 固定管理用スプレッドシートです　　
- 希望品の確認、強化薬系の取得状況確認、スケジュール管理ができます  
![Imgur](https://i.imgur.com/9kIoD9E.png)
![Imgur](https://i.imgur.com/NwEkyTU.png)

- またDiscordやGoogleカレンダーと連携をすることでスケジュール未記入者への連絡、固定活動日のスケジュール作成を自動化することもできます  
![Imgur](https://i.imgur.com/9inwkvs.png) ![Imgur](https://i.imgur.com/frkUnmw.png)  
![Imgur](https://i.imgur.com/NWnksCE.png) ![Imgur](https://i.imgur.com/Fvyc0BU.jpg)

### インストール
1. [ここ](https://docs.google.com/spreadsheets/d/1Q5FFsnICgQLiwUqzaLrHTg1B_tGYZ04QsYjYEm9WPEQ/copy)をクリックして、自分のGoogleドライブにシートをコピー
1. Googleにログインした状態で上のメニューから「管理 ＞ 今月の予定表」を作成をクリック
1. 「ロット」シートの希望品表にメンバーの名前を記入
1. 開始時刻欄を半角で記入。活動しない場合は空欄。

### 外部ツールとの連携
1. 「ツール→スクリプトエディタ」をクリックし、開かれたスクリプトに必要なデータを入力  
  [DiscordのユーザIDの調べ方](https://qiita.com/Goryudyuma/items/2e5efd0a07173b060b34)  
  [Discord webhookの取得方法](https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks)  
```
// GoogleカレンダーID
schedule.calId = "????@gmail.com";

// DiscordのユーザID "<@コピーしたID（ランダムな半角数字）>"
// 予定表左の人から順番に入れる
schedule.discordIds = [
  "<@ここにIDを記入>",
  "<@ここにIDを記入>",
  "<@ここにIDを記入>", 
  "<@ここにIDを記入>",
  "<@ここにIDを記入>",
  "<@ここにIDを記入>",
  "<@ここにIDを記入>",
  "<@ここにIDを記入>"
];

// Discord webhook url
// カレンダーイベント用
schedule.eventWebhook = "ここにURLを記入";
// 来月の予定表を作成時や予定未記入者への連絡用
schedule.bookWebhook = "ここにURLを記入";

// Discordに送るメッセージ
// 予定表未記入者連絡用
schedule.blinkMessage = "予定表に記入してネ！";
// 来月の予定表を作成時連絡用
schedule.copyMessage = "来月の予定表を用意したゾ☆";
```
1. 「編集→すべてのトリガー」をクリック。「実行する関数を選択」に自動化したい処理を設定  
  カレンダーにイベントを登録： 実行日から来週までの予定をみて、全員入力かつチェックマークがついている予定をGoogleカレンダーに登録  
  未入力者にDiscordで連絡：実行日から来週のリセ日前日までの予定をみて、予定未入力者にDiscordで連絡  
  来月の予定表を作成：来月の予定表シートを作成  
  今月の予定表を作成：今月の予定表シートを作成  
![Imgur](https://i.imgur.com/L5NuLb3.png)
1. 「イベントソースを選択」と「イベントの種類を選択」からそれぞれの処理を実行したいタイミングを選択し、保存ボタンを押す
