# xivraidteam
- 固定管理用スプレッドシートです。希望品・ロット管理、スケジュール管理ができます。  
![Imgur](https://i.imgur.com/mzQrCJZ.png)
![Imgur](https://i.imgur.com/NwEkyTU.png)

### インストール
1. [ここ](https://docs.google.com/spreadsheets/d/1Q5FFsnICgQLiwUqzaLrHTg1B_tGYZ04QsYjYEm9WPEQ/copy)をクリックして、自分のGoogleドライブにシートをコピー
1. Googleにログインした状態で上のメニューから「管理 ＞ 今月の予定表」を作成をクリック
1. 承認ダイアログが出てきたら許可する（[参考記事](https://www.virment.com/step-allow-google-apps-script/)）
1. 「ロット」シートの希望品表にメンバーの名前を記入
1. 開始時刻欄を半角で記入。活動しない場合は空欄。

### Google Calendar、Discordとの連携
- この処理を行っておくと、活動日の調整・お知らせ、Discordを使って未記入者への連絡、ロット優先表の送信を自動で行ってくれるようになります
- Googleカレンダーに固定日を自動登録してくれるので、カレンダーを使って情報を共有することが出来ます  
![Imgur](https://i.imgur.com/9inwkvs.png) ![Imgur](https://i.imgur.com/frkUnmw.png)  
![Imgur](https://i.imgur.com/NWnksCE.png)  
![Imgur](https://i.imgur.com/jtwAT4F.png)  

1. DiscordでWebhookを作成  
[Discord webhookの取得方法](https://support.discordapp.com/hc/ja/articles/228383668-%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB-Webhooks%E3%81%B8%E3%81%AE%E5%BA%8F%E7%AB%A0)を参考にWebhookを作成します。  
「予定日連絡用」と「未記入者連絡用」を用意します。その時にできたURLは控えておくこと。
1. [Googleカレンダーを作成](https://life89.jp/create-google-calendar-and-get-id/)し、カレンダーIDを控えておく。
1. スプレッドシートの「設定」シートを開き、赤枠で囲まれた項目を入力  
  [DiscordのユーザIDの調べ方](https://support.discordapp.com/hc/ja/articles/206346498-%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC-%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC-%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8ID%E3%81%AF%E3%81%A9%E3%81%93%E3%81%A7%E8%A6%8B%E3%81%A4%E3%81%91%E3%82%89%E3%82%8C%E3%82%8B-)  
  [Discord 役職の作り方](https://support.discordapp.com/hc/ja/articles/206029707-%E6%A8%A9%E9%99%90%E3%82%92%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF-)  
  [Discord 役職IDの取得方法](https://discordhelp.net/role-id)   
1. 上メニューの「管理→デフォルトのトリガーを設定」をクリック
1. カレンダーシートの日付チェックボックスに☑が入っている日付を活動日候補と判断し、活動日を自動でお知らせしてくれるようになります

#### お知らせする時間帯を変えたい、必要ないお知らせを消したい場合
1. 「ツール→スクリプトエディタ」をクリック
1. 「編集→現在のプロジェクトのトリガー」をクリック
1. 現在設定されているトリガー一覧が表示されるので、以下の表を参考に好みに変更
  
  | 実行する関数 | 説明 |
  |:-- |:-- |
  |活動日の調整 |シートの固定活動日を調整し、カレンダーの登録やDiscordへの連絡を行います |
  |未入力者にDiscordで連絡　| 予定日未記入であるメンバーへDiscordにメッセージをします |
  |来月の予定表を作成 |来月の予定表シートを作成 |  
  |今月の予定表を作成 |今月の予定表シートを作成 | 
  |今日の予定を確認 |今日活動日の場合、Discordにメッセージを送信 | 
  |ロット優先順位表を送信 |「ロット」シートの希望数、取得数を元に優先順位を計算し、Discordにメッセージを送信します |


### Googleフォームとの連携(やりたい人だけ)
- スマホからのスプレッドシートの入力はやり辛いです
- Googleフォームはスマホからも入力しやすいレイアウトになっているのでこれとスプレッドシートを連携し、Googleフォームを経由してスプレッドシートに予定を入力できるようにします

1. [ここ](https://docs.google.com/forms/d/1cEVXhR8c2H0Snp9QNTJjMGFskISdvXmIWm6vTPCbrmI/copy)をクリックして、自分のGoogleドライブにフォームをコピー
1. 右上の送信ボタンとユーザー名の間にある３点マークをクリックして「スクリプトエディタ」をクリックし、開かれたスクリプトに必要なデータを入力  
```js
// スケジュール管理用スプレッドシートのURL
schedule.SHEET_URL = "ここにURLを記入";
```
1. フォーム編集画面へ戻り、パズルのマークをクリック「管理 ＞ スプレッドシート情報をインポート」をクリック。承認ダイアログが出てきたら許可する（[参考記事](https://www.virment.com/step-allow-google-apps-script/)）
1. 送信ボタンとユーザー名の間にある３点マークをクリックして「事前入力したURLを取得」
1. 最下部までスクロールし、「リンクを取得」ボタンをクリック。「リンクをコピー」をクリックしてクリップボードにコピー
1. 皆にコピーしたURLを通知
