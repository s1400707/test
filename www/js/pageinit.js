var reader='';               //画像読み込み
var userid='';               //installationのobjectId
var showCoupon='';     //ダイアログに表示するdetail保存
var e_name='';           //イベント名
var e_class=''; 
var e_geo='';             //イベントの位置
var c_geo='';              //クーポンの位置]
var myCouponId='';

//アプリ起動時、Coupon_Recordへクーポンの登録
function first_Register(){
    var ncmbTimer = setInterval(function() {         //登録されるまで時間稼ぎ
        window.NCMB.monaca.getInstallationId(function(id) {  //デバイストークン取得
            if (id) {                                                                     //取得後
                clearInterval(ncmbTimer);   
                console.log("getid");
                userid=id;
            }
        })
    }, 3000);
}


document.addEventListener('init', function(event) {
    var page = event.target;

    switch(page.id) {
        case 'info-page':
        //情報ページ表示時の初期設定

            var reader = new FileReader();
            reader.onload = function(e) {
                var dataUrl = reader.result;
                document.getElementById("info-img").src = dataUrl;
            }
            ncmb.File.download(encodeURIComponent(page.data.img), "blob")
            .then(function(blob) {
                reader.readAsDataURL(blob);
            })
            .catch(function(err) {
                console.error(err);
            })

            document.getElementById("info-title").innerHTML = page.data.title;
            document.getElementById("info-detail").innerHTML = page.data.detail;
        break;

        case 'coupon-info-page':
            //情報ページ表示時の初期設定
            console.log(page.data.title);
            //クーポンボタン
            var myCoupon = ncmb.DataStore("Coupon_Record");　          //データがあるか判別
            var c_limit='';

            myCouponId=page.data.couponId;
            myCoupon.equalTo("deviceId",userid)
            .equalTo("couponId",myCouponId)
            .count()
            .fetchAll()
            .then(function(result1){
                if(result1.count==0 && userid!=''){
                    var Coupon=ncmb.DataStore("Coupon_List");
                    Coupon.equalTo("objectId",myCouponId)
                    .fetchAll()
                    .then(function(result2){
                        c_limit=result2[0].get("limit");
                        var mycoupon=new myCoupon();

                        mycoupon.set("deviceId",userid)
                        .set("couponId",result2[0].get("objectId"))
                        .set("name",result2[0].get("name"))
                        .set("limit",result2[0].get("limit"))
                        .save()        

                        if(c_limit<=-1){
                            c_limit='∞';
                        }

                        if(c_limit==0 || userid==''){
                        document.getElementById("couponBtn").innerHTML='<ons-button disabled class="btn" id="couponBtn">使う<br>残り:'+c_limit+'</ons-button> '; 
                        }else{
                        document.getElementById("couponBtn").innerHTML='<ons-button  onclick="couponDialog(myCouponId)" class="btn" id="couponBtn">使う<br>残り：'+c_limit+'</ons-button> '; 
                        }
                    })
                    .catch(function(err){
                        console.log(err); // エラー処理
                    });  

                }else{
                    c_limit=result1[0].get("limit");

                    if(c_limit<=-1){
                        c_limit='∞';
                    }

                    if(c_limit==0 || userid==''){
                        document.getElementById("couponBtn").innerHTML='<ons-button disabled class="btn" id="couponBtn">使う<br>残り:'+c_limit+'</ons-button> '; 
                    }else{
                        document.getElementById("couponBtn").innerHTML='<ons-button  onclick="couponDialog(myCouponId)" class="btn" id="couponBtn">使う<br>残り:'+c_limit+'</ons-button> '; 
                    }
                }

            })
            .catch(function(err){
                console.log(err); // エラー処理
            });  

            var reader = new FileReader();
            reader.onload = function(e) {
                var dataUrl = reader.result;
                document.getElementById("info-img").src = dataUrl;
            }
            ncmb.File.download(encodeURIComponent(page.data.img), "blob")
            .then(function(blob) {
                reader.readAsDataURL(blob);
            })
            .catch(function(err) {
                console.error(err);
            })

            document.getElementById("info-title").innerHTML = page.data.title;
            document.getElementById("info-detail").innerHTML = page.data.detail;
            document.getElementById("info-dbName").innerHTML =  '<ons-button  onclick="showMap('+"'"+page.data.dbName+"'"+')" class="btn"><p>地図</p></ons-button>';
        break;

        case 'event-info-page':
            //情報ページ表示時の初期設定
            console.log(page.data.dbName);

            var reader = new FileReader();
            reader.onload = function(e) {
                var dataUrl = reader.result;
                document.getElementById("info-img").src = dataUrl;
            }
            ncmb.File.download(encodeURIComponent(page.data.img), "blob")
            .then(function(blob) {
                reader.readAsDataURL(blob);
            })
            .catch(function(err) {
                console.error(err);
            })

            document.getElementById("info-title").innerHTML = page.data.title;
            document.getElementById("info-detail").innerHTML = page.data.detail;
            document.getElementById("info-dbName").innerHTML =  '<ons-button  onclick="showMap('+"'"+page.data.dbName+"'"+')" class="btn"><p>地図</p></ons-button>';
        break;

        case 'map-page':
            //マップ表示
            console.log("map page init");
            writemap(140.883215,38.173054);
        break;

        case 'main-page':
            //メインページ
            displayList("News_List", "newsItems");

        break; 

        case 'coupon-page':
            //クーポンページ
            displayList("Coupon_List", "couponItems");
        break;

        case 'event-page':
            //イベントページ
            displayList("Event_List", "eventItems");
        break;

        case 'tourism-page':
            //観光ページ
            displayList("Tourism_List", "tourismItems");
        break;

        case 'shop-page':
            //お買い物ページ
            displayList("Shop_List", "shopItems");
        break;

        case 'food-page':
            //グルメページ
            displayList("Food_List", "foodItems");
        break;
    }
});

