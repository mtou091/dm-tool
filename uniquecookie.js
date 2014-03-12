/*单个文件中，分组统计 unique cookie 数据
分组交叉统计 unique cookie 数据 
 total unique cookie 数据 
*/
var output = './las/unique_cookie_count';
var path1 ="./las/cookie_keywords.data";//1
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];
var fs = require('fs');
var zu1 =["肌肉车","肌肉跑车","肌肉型跑车"];
var zu2 =["福特 野马","Ford Mustang"];
var zu3 =["雪佛兰 科迈罗","Chevrolet Camaro"];
var a=0,b=0,c=0,resultArry={};
var keys = {};
var keys1 = {};
var keys2 = {};
var keys3 = {};
var stkey = 0;
var stkey1 =0;
var stkey2 =0;
var stkey3 =0;
var rs = fs.createReadStream(path1, {
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


function unique(key,arg){
  if(arg[key]==undefined){
    arg[key] = 1 ;
   if(arg == keys1){ 
      a =1;
      stkey1++;
   }
   if(arg == keys2){
      b =1;
      stkey2++;
   }
   if(arg == keys3){
      c =1;
      stkey3++;
   }
  }else{
    arg[key]++;
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
      var cats = tmp[1] ,tmpkey =0;
      if(key !== undefined&&cats!==undefined){

          for (var j = 0; j < zu1.length; j++) {
             if(cats.indexOf(zu1[j])!=-1){//此处有待讨论
                
                unique(key,keys1); 
                break;
             }
          };
          for (var k = 0; k < zu2.length; k++) {
             if(cats.indexOf(zu2[k])!=-1){
                
                unique(key,keys2); 
                break;
             }
          };
          for (var l = 0; l < zu3.length; l++) {
             if(cats.indexOf(zu3[l])!=-1){
                
                unique(key,keys3); 
                break;
             }
          };
      }
     tmpkey = a*4+b*2+c;
     if(resultArry[tmpkey]==undefined){
        resultArry[tmpkey]=1;
     }else{
        resultArry[tmpkey]++;
     }
     a=0;b=0;c=0;
      
    });
    


});

function result(arg){
  
    var term =[];

      for(v in arg){
         term.push(v);
      }

      ws.write('[二次验证keywords_counts：'+term.length+']'+ CRLF);
      console.log('[二次验证keywords_counts：'+term.length+']'+ CRLF);
     
}


rs.on('end', function () {

      console.log("rs数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
      console.log("分组一的unique_cookie_count:"+stkey1+CRLF);
      console.log("分组二的unique_cookie_count:"+stkey2+CRLF);
      console.log("分组三的unique_cookie_count:"+stkey3+CRLF);
      
      result(keys1);
      result(keys2);
      result(keys3);
      console.log(resultArry);
      for(var s in resultArry){
        switch(s){
          case 0 : {
            console.log("不含有分组的数据个数为："+resultArry[s]+CRLF);
          }break;
          case 1 : {
            console.log("只含有分组三的数据个数为："+resultArry[s]+CRLF);
          }break;
          case 2 : {
            console.log("只含有分组二的数据个数为："+resultArry[s]+CRLF);
          }break;
          case 3 : {
            console.log("含有分组二，三的数据个数为："+resultArry[s]+CRLF);
          }break;
          case 4 : {
            console.log("只含有分组一的数据个数为："+resultArry[s]+CRLF);
          }break;
          case 5 : {
            console.log("含有分组三，一的数据个数为："+resultArry[s]+CRLF);
          }break;
          case 6 : {
            console.log("含有分组一，二的数据个数为："+resultArry[s]+CRLF);
          }break;
          case 7 : {
            console.log("含有分组一，二，三的数据个数为："+resultArry[s]+CRLF);
          }break;

        }
        
      }
      

      ws.end(function () {
          console.log('数据跑步完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
                //console.log("unique_cookie_count:"+stkey+CRLF);
      });
 
}); 
