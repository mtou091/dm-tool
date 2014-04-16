/*品牌分组 （七组） unique cookie总数统计
  需求3.竞争品牌分析
*/
var output = './shunya/cookie_count/D_cookie_count.data';
var key_path="./shunya/target_cookie.data";
//1CH03SJp00BppvQaybW1  15,1508
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];

var fs = require('fs');
var redis = require("redis"),
    client = redis.createClient();

var zu1 = {
 // "B":["2101","2102"],
 // "C":['2201'],
  "D":["1205","1201","1207","1202"],
  "E":["1204","1203","1206","2202"],
  "F":["28","2801","2802","2803","2804","2701"],
  "G":["17","1701","1702","1703","1704","1705","1706","1707","1708","1709","1710","1711"]
};
var keys = [];
var rs = fs.createReadStream(key_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var ws = fs.createWriteStream(output, {
    flags: 'a',//a：追加，w+ :复写
    encoding: 'utf-8'
});

var matched = false;
var CRLF = '\n';
var prevline = '';

var timeIn = Date.parse(new Date());
var cLines =0;
var ctkey = 0;
var elem = {"D":1,"E":2,"F":3,"G":4};

client.on("error", function (err) {
        console.log("Error :" + err);
    });
function store(key,a){

  client.select(elem[a], function() { 

    client.set(key, a);

  });


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
    
     var key = tmp[0];
     var stk = tmp[1].split(",");

     if(key!= undefined &&stk!=undefined){
      
        for(var a in zu1){
         var  bra = false; 
         for (var i = zu1[a].length - 1; i >= 0; i--) {

           var len = zu1[a][i].length;

           for (var j = stk.length - 1; j >= 0; j--) {

              if(stk[j].substring(0,len) == zu1[a][i]){
                store(key,a);
                bra = true;
                break;
              }
               
           };

           if(bra){
            break;
           }

          };

        }
       
      }

    });
});



rs.on('end', function () {
    console.log("数据读取完成，已耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
  
    ws.end(function () {

      console.log("数据跑步完成！ 已耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
      client.quit();
    });
}); 