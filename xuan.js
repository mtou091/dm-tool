/*分地域过滤cookie
*/
var output = './cookie/gpk.data';
var key_path="./doc/nzj_cookie_info.data";
//1CH00K0VD1BMN1scYKeH  广东  深圳
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];

var fs = require('fs');
//var keys = ["浙江","江苏","山东","上海","安徽"];
var keys= ["黑龙江","辽宁","吉林","河北","山西","北京","天津"];
var rs = fs.createReadStream(key_path, {
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
var ctkey = 0;


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

     for (var i = keys.length - 1; i >= 0; i--) {
        if(line.indexOf(keys[i])!= -1){
          console.log(keys[i]+CRLF);
          ws.write(line+CRLF);
          ctkey++;
          break;
        }
     };

    });


});
rs.on('end', function () {
   console.log('数据跑步完成！收集:'+ctkey+"行"+CRLF);
    ws.end(function () {

      console.log('数据跑步完成！');
      
    });
}); 
