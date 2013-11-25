/*分关键词categorys统计
  一级分类，二级分类
*/
var output = './doc/key_cat';
var key_path ="./cookie/cookie_keywords.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪
var cat_path = "./cookie/cookie_categorys.data";
//1CH02FVtD14nCa8mRo7E  2404,1605,31,1601,2401,2402,2201,2801,1702,3103
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];

var fs = require('fs');

var keys = {};
var cats = {};
var cats1 ={};
var rs = fs.createReadStream(key_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var cs = fs.createReadStream(cat_path, {
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


function uniqueC(cat,key){

  if(cats[key] == undefined){ 
    cats[key] = {};
  }
  if(cats[key][cat] ==undefined){
    cats[key][cat] = 1 ;

  }else{
    cats[key][cat]++;
  }  

}

function unique(cat,key){

  if(cats1[key] == undefined){ 
    cats1[key] = {};
  }
  if(cats1[key][cat] ==undefined){
    cats1[key][cat] = 1 ;

  }else{
    cats1[key][cat]++;
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
     
     var stk = tmp[1].split(",");

     var kcid = tmp[0];
     keys[kcid] = stk; 

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
      var s ={};
      var kcid = keys[ccid]; 
      if(kcid !== undefined){

         for (var i = kcid.length - 1; i >= 0; i--) {

            for (var j = cat.length - 1; j >= 0; j--) {

              uniqueC(cat[j],kcid[i]); 
              s[cat[j].substring(0,2)]={};
            }

           for(v in s){

              unique(v,kcid[i]); 
           }

       
        };
      }
         
    });
    
 });

}

function result(arg){
  
    var term =[];

      for(v in arg){
         term.push(v);
      }

     //  ws.write('[keywords_counts：'+term.length+']'+ CRLF);
     
      for (var i = term.length - 1; i >= 0; i--) {
        var t =arg[term[i]];
        var m = [];
        for(x in t){
          m.push(x);
        }

        m.sort(function(c,d){
          return t[c]- t[d];
        });
      ws.write("{' "+term[i]+" '："+m.length+"} "+CRLF);

      console.log("关键字:' "+term[i]+" '的categorys个数为："+m.length+",排名为： "+CRLF);

       var s = "{'"+term[i]+"':";

       for (var j = m.length - 1; j >= 0; j--) {

         s+="["+m[j]+":"+t[m[j]]+"],";
         ws.write(""+m[j]+"\t"+t[m[j]]+CRLF);
         
       };
        s = s.substring(0,s.lastIndexOf(','))+"}";
       
        console.log(s+CRLF);
     // ws.write(s+CRLF);
    };
}


rs.on('end', function () {

    console.log("数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

    readfile();

    cs.on('end', function () {
       result(cats);
       result(cats1);
      
      ws.end(function () {

         console.log('数据跑步完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
      });

    });
 
}); 