//ニュース、クーポン、イベント一覧表示
function displayList(dbName, listId){
    var  today=getDay();　//日付取得
    var c_objectId1=[]; //リスト表示時のCoupon_listのobjectId保存
    var c_name=[];      //クーポンの名前
    var c_limit=[];       //クーポンの最大回数
    var value=0;          //クーポンの回数
    var items ='';         //取得したデータ
    var deadline='';      //開催期間格納
    var flag= document.createDocumentFragment();  //フラグメント
    var frame= document.getElementById(listId);      
    var events = ncmb.DataStore(dbName);             //開始期間、終了期間と比較
    var img=ncmb.DataStore("Item_info");
    var pic;

    events .lessThanOrEqualTo("startDate",today)
    .greaterThanOrEqualTo("endDate",today)
    .order("endDate")
    .limit(6)
    .fetchAll() 
    .then(function(results){
        for (var  i= 0; i< results.length; i++) {
            (function() {                                          //即時関数
                var result=results[i];

                switch(dbName){
                    case "Coupon_List":                             //クーポンのとき
                        var  reader = new FileReader();  　　　　//ファイルの読み込み 
                        img.equalTo("objectId",result.get("link"))
                        .fetchAll() 
                        .then(function(results){    
                            pic=results[0].get("img");        //画像取得
                            loadNews(pic,reader) ;
                            reader.onload=function(e){         //取得終了
                                c_limit[i]=result.get("limit");　　　　//クーポン回数取得
                                if(c_limit[i]<=-1){                                   //-1以下（無制限）のとき
                                    c_limit[i]='無制限';
                                }else{
                                    c_limit[i]+=' 回まで';
                                }
                                if(result.endDate=='2999/12/31' ){            //期間が決まっていない
                                    deadline='';
                                }else{                                                      //決まっている
                                    deadline=result.get("startDate")+'～'+result.get("endDate");
                                }

                                items = document.createElement('ons-list-item');  //アイテム表示
                                items.className="listItem1";
                                items.onclick=function(){onClickItem(result.get("link"),dbName,result.get("objectId"));}; 
                                items.innerHTML='<ons-row><ons-col width="30%"><img class="listImage" src ="'+reader.result+'" /></ons-col><ons-col><ons-row><ons-col><H5>'+result.get("name")+' </H5></ons-row><hr><ons-row><ons-col>'+c_limit[i]+'</ons-col></ons-row><ons-row><ons-col>'+deadline+'</ons-col></ons-row></ons-col></ons-row>';
                                flag.appendChild(items);       
                                frame.appendChild(flag);
                            }
                        })
                        .catch(function(err){  
                            console.log(err); // エラー処理
                        });  
                    break;

                    //ニュース
                    case "News_List":
                        var  reader = new FileReader();  //ファイルの読み込み 
                        pic=result.get("thumbnail");
                        loadNews(pic,reader);
                        reader.onload= function(e){ //読み込み終了

                            items ='<ons-carousel-item  onclick="onClickItem('+"'"+result.get("link")+"'"+','+"'"+dbName+"'"+','+"'"+result.get("objectId")+"'"+')"  class="cal"><img src="'+reader.result+'" class="calImage" /><div class="center"><span class="list-item__title"><H7>'+result.get("name")+'</H7></span></div></ons-carousel-item>';                 
                            document.getElementById(listId).insertAdjacentHTML('beforeend', items);
                        }
                    break;

                    default:            
                        var  reader = new FileReader();  //ファイルの読み込み 
                        img.equalTo("objectId",result.get("link"))
                        .fetchAll() 
                        .then(function(results){
                            pic=results[0].get("img"); 
                            loadNews(pic,reader) ;

                            reader.onload=function(e){
                                if(result.endDate=='2999/12/31' ){            //期間が決まっていない
                                    deadline='';
                                }else{                                                      //決まっている
                                    deadline=result.get("startDate")+'～'+result.get("endDate");
                                }
                                items= document.createElement('ons-list-item');
                                items.className="listItem1";
                                items.onclick=function(){onClickItem(result.get("link"),dbName,result.get("objectId"));}; 
                                items.innerHTML='<ons-row><ons-col width="30%"><img class="listImage" src ="'+reader.result+'" /></ons-col><ons-col><ons-row><ons-col><H5>'+result.get("name")+' </H5></ons-col></ons-row><hr><ons-row><ons-col>'+deadline+'</ons-col></ons-row></ons-col></ons-row>';
                                flag.appendChild(items);       
                                frame.appendChild(flag);
                            }     
                        })
                        .catch(function(err){
                            console.log(err) ;// エラー処理
                        });   
                    break;
                }
            }) ();   
        }  
    })
}

