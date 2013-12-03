/*分关键词categorys统计
  一级分类，二级分类
*/
var output1 = './yema/ym_intrest_1.data';
var output2 = './yema/ym_intrest_2.data';
var cat_path1 ="./yema/cookie_keywords_2.data";
//1SAzzyPMCMXaAjHYPyPN	1502,1207,2001,20,18,15,1503,1704,26,1402,1604
var cat_path2 = "./yema/cookie_categorys.data";
//1CH02FVtD14nCa8mRo7E  2404,1605,31,1601,2401,2402,2201,2801,1702,3103
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];

var fs = require('fs');

var keys = {};
var cats = {};
var cats1 ={};
var st1 =0;
var st2=0;
var rs = fs.createReadStream(cat_path1, {
    flags: 'r',
    encoding: 'utf-8'
});

var cs = fs.createReadStream(cat_path2, {
    flags: 'r',
    encoding: 'utf-8'
});

var ws = fs.createWriteStream(output1, {
    flags: 'w+',//a：追加，w+ :复写
    encoding: 'utf-8'
});

var ws1 = fs.createWriteStream(output2, {
    flags: 'w+',//a：追加，w+ :复写
    encoding: 'utf-8'
});
var matched = false;
var CRLF = '\n';
var prevline = '';

var timeIn = Date.parse(new Date());
var cLines =0;


function uniqueC(cat){
   st1++;
  if(cats[cat] ==undefined){
    cats[cat] = 1 ;


  }else{
    cats[cat]++;
  }  

}

function unique(cat){
   st2++;
  if(cats1[cat] ==undefined){
    cats1[cat] = 1 ;

  }else{
    cats1[cat]++;
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
      if(key!==undefined){
        keys[key] ={};
      }
     
  });


});

function readfile(){
  
 cs.on('data', function (chunk) {
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
      var ccid = tmp[0];
      var cat = tmp[1].split(",");
      var ss = {};
      var kcid = keys[ccid]; 

      if(kcid !== undefined){

        
      for (var j = cat.length - 1; j >= 0; j--) {

              uniqueC(cat[j]); 
              ss[cat[j].substring(0,2)]={};
           
         }
      for(v in ss){
        unique(v); 
      }
    } 

    });
    
 });

}

function result(arg,arg1){
  
    var term =[];

      for(v in arg1){
         term.push(v);
      }

     //  ws.write('[keywords_counts：'+term.length+']'+ CRLF);
     
      term.sort(function(c,d){
          return arg1[c]- arg1[d];
        });

      arg.write("' 此级兴趣总数 '："+term.length+CRLF);

      console.log("' 此级兴趣总数 '："+term.length+CRLF);

       var s ="";

       for (var j = term.length - 1; j >= 0; j--) {

         s+="["+term[j]+":"+arg1[term[j]]+"],";
         arg.write(term[j]+"\t"+arg1[term[j]]+CRLF);
         
       };
       
        console.log(s+CRLF);
     // ws.write(s+CRLF);
};



rs.on('end', function () {

    console.log("数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
  
    readfile();

    cs.on('end',function(){

       result(ws,cats);
       result(ws1,cats1);

      console.log("匹配到一级兴趣的个数为"+st1);
      console.log("匹配到二级兴趣的个数为"+st2);
      ws.end(function () {

         console.log('一级兴趣数据写入完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
      });

      ws1.end(function () {

         console.log('二级兴趣数据跑步完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
      }); 
  });
 
}); 
