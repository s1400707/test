function pushInit() {
    var successCallback = function () {
        //端末登録後の処理
        console.log("登録成功");
    };
    var errorCallback = function (err) {
        //端末登録でエラーが発生した場合の処理
        console.log("登録失敗");
    };
    // デバイストークンを取得してinstallation登録が行われます
    // ※ YOUR_APPLICATION_KEY,YOUR_CLIENT_KEYはニフクラ mobile backendから発行されたAPIキーに書き換えてください
    window.NCMB.monaca.setDeviceToken(
    applicationKey,
    clientKey,
    successCallback,
    errorCallback
    );

    // プッシュ通知受信時のコールバックを登録します
    window.NCMB.monaca.setHandler
    (
        function(jsonData){
            // 送信時に指定したJSONが引数として渡されます
            alert("callback :::" + JSON.stringify(jsonData));
        }
    );

    // 開封通知登録の設定
    // trueを設定すると、開封通知を行う
    window.NCMB.monaca.setReceiptStatus(true);

      
}

