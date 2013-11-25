/*分关键词粉丝统计
*/
var output = './doc/key_friends';

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

var fans = {};
var rs = fs.createReadStream(friends_path, {
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


function uniqueC(key){

  if(fans[key] ==undefined){
    fans[key] = 1 ;

  }else{
    fans[key]++;
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
     for (var i = stk.length - 1; i >= 0; i--) {
       uniqueC(stk[i]);
     };
  
    });


});


rs.on('end', function () {

    console.log("fans数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
    

      var term =[];

      for(v in fans){
         term.push(v);
      }

      term.sort(function(c,d){
          return fans[d]- fans[c];
        });
      ws.write("此类人群共同关注的top200为："+CRLF);
      console.log("此类人群共同关注的top200为："+CRLF);

          var j = term.length;
        for (var i=0 ; i < j; i++) {

           ws.write(term[i]+":"+fans[term[i]]+CRLF);
           console.log(term[i]+":"+fans[term[i]]+CRLF);

           if( i>= 200){
             break;
           }
       
        };

 
      ws.end(function () {

         console.log('数据跑步完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
      });

}); 