//リストアイテム
function onClickItem(itemLink,dbName,objectId){  

    showModal(0);  //くるくる

    var item = ncmb.DataStore("Item_info");
    item.equalTo("objectId",itemLink)
    .fetchAll() 
    .then(function(results){
        switch(dbName){
            case "Coupon_List":
                showCoupon=results[0].get("detail");
                c_geo=results[0].get("geo");
            break;
            case "Coupon_Record":
                showCoupon=results[0].get("detail");
                c_geo=results[0].get("geo");
            break;
            default:
                e_name=results[0].get("name");
                e_geo=results[0].get("geo");
            break;
        }
        onClickInfo(results[0].get("title"), results[0].get("detail"), results[0].get("img"),dbName,objectId);
        showModal(1);  //くるくる
    })
    .catch(function(err){
        console.log("error"); // エラー処理
    }); 
}

function onClickInfo(title,detail,img,dbName,objectId){
    var options = {};
    options.data = {};
    options.animation = 'slide';
    options.data.title = title;
    options.data.detail = detail;
    options.data.img = img
    options.data.dbName=dbName;

    switch(dbName){
        case "Coupon_List":
            options.data.couponId=objectId; //クーポンボタン用
            NatNavi.pushPage('coupon_info.html', options); 
        break;
        case "Coupon_Record":
            options.data.couponId=objectId; //クーポンボタン用
            NatNavi.pushPage('coupon_info.html', options);  
        break;
        case "Event_List":
            NatNavi.pushPage('event_info.html', options);
        break;
        case "Tourism_List":
            NatNavi.pushPage('event_info.html', options);
        break;
        case "Shop_List":
            NatNavi.pushPage('event_info.html', options);
        break;
        case "Food_List":
            NatNavi.pushPage('event_info.html', options);
        break;
        case "News_List":
            NatNavi.pushPage('event_info.html', options);
        break;
        default:
            NatNavi.pushPage('info.html', options);
        break;
    }
}

//ページ移動ボタン
function onClickTopBtn(page){
    var options = {};
    options.animation = 'slide';
    NatNavi.pushPage(page,options);
}

//画像読み込み
function loadNews(pic,reader){                     
    ncmb.File.download(encodeURIComponent(pic), "blob")  //ファイルのダウンロード
    .then(function(blob) {
        reader.readAsDataURL(blob);  //ファイルの読み込み
    })
    .catch(function(err) {
        console.error(err);
    })
}

//外部ページに移動するか判別
function CheckMove(url,title) {
    if( confirm(title+"を開きます") ) {
        var ref= cordova.InAppBrowser.open(url, '_system', 'location=yes');
    }
}

//クーポン使用okボタン押下
function registerCoupon(myCouponId){
    alert("画面を見せてください\n\n"+showCoupon);      
    var count=0;     //現在の回数

    var myCoupon = ncmb.DataStore("Coupon_Record");     //データがあるか判別
    myCoupon.equalTo("deviceId",userid)
    .equalTo("couponId",myCouponId)
    .fetchAll()
    .then(function(results){      
        count=results[0].get("limit");
        results[0].set("limit",count-1)
        return results[0].update();
    })
    .catch(function(err){
        console.log(err); // エラー処理
    }); 
    NatNavi.popPage();
}

