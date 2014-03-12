/*分关键词年龄统计
*/
var output = './mlss/birthday_count/';
var key_path ="./mlss/cookie_keywords.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪

var uid_path = './mlss/cookie_uid.data';
//1CH00ccGCP5EuvRpF8l8  2681033275

var weibo_path = './mlss/weibo_info.data';
//{"u":"6023087","g":"1","by":"1989","p":"北京","c":"海淀区","l":"北京 海淀区"}

//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];

var fs = require('fs');

var keys = {};
var sexs = {};
var uids = {};
var zu ={
  "丝芙兰":["丝芙兰","SEPHORA"],
  "聚美优品":["聚美优品"],
  "乐蜂":["乐蜂"]
};
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

var matched = false;
var CRLF = '\n';
var prevline = '';

var timeIn = Date.parse(new Date());
var cLines =0;

function store(arg,cookie,zu){
   if(arg[zu]==undefined){
     arg[zu]={};
   }
   if(arg[zu][cookie]==undefined){
    arg[zu][cookie]=1;
   }else{
    arg[zu][cookie]++;
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
    
     var key = tmp[0];
     var stk = tmp[1];

     if(key!= undefined &&stk!=undefined){
      
        for(var a in zu){
                   
         for (var i = zu[a].length - 1; i >= 0; i--) {

           if(stk.indexOf(zu[a][i])!=-1){

             store(keys,key,a);
             break;

            }
          };

        }
       
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
     var uuid = tmp[1];
     var ucid = tmp[0];
     if(uuid!==undefined&&ucid!==undefined){
      for (var vl in keys) {

       var kcid = keys[vl][ucid]; 
     
       if(kcid !==undefined){
           store(uids,uuid,vl);

       }

      };
    }
      
  });
 
 });

}



function readfile(){
 
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
      var g = JSON.parse(tmp)["by"];
      if(suid!==undefined&&g!==undefined){
        
        for (var ud in uids) {

          var kuid = uids[ud][suid]; 
     
          if(kuid !==undefined){
            store(sexs,g,ud);

          }

        };

      }
      
    });
 
  });

}

function result(arg){

  for(var k in arg){

      var term =[];

      for(var v in arg[k]){
         term.push(v);
      }     
      term.sort(function(c,d){
          return arg[k][c]- arg[k][d];
        });

       console.log("' 此组年龄人数 '："+term.length+CRLF);

       var s =[];

       for (var j = term.length - 1; j >= 0; j--) {

         s.push(term[j]+"\t"+arg[k][term[j]]);
         
       };

       fs.createWriteStream(output+k+"_birth_count.data", {
        flags: 'w+',//a：追加，w+ :复写
        encoding: 'utf-8'
       }).write(s.join(CRLF));

        
  }

  console.log("数据已写入完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
  
};


rs.on('end', function () {

    console.log("keywords数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
    changeUid();

    us.on('end',function(){

      console.log("uid数据已经读取完毕！已读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
      readfile();
      
 
      wbs.on('end', function () {

        result(sexs);

     });


    });

}); 