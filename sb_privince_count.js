/*分关键词省份，城市统计
*/
var output = './mlss/';
var key_path ="./mlss/cookie_keywords.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪

var info_path = './mlss/cookie_location.data';
//1CH04htLCn1CuCz5oJNh  广东  深圳

var fs = require('fs');
var keys ={};
var cps = {};
var ccs ={};

var zu ={
  "丝芙兰":["丝芙兰","SEPHORA"],
  "聚美优品":["聚美优品"],
  "乐蜂":["乐蜂"]
};

var rs = fs.createReadStream(key_path, {
    flags: 'r',
    encoding: 'utf-8'
});
var cs = fs.createReadStream(info_path, {
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

function readFile(){

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
      var cp = tmp[1];
      var cc = tmp[2];
      var ccid = tmp[0];

      for (var v in keys) {

       var kcid = keys[v][ccid]; 
     
       if(kcid !== undefined){
         if(cp!==undefined&&cp!=""){
            store(cps,cp,v); 
          }

          if(cc!==undefined&&cc!=""){

            store(ccs,cc,v); 
          }
       }

      };
    
    });
    
 });
}

function result(arg,r){
  
    for(var k in arg){

      var term =[];

      for(var v in arg[k]){
         term.push(v);
      }     
      term.sort(function(c,d){
          return arg[k][c]- arg[k][d];
        });

       console.log("' 区域统计个数 '："+term.length+CRLF);

       var s =[];

       for (var j = term.length - 1; j >= 0; j--) {

         s.push(term[j]+"\t"+arg[k][term[j]]);
         
       };

       fs.createWriteStream(output+r+"_count/"+k+"_"+r+"_count.data", {
        flags: 'w+',//a：追加，w+ :复写
        encoding: 'utf-8'
       }).write(s.join(CRLF));

        
  }

  console.log(r+"数据已写入完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
  
};


 rs.on('end',function(){

    console.log("原始数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
    readFile();
    cs.on('end', function () {

       console.log("数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

       result(cps,'province');
       result(ccs,'city');
           
  }); 

});
