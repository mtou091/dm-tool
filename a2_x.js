/*分品牌 交叉统计
  
*/
var output = './a2live/sb_X_cookie_count.data';
var x_path = './a2live/unique_cookie_count/A_unique_cookie_count.data';
var path1 = "./a2live/cookie_keywords.data";
var path2 = "./a2live/target_category_cookie.data";

var fs = require('fs');


//var x = ['华硕','ASUS'];
var zu = {
  "C":['风暴电音节','STORM','电音节'],
  "D":['舞曲','电音','嘻哈音乐','电子舞曲'],
  "E":['演唱会','迷笛音乐节','西岸音乐节'],
  "F":['Clubbing','泡吧','Clubs','夜店','酒吧','DJ']
};

var zu1 = {
  "A":['33'],
  "B":['3306']
};

var foot = {};
var keys = {};

var uniqueC = {};
var rs = fs.createReadStream(x_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var rs1 = fs.createReadStream(path1, {
    flags: 'r',
    encoding: 'utf-8'
});

var rs2 = fs.createReadStream(path2, {
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

    if(foot[key] == undefined){

      foot[key] = 1;
      ctkey++;

    }else{
      foot[key]++ ;
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
    
    if(key!=undefined){
        keys[key]={};      
    }

 });

});


function readFile(){

rs1.on('data', function (chunk) {

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
    var stk = tmp[1];
    var uud = keys[key];
    if(uud!=undefined&&key!=undefined&&stk!=undefined){
      for(var a in zu){
        for (var i = zu[a].length - 1; i >= 0; i--) {
          if(stk.indexOf(zu[a][i])!=-1){
              unique(key,a);
              break;
          }
        };
      }
       
    }

 });

});

}



function readFile1(){

  rs2.on('data', function (chunk) {

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
      var uud =keys[key];
      if(uud!=undefined&&key!= undefined &&stk!=undefined){
      
        for(var a in zu1){
         var  bra = false; 
         for (var i = zu1[a].length - 1; i >= 0; i--) {

           for (var j = stk.length - 1; j >= 0; j--) {
              if(stk[j] == zu1[a][i]){
                //store(keys,key,a);
                unique(key,a);
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


}

rs.on('end', function (){

   console.log("rs数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
   readFile();
   rs1.on('end',function(){

     console.log("rs数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
     readFile1();
       
     rs2.on('end',function(){
         var term = [];
         for(var v in foot){
          term.push(v);
         };

        
         for (var i = term.length - 1; i >= 0; i--) {
          ws.write(term[i]+"\t"+foot[term[i]]+CRLF);
         };


          ws.end(function () {

          console.log('数据跑步完成！共收集交叉组 '+ctkey+'个'+"  已耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);


          for (var i = term.length - 1; i >= 0; i--) {

          console.log("交叉组： '"+term[i]+" '的统计量为： "+foot[term[i]]+CRLF);
          };
          console.log('数据跑步完成！共收集交叉组'+ctkey+'个'+"  已耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
          

          });

     });
   

   });
  
}); 