/*目标用户群unique cookie统计

*/
var output = './mlss/';
var key_path ="./mlss/cookie_keywords.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪
var cat_path = "./mlss/target_cookie_category.data";
//1CH02FVtD14nCa8mRo7E  2404,1605,31,1601,2401,2402,2201,2801,1702,3103
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];

var fs = require('fs');
var zu = ['16','24'];
var cookies = {};
var stk =0;
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

function store(cookie){
   if(cookies[cookie]==undefined){
    cookies[cookie]=1;
    stk++;
   }else{
    cookies[cookie]++;
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
      
        store(key);
       
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
      var flag = false;
      var tmp = line.split("\t");
      var ccid = tmp[0];
      var cat = tmp[1].split(",")||[];
      if(ccid!==undefined&&cat!==undefined){
         for (var i = cat.length - 1; i >= 0; i--) {
          
           for (var j = zu.length - 1; j >= 0; j--) {
             if(zu[j]==cat[i].split("|")[0]){
                store(ccid);
                break;
                flag = true;
             }
           };

           if(flag){
              break;
           }
 
         };
      }              
    });
    
 });

}


rs.on('end', function () {

    console.log("数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

    readfile();

    cs.on('end', function () {
       var scount = 0;
       for(var x in cookies){
           scount++;
       }
       console.log("数据跑步完成，目标用户人群个数为"+scount+"校验数据："+stk+"耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

    });
 
}); 
