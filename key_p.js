/*分关键词省份，城市统计
*/
var output = './doc/key_p';

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
var cps = {};
var ccs ={};
var rs = fs.createReadStream(key_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var cs = fs.createReadStream(info_path, {
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


function unique(cat,key,arg){

  if(arg[key] == undefined){ 
    arg[key] = {};
  }
  if(arg[key][cat] ==undefined){
    arg[key][cat] = 1 ;

  }else{
    arg[key][cat]++;
  }  

}


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
     
     var stk = tmp[1].split(",");

     var kcid = tmp[0];
     keys[kcid] = stk; 

    });


});

function readfile(){
  
 cs.on('data', function (chunk) {
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
      var ccid = tmp[0];
      var cp = tmp[1];
      var cc = tmp[2];
    
      var kcid = keys[ccid]; 
      if(kcid !== undefined){

         for (var i = kcid.length - 1; i >= 0; i--) {
          if(cp!==undefined){
            unique(cp,kcid[i],cps); 
          }
          if(cc!==undefined){

            unique(cc,kcid[i],ccs); 
          }
         

        };
      }
         
    });
    
 });

}


function result(arg){
  
    var term =[];

      for(v in arg){
         term.push(v);
      }

     //  ws.write('[keywords_counts：'+term.length+']'+ CRLF);
     
      for (var i = term.length - 1; i >= 0; i--) {
        var t =arg[term[i]];
        var m = [];
        for(x in t){
          m.push(x);
        }

        m.sort(function(c,d){
          return t[c]- t[d];
        });
      ws.write("{' "+term[i]+" '："+m.length+"} "+CRLF);

      console.log("关键字:' "+term[i]+" '的区域统计个数为："+m.length+",排名为： "+CRLF);

       var s = "{'"+term[i]+"':";

       for (var j = m.length - 1; j >= 0; j--) {

         s+="["+m[j]+":"+t[m[j]]+"],";
         ws.write(""+m[j]+"\t"+t[m[j]]+CRLF);
         
       };
        s = s.substring(0,s.lastIndexOf(','))+"}";
       
        console.log(s+CRLF);
     // ws.write(s+CRLF);
    };
}


rs.on('end', function () {

    console.log("数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

    readfile();

    cs.on('end', function () {
       result(cps);
       result(ccs);
      
      ws.end(function () {

         console.log('数据跑步完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
      });

    });
 
}); 
