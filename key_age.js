/*分关键词年龄统计
*/
var output = './doc/key_ages';

var key_path ="./cookie/cookie_keywords.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪

var cat_path = "./cookie/cookie_categorys.data";
//1CH02FVtD14nCa8mRo7E  2404,1605,31,1601,2401,2402,2201,2801,1702,3103

var info_path = './cookie/cookie_info.data';
//1CH04htLCn1CuCz5oJNh  广东  深圳

var uid_path = './cookie/cookie_uid.data';
//1CH00ccGCP5EuvRpF8l8  2681033275

var weibo_path = './cookie/weibo_info.data';
//{"u":"6023087","g":"1","by":"1989","p":"北京","c":"海淀区","l":"北京 海淀区"}
var friends_path = './cookie/uid_friends.data';
//1752586930  2262708465,2455949165,1985482885,2632455163,1793285524

//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];

var fs = require('fs');

var keys = {};
var sexs = {};
var uids = {};
var rs = fs.createReadStream(key_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var wbs = fs.createReadStream(weibo_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var us = fs.createReadStream(uid_path, {
    flags: 'r',
    encoding: 'utf-8'
});


var ws = fs.createWriteStream(output, {
    flags: 'w+',//a：追加，w+ :复写
    encoding: 'utf-8'
});

var matched = false;
var CRLF = '\n';
var prevline = '';

var timeIn = Date.parse(new Date());
var cLines =0;


function uniqueC(g,key){

  if(keys[key] == undefined){
    keys[key] = {};
  }
  if(keys[key][g] ==undefined){
    keys[key][g] = 1 ;

  }else{
    keys[key][g]++;
  }

}

wbs.on('data', function (chunk) {

   var lines = chunk.split(CRLF);

    lines[0] = prevline + lines[0];
    if (chunk.substr(chunk.length - 2) !== CRLF) {
        prevline = lines.pop();
    } else {
        prevline = '';
    }

   cLines+=lines.length;
   console.log("已读取行数为："+cLines+"  已耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

    lines.forEach(function (line) {

      var tmp = line.substring(line.indexOf("{"),line.indexOf("}")+1);

      var suid = JSON.parse(tmp)["u"];
      var age = JSON.parse(tmp)["by"];
      if(age!==undefined){

        sexs[suid] = age;

      }

    });


});



function changeUid(){

us.on('data', function (chunk) {
    var lines = chunk.split(CRLF);

    lines[0] = prevline + lines[0];
    if (chunk.substr(chunk.length - 2) !== CRLF) {
        prevline = lines.pop();
    } else {
        prevline = '';
    }

    cLines+=lines.length;
    console.log("已读取行数为："+cLines+"  已耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

    lines.forEach(function (line) {


      var tmp = line.split("\t"); 
      var scid = tmp[0];
      var suid = tmp[1];
      var kuid = sexs[suid];
      if(kuid!==undefined){

        uids[scid] = kuid;  

      }
      
    });
 
});

}



function readfile(){

  rs.on('data', function (chunk) {
    var lines = chunk.split(CRLF);

    lines[0] = prevline + lines[0];
    if (chunk.substr(chunk.length - 2) !== CRLF) {
        prevline = lines.pop();
    } else {
        prevline = '';
    }

    cLines+=lines.length;
    console.log("已读取行数为："+cLines+"  已耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

    lines.forEach(function (line) {

      var tmp = line.split("\t"); 
      
      var scid = tmp[0];
      var key = tmp[1].split(",");
  
      var kcid = uids[scid];
    
      if(kcid!==undefined){
        
         for (var i = key.length - 1; i >= 0; i--) {

            uniqueC(kcid,key[i]);                   
        
        };
      }
      
    });
 
});

}

wbs.on('end', function () {

    console.log("cookie_uid数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
    changeUid();

    us.on('end',function(){

      console.log("uid数据已经读取完毕！已读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
      readfile();
      

      rs.on('end', function () {

    


      var term =[];

      for(v in keys){
         term.push(v);
      }

      ws.write('有年龄记录的关键字个数为：'+term.length+'个'+ CRLF);
  
      for (var i = term.length - 1; i >= 0; i--) {
        var t =keys[term[i]];
        var m = [];
        for(x in t){
          m.push(x);
        }

         m.sort(function(c,d){
          return t[c]- t[d];
        });

     // ws.write("keywords:' "+term[i]+" '的性别分布为："+CRLF);

      console.log("keywords:' "+term[i]+" '的年龄分布为："+CRLF);

  
        var s = "{'"+term[i]+"':[";

        for (var j = m.length - 1; j >= 0; j--) {

         s+="["+m[j]+":"+t[m[j]]+"],";
         //ws.write("["+m[j]+":"+t[m[j]]+"],");
      
        };
        s = s.substring(0,s.lastIndexOf(','))+"]}";
    
        console.log(s+CRLF);
        ws.write(s+CRLF);

      };


      ws.end(function () {

         console.log('数据跑步完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
      });


     });


    });

}); 