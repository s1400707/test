//接続状況確認
var online = false;
var flag=0;

var onOnline = function () {
    console.log("I'm online");
    online = true;
    if(flag==1){
      hideDialog();
      flag=0;
    }
}
var onOffline = function () {
    //alert("データが取得できません。接続状況を確認してください。");
    alertOffline();
    flag=1;
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

var hideDialog = function() {
    document
    .getElementById('dialog1')
    .hide();
};