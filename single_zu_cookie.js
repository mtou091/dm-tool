/*单个文件中，分组统计 unique cookie 数据
分组交叉统计 unique cookie 数据 
 total unique cookie 数据 
*/
var output = './yema/unique_cookie_count';
var path1 ="./yema/cookie_keywords.data";//1
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];
var fs = require('fs');
var zu1 =["肌肉车","肌肉跑车","肌肉型跑车"];
var zu2 =["福特 野马","Ford Mustang"];
var zu3 =["雪佛兰 科迈罗","Chevrolet Camaro"];
var resultArry={};
var keys = {};
var stkey1=0,stkey2=0,stkey3=0;

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
  var hash = key+"|"+arg;
  if(keys[hash]==undefined){
    keys[hash] = 1 ;
    if(resultArry[key]==undefined){
      resultArry[key]=0;
    }
   if(arg == "a"){ 
    resultArry[key]+=4;
      stkey1++;
   }
   if(arg == "b"){
    resultArry[key]+=2;
      stkey2++;
   }
   if(arg == "c"){
    resultArry[key]+=1;
      stkey3++;
   }
  }else{
    console.log("重复的hash为："+hash+CRLF);
    keys[hash]++;
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
                
                unique(key,"a"); 
                break;
             }
          };
          for (var k = 0; k < zu2.length; k++) {
             if(cats.indexOf(zu2[k])!=-1){
                
                unique(key,"b"); 
                break;
             }
          };
          for (var l = 0; l < zu3.length; l++) {
             if(cats.indexOf(zu3[l])!=-1){
                
                unique(key,"c"); 
                break;
             }
          };
      }
      
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
      var ss ={},tmpn,len=0;
      for(var x in resultArry){
         len++;
        tmpn = ss[resultArry[x]];
         if(tmpn==undefined){
          ss[resultArry[x]]=1;
         }else{
          ss[resultArry[x]]++;
         }
      }

      console.log(ss);
      console.log("unique cookie总数为："+len+CRLF);
      for(var s in ss){
        switch(s){
          case '0' : {
            console.log("不含有分组的数据个数为："+ss[s]+CRLF);
          }break;
          case '1' : {
            console.log("只含有分组三的数据个数为："+ss[s]+CRLF);
          }break;
          case '2' : {
            console.log("只含有分组二的数据个数为："+ss[s]+CRLF);
          }break;
          case '3' : {
            console.log("含有分组二，三的数据个数为："+ss[s]+CRLF);
          }break;
          case '4' : {
            console.log("只含有分组一的数据个数为："+ss[s]+CRLF);
          }break;
          case '5' : {
            console.log("含有分组三，一的数据个数为："+ss[s]+CRLF);
          }break;
          case '6' : {
            console.log("含有分组一，二的数据个数为："+ss[s]+CRLF);
          }break;
          case '7' : {
            console.log("含有分组一，二，三的数据个数为："+ss[s]+CRLF);
          }break;

        }
        
      }
      

      ws.end(function () {
          console.log('数据跑步完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
                //console.log("unique_cookie_count:"+stkey+CRLF);
      });
 
}); 
