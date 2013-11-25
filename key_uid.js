/*分unique uid总数统计
  uid总数
*/
var output = './doc/uidCount';
var uid_path="./cookie/cookie_uid.data";
//1CH00ccGCP5EuvRpF8l8  2681033275
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];

var fs = require('fs');
var keys = {};
var rs = fs.createReadStream(uid_path, {
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


function unique(key) {

  if(keys[key] == undefined){

    keys[key] = 1;
    ctkey++;

  }else{
    keys[key]++ ;
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
    
     var stk = tmp[1];
     if(stk!==undefined){
        unique(stk);
     }
    });


});
rs.on('end', function () {
   // ws.write(keyword+"总数："+count + CRLF);

   
    var term = [];
    for(v in keys){
      term.push(v);
    };
    ws.write('[uid_count :'+ctkey+',cookie_count:'+cLines+"]校准数据："+ term.length+ CRLF);
    /*
    term.sort(function(a,b){
      return keys[a]- keys[b];
    });

    for (var i = term.length - 1; i >= 0; i--) {
      ws.write("['"+term[i]+"':"+keys[term[i]]+"]"+CRLF);
    };

*/
    ws.end(function () {

      console.log('数据跑步完成！共收集unique uid 个数'+ctkey+'个 校准数据：'+ term.length);
/*
      for (var i = term.length - 1; i >= 0; i--) {

      console.log("unique uid： '"+term[i]+" '的统计量为： "+keys[term[i]]+CRLF);
      };
  */ 
     
    });
}); 