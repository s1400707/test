//接続状況確認
var online = false;
var flag=0;

var onOnline = function () {
    console.log("I'm online");
    var modal = document.querySelector('ons-modal');
    online = true;
    if(flag==1){
      modal.hide();
        flag=0;
      }
}
var onOffline = function () {
//    alert("データが取得できません。接続状況を確認してください。");

 var modal = document.querySelector('ons-modal');
    flag=1;
  modal.show();
    online = false;
}

document.addEventListener("online", onOnline, false);
document.addEventListener("offline", onOffline, false);



function showModal() {
  var modal = document.querySelector('ons-modal');
  modal.show();
  setTimeout(function() {
    modal.hide();
  }, 1000);
}