/*分关键词省份，城市统计
*/
var output1 = './yema/xfl_privince_count.data';
var output2 = './yema/xfl_city_count.data';

var key_path ="./yema/cookie_keywords_3.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪

var cat_path = "./cookie/cookie_categorys.data";
//1CH02FVtD14nCa8mRo7E  2404,1605,31,1601,2401,2402,2201,2801,1702,3103

var info_path = './yema/cookie_info.data';
//1CH04htLCn1CuCz5oJNh  广东  深圳

var uid_path = './cookie/cookie_uid.data';
//1CH00ccGCP5EuvRpF8l8  2681033275

var weibo_path = './cookie/weibo_info.data';
//{"u":"6023087","g":"1","by":"1989","p":"北京","c":"海淀区","l":"北京 海淀区"}
var friends_path = './cookie/uid_friends.data';
//1752586930  2262708465,2455949165,1985482885,2632455163,1793285524




var fs = require('fs');
var keys ={};
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

var ws = fs.createWriteStream(output1, {
    flags: 'w+',//a：追加，w+ :复写
    encoding: 'utf-8'
});
var ws1 = fs.createWriteStream(output2, {
    flags: 'w+',//a：追加，w+ :复写
    encoding: 'utf-8'
});

var matched = false;
var CRLF = '\n';
var prevline = '';

var timeIn = Date.parse(new Date());
var cLines =0;
var stkey =0;

function unique(cat,arg){

  if(arg[cat] ==undefined){
    arg[cat] = 1 ;
    
  }else{
    arg[cat]++;
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
     


     var kcid = tmp[0];
     if(kcid!==undefined){
       keys[kcid] ={}; 
     }
     

    });


});


  
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
      var cp = tmp[1];
      var cc = tmp[2];

      var ccid = tmp[0];
     
      var kcid = keys[ccid]; 
      if(kcid !== undefined){
          stkey++;
          if(cp!==undefined){
            unique(cp,cps); 
          }

          if(cc!==undefined){

            unique(cc,ccs); 
          }

     }
    
    });
    
 });


function result(arg,arg1){
  
    var term =[];

      for(v in arg){
         term.push(v);
      }

     //  ws.write('[keywords_counts：'+term.length+']'+ CRLF);

        term.sort(function(c,d){
          return arg[c]- arg[d];
        });
      arg1.write("区域统计个数为："+term.length+",排名为： "+CRLF);

      console.log("区域统计个数为："+term.length+",排名为： "+CRLF);

       var s = "";

       for (var j = term.length - 1; j >= 0; j--) {

         s+="["+term[j]+":"+arg[term[j]]+"],";
         arg1.write(""+term[j]+"\t"+arg[term[j]]+CRLF);
         
       };
       
        console.log(s+CRLF);
     // ws.write(s+CRLF);
};

rs.on('end',function(){


      console.log("数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
     
    
      cs.on('end', function () {

         console.log("数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

         result(cps,ws);
         result(ccs,ws1);
      
         ws.end(function () {

           console.log('ws数据跑步完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
         });
          
         ws1.end(function () {
 
           console.log('ws1数据跑步完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
         });
        console.log("匹配到城市数据"+stkey+CRLF);
      }); 
  });
