// SDKの初期化
var ncmb = new NCMB(applicationKey, clientKey);

// 初期設定
function onLoad(){
  document.addEventListener("deviceready", initFunc(),false);
}

function initFunc() {
  pushInit();               //プッシュ通知
  first_Register();       //クーポン登録
  console.log("onload");
}


 
