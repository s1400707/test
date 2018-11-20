// SDKの初期化
var ncmb = new NCMB(applicationKey, clientKey);

// 初期設定
  document.addEventListener("deviceready", initFunc(),false);
//ons.ready(function() {
 // initFunc();
  //  });
function initFunc() {
  first_Register();       //クーポン登録
  pushInit();               //プッシュ通知 
  console.log("onload3");
}
//});



 