//日付取得
function getDay(){
    var newday = new Date();
    var year = newday.getFullYear();
    var month = newday.getMonth()+1;
    var day = newday.getDate();
    var today=year+'/'+month+'/'+day;

    return today;
}

//クーポン使用ダイアログ
function couponDialog(myCouponId){
    if(window.confirm('このクーポンを使いますか？')){
        registerCoupon(myCouponId);
    } else{
        window.alert('キャンセルされました'); 
    }
}

//地図
function showMap(dbName){
    if(window.confirm('地図に目的地を表示します')){
        checkDataStore=dbName;
        NatNavi.popPage();
        var countup = function(){
            switch(dbName){
                case "Coupon_List":
                    find_geopoint(checkDataStore);
                    eventmap(c_geo.longitude,c_geo.latitude);
                break;
                case "Event_List":
                    var events = ncmb.DataStore(checkDataStore);      
                    events .equalTo("name",e_name)
                    .fetchAll() 
                    .then(function(result){
                        e_class=result[0].get("classEvents");
                        find_geopoint(e_class);
                        eventmap(e_geo.longitude,e_geo.latitude);
                    });
                break;
                default:
                    //geo等optionで取得 
                    /* eventmap(geo.longitude,geo.latitude);*/
                    find_geopoint(checkDataStore);
                    eventmap(e_geo.longitude,e_geo.latitude);
                break;
            }
        } 
        setTimeout(countup, 1000);
    }	else{
        window.alert('キャンセルされました'); 
    }
}

//イベント等検索
function searchInfo(dbName,listId){
    var items='';
    var searchName = '';
    var c_objectId='';
    var c_limit=0;       //取得したクーポン使用回数
    var  today=getDay(); //日付取得
    var flag= document.createDocumentFragment();
    var frame= document.getElementById(listId);


    switch(listId){
        case "searchCoupontems":
            searchName=couponSearch.value;
        break;
        case "searchEventItems":
            searchName=eventSearch.value;
        break;
        case "searchTourismItems":
            searchName=tourismSearch.value;
        break;
        case "searchShopItems":
            searchName=shopSearch.value;
        break;
        case "searchFoodItems":
            searchName=foodSearch.value;
        break;

    }

    document.getElementById(listId).innerHTML= '';　　　//入力欄初期化
    if(searchName==''){
        return;
    }

    var events = ncmb.DataStore(dbName);
    events .lessThanOrEqualTo("startDate",today)
    .greaterThanOrEqualTo("endDate",today)
    .regularExpressionTo("name", searchName)
    .fetchAll()
    .then(function(results) {
        for (var  i= 0; i< results.length; i++) {
            (function() {
                var j=i;
                var result=results[j];

                if(result.endDate=='2999/12/31' ){            //期間が決まっていない
                    deadline='';
                }else{                                                      //決まっている
                    deadline=result.get("startDate")+'～'+result.get("endDate");
                }

                if(dbName=="Coupon_List"){         //クーポンのとき

                    c_objectId=result.get("objectId");

                    c_limit=result.get("limit");
                    if(c_limit<=-1){
                        c_limit='無制限';
                    }else{
                        c_limit+='回まで';
                    }
                    items = document.createElement('ons-list-item');  //アイテム表示
                    items.className="listItem2";
                    items.onclick=function(){onClickItem(result.get("link"),dbName,result.get("objectId"));}; 
                    items.innerHTML='<div class="left"><ons-icon icon="search"></ons-icon></div><div class="center"><span class="list-item__title">'+result.get("name")+'</span><span class="list-item__title">'+c_limit+'　'+deadline+'</span></div>';
                    flag.appendChild(items);       
                    frame.appendChild(flag);      
                }else{
                    items= document.createElement('ons-list-item');
                    items.onclick=function(){onClickItem(result.get("link"),dbName,result.get("objectId"));}; 
                    items.innerHTML='<div class="left"><ons-icon icon="search"></ons-icon></div><div class="center"><span class="list-item__title">'+result.get("name")+'</span><span class="list-item__title">'+deadline+'</span></div>';
                    flag.appendChild(items);       
                    frame.appendChild(flag);
                }
            })();
        }
    })
    .catch(function(err){
        console.log(err); // エラー処理
    }); 
}

