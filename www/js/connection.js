//接続状況確認
var online = false;
var onOnline = function () {
    console.log("I'm online");
    online = true;
}
var onOffline = function () {
    alert("データが取得できません。接続状況を確認してください");
    online = false;
}
document.addEventListener("online", onOnline, false);
document.addEventListener("offline", onOffline, false);