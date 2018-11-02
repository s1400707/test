//接続状況確認
var online = false;
var onOnline = function () {
  hideDialog();
    console.log("I'm online");
    online = true;
}
var onOffline = function () {
    //alert("データが取得できません。接続状況を確認してください。");
    alertOffline();
    online = false;
}
document.addEventListener("online", onOnline, false);
document.addEventListener("offline", onOffline, false);



var alertOffline = function() {
  var dialog = document.getElementById('dialog1');

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('connection.html', { append: true })
      .then(function(dialog) {
        dialog.show();
      });
  }
};

var hideDialog = function(id) {
  document
    .getElementById('dialog1')
    .hide();
};