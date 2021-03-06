/*分组categorys统计
  一级分类，二级分类
*/
var output = './asus/car_count/';
var key_path ="./asus/cookie_keywords.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪
var cat_path = "./asus/cookie_car_categorys.data";
//1CH02FVtD14nCa8mRo7E  2404,1605,31,1601,2401,2402,2201,2801,1702,3103
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];

var fs = require('fs');
var zu = {
  "A":['华硕','ASUS'],
  "B":['联想','LENOVO'],
  "C":['三星','SAMSUNG'],
  "D":['宏碁','ACER'],
  "E":['台电','TECLAST'],
  "F":['昂达','ONDA'],
  "G":['微软','MICROSOFT','Surface']
};
var keys = {};
var cats = {};

var st =0;
var rs = fs.createReadStream(key_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var cs = fs.createReadStream(cat_path, {
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
      var cat = tmp[1].split(",")||[];
      
      for (var vl in keys) {

       var kcid = keys[vl][ccid]; 
     
       if(kcid !=undefined){
            var catTmp;
            
            for (var j = cat.length - 1; j >= 0; j--) {
              catTmp = cat[j].split("|")[0];
              store(cats,catTmp,vl); 
            }

       }

      };

              
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

       console.log("' 此级兴趣总数 '："+term.length+CRLF);

       var s =[];

       for (var j = term.length - 1; j >= 0; j--) {

         s.push(term[j]+"\t"+arg[k][term[j]]);
         
       };

       fs.createWriteStream(output+k+"_car_count.data", {
        flags: 'w+',//a：追加，w+ :复写
        encoding: 'utf-8'
       }).write(s.join(CRLF));

        
  }

  console.log("数据已写入完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
  
};

rs.on('end', function () {

    console.log("数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

    readfile();

    cs.on('end', function () {
       result(cats);
       

    });
 
}); 
