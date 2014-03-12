/*分关键词 unique cookie总数统计
  
*/
var output = './vm/key_cookie.data';
var key_path="./vm/car_cookie.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];

var fs = require('fs');
var keys = {};
var uniqueC = {};
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

function unique(cookie,key) {
  var hash =cookie+'|'+key;
  if(uniqueC[hash]==undefined){
     uniqueC[hash] = 1;

    if(keys[key] == undefined){

      keys[key] = 1;
      ctkey++;

    }else{
      keys[key]++ ;
    }

  }else{

   uniqueC[hash]++;

  }
  
};

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
       var car=[];
       for (var i = stk.length - 1; i >= 0; i--) {
        var t = stk[i].split("|");
        if(t[1]>=0.2){
          car.push(t[0]);
        }

       };

       if(car.length!=0){
          if(keys[key]!=undefined){
            car.push(keys[key]);
            console.log("这个cookie"+key+"重复！"+CRLF);
          }

          keys[key]=car.join(",");

       }else{
         console.log("这个cookie"+key+"全为0.2以下！"+CRLF);
       }
       

      }
     
    });

});

rs.on('end', function () {
   
  /*  console.log('[keywords_count :'+ctkey+ CRLF);
    ws.write('[keywords_count :'+ctkey+ CRLF);
    var term = [];
    for(v in keys){
      term.push(v);
    };

    term.sort(function(a,b){
      return keys[a]- keys[b];
    });

    for (var i = term.length - 1; i >= 0; i--) {
      ws.write(term[i]+"\t"+keys[term[i]]+CRLF);
    };

*/   var aaa ="";
    for(var a in keys){
       aaa += a+"\t"+keys[a]+CRLF; 
    }
    ws.write(aaa);
    ws.end(function () {

      console.log('数据跑步完成！共收集关键字'+ctkey+'个'+"  已耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

/*
      for (var i = term.length - 1; i >= 0; i--) {

      console.log("关键字： '"+term[i]+" '的统计量为： "+keys[term[i]]+CRLF);
      };
    */
      
    });
}); 