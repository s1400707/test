// SDKの初期化
var ncmb = new NCMB(applicationKey, clientKey);

// 初期設定
function onLoad(){
  document.addEventListener("deviceready", initFunc(),false);
}

function initFunc() {
  checkConnection();   //インターネット接続確認
  pushInit();               //プッシュ通知
  first_Register();       //クーポン登録
  console.log("onload");
}

function checkConnection() {
  var networkState = navigator.connection.type;
  var states = {};

  states[Connection.UNKNOWN]  = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI]     = 'WiFi connection';
  states[Connection.CELL_2G]  = 'Cell 2G connection';
  states[Connection.CELL_3G]  = 'Cell 3G connection';
  states[Connection.CELL_4G]  = 'Cell 4G connection';
  states[Connection.CELL]     = 'Cell generic connection';
  states[Connection.NONE]     = 'No network connection';

  if(states[networkState]     == '接続なし'){
    //console.log("aaa");
    alert('インターネット接続: ' + states[networkState]);
  }
}

// document.addEventListener("offline", onOffline, false);

// function onOffline() {
//     // Handle the offline event
//      console.log("aaa");
//   alert("aaa"); 
// }
 
