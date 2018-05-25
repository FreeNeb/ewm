// 主网络地址
// var constractAddress = "n1x6u3aJQbjPa8KRw3XkCVC1cXw9d6cjhFE";
// var provider = "https://mainnet.nebulas.io";
// constracthash :cd59c66c7d826a6c953576df8aeb53f24634ccecc5e73e730432b355ac3b66d4
// 测试地址:
var constractAddress = "n1qPJDZ7rHkfpKkbtFFXSuAo8YhGwZXvvUZ";
// constracthash :711e1d3d52336c579d016e3bc73842411158a3e3e92f74df48daf96d7ee38c05
var provider = "https://testnet.nebulas.io";
 
 // for test nebuls
 var nebulas = require("nebulas");
 var Account = nebulas.Account;
 var neb = new nebulas.Neb();
 
 neb.setRequest(new nebulas.HttpRequest(provider));
 var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
 var nebPay = new NebPay(); 
 var serialNumber;

 var uri="";

 
 var to = constractAddress;
 var value = "0.001";

var address ="";
 function getWallectInfo(){
    window.postMessage({
        "target": "contentscript",
        "data": {},
        "method": "getAccount",
    }, "*");

    window.addEventListener('message', function (e) {
        if (e.data && e.data.data) {
            if (e.data.data.account) {//这就是当前钱包中的地址
                console.log(e.data.data.account)
                if (address=="") {
                    address = e.data.data.account;
                    $('#address').text(address);
                }
            }
        }
    });
}
 

 function getQRCountCb(res) {
    console.log("getWishesCountCb: " + JSON.stringify(res.result))
    total = parseInt(res.result);
    
 }

 function getQRCount(type) {
    // simulateCall
    var callFunction = "getMyQRCount";
    var callArgs = [];
    callArgs.push(type);
    console.log(JSON.stringify(callArgs));
    serialNumber = nebPay.simulateCall(to, value, callFunction, JSON.stringify(callArgs), {    //使用nebpay的call接口去调用合约,
            listener: getQRCountCb        //设置listener, 处理交易返回信息
    });
 }

 function createQRCb(res) {
    console.log("createQRCb: " + JSON.stringify(res))
    console.log(res);
    var  message= "";  
    if (res=="Error: Transaction rejected by user") {
       message ="您已经终止了本次二维码的生成!!!"
       $('bigcode').innerHTML='<div class="fail">您终止了二维码生成！</div>';
    }
    else {
        message= "二维码已经生成,请扫码、下载或分享二维码图片，感谢您的使用";  
        $('bigcode').innerHTML='<a href="'+uri+'" target="_blank"><img src="'+uri+'" id="qrcodeimg"/></a>'
        uri="";
    }

    alert(message);
 }


 function createQRInfo(text, bg, fg) {
    var callFunction = "createQRInfo";
    var callArgs = [];
    callArgs.push(text);
    callArgs.push(bg);
    callArgs.push(fg);
    console.log(JSON.stringify(callArgs));
    serialNumber = nebPay.call(to, value, callFunction, JSON.stringify(callArgs), {    //使用nebpay的call接口去调用合约,
            listener: createQRCb        //设置listener, 处理交易返回信息
    });
 }