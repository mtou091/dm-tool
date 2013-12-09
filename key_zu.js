/*单个文件中，分组统计 unique cookie 数据
分组交叉统计 unique cookie 数据
total unique cookie 数据
*/
var output = './las/las_zu_unique_cookie_count';
var path1 ="./las/cookie_uniq_keywords.data";//1
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];
var fs = require('fs');
var zu1 =["Lascana"];
var zu2 =["维多利亚的秘密","Victoria's Secret","Victorias Secret"];
var zu3 =["拉佩拉","Laperla","La Perla","Lascana"];
//var zu3 =["丰胸","胸部发育","胸型塑造","乳房塑形"];
var resultArry={};
var keys = {};
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
   }
   if(arg == "b"){
    resultArry[key]+=2;
   }
   if(arg == "c"){
    resultArry[key]+=1;
   }
  }else{
   // console.log("重复的hash为："+hash+CRLF);
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

rs.on('end', function () {

      console.log("rs数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

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
      console.log("此分组全部unique cookie总数为："+len+CRLF);
      /*
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
    */
      console.log("分组一的unique_cookie_count:"+((ss['4']==undefined?0:ss['4'])+(ss['5']==undefined?0:ss['5'])+(ss['6']==undefined?0:ss['6'])+(ss['7']==undefined?0:ss['7']))+CRLF);
      console.log("分组二的unique_cookie_count:"+((ss['2']==undefined?0:ss['2'])+(ss['3']==undefined?0:ss['3'])+(ss['6']==undefined?0:ss['6'])+(ss['7']==undefined?0:ss['7']))+CRLF);
      console.log("分组三的unique_cookie_count:"+((ss['1']==undefined?0:ss['1'])+(ss['5']==undefined?0:ss['5'])+(ss['3']==undefined?0:ss['3'])+(ss['7']==undefined?0:ss['7']))+CRLF);
      console.log("含有分组一，二的数据个数为的:"+((ss['6']==undefined?0:ss['6'])+(ss['7']==undefined?0:ss['7']))+CRLF);
      console.log("含有分组一，三的数据个数为的:"+((ss['5']==undefined?0:ss['5'])+(ss['7']==undefined?0:ss['7']))+CRLF);
      console.log("含有分组二，三的数据个数为的:"+((ss['3']==undefined?0:ss['3'])+(ss['7']==undefined?0:ss['7']))+CRLF);
      console.log("只含有分组一的数据个数为："+(ss['4']==undefined?0:ss['4'])+CRLF);
      console.log("只含有分组二的数据个数为："+(ss['2']==undefined?0:ss['2'])+CRLF);
      console.log("只含有分组三的数据个数为："+(ss['1']==undefined?0:ss['1'])+CRLF);
      console.log("只含有分组一，二的数据个数为："+(ss['6']==undefined?0:ss['6'])+CRLF);
      console.log("只含有分组一，三的数据个数为："+(ss['5']==undefined?0:ss['5'])+CRLF);
      console.log("只含有分组二，三的数据个数为："+(ss['3']==undefined?0:ss['3'])+CRLF);
      console.log("只含有分组一，二，三的数据个数为："+(ss['7']==undefined?0:ss['7'])+CRLF);
      ws.end(function () {
          console.log('数据跑步完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
             
      });

}); 