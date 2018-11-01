function pushInit() {
    // [NCMB] プッシュ通知受信時のコールバックを登録します
    window.NCMB.monaca.setHandler (function(jsonData){
        // 送信時に指定したJSONが引数として渡されます
        //alert("callback:" + JSON.stringify(jsonData));
    })

   // [NCMB] デバイストークンを取得しinstallationに登録
    window.NCMB.monaca.setDeviceToken(
        applicationKey,
        clientKey,
        senderId,
        successCallback,
        errorCallback
    );

    /* 端末登録成功時の処理 */
    var successCallback = function () {
      console.log("getToken");
    };

    /* 端末登録失敗時の処理処理 */
    var errorCallback = function (err) {
      console.log("getTokenErr");
    };
}
