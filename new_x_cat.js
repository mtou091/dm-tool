/*分组交叉 的interest 分析
*/
var output = './ford0915/x_interest/';
var path1 ="./ford0915/cookie_keywords.data";//1
var cat_path ="./ford0915/cookie_categorys.data";
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];
var fs = require('fs');
var cs = fs.createReadStream(cat_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var zu ={
 "A1":["长轴|轻客"],
 "A2":["短轴|轻客"],
 "A3":["欧系|轻客"],
 "A4":["日韩系|轻客","日系|轻客"]

};
var score = {"A1":0,"A2":1,"A3":2,"A4":3};
var resultArry={}
var xkeys = {};

var scoreArr = [];

for(var o in score){
    scoreArr.push(o);
}
scoreArr.sort();

var scorLen = scoreArr.length;

//规则说明--{路径:[分组规则,score(true|false)],<>}
var rule = {"./ford0915/cookie_keywords.data":[zu,false]};

var matched = false;
var CRLF = '\n';
var prevline = '';
var timeIn = Date.parse(new Date());
var cLines =0;

var Ttotal = 0;
var cTotal = 1;
var X = 3;
var uniquC = 0;
var cats = {};
var cats1 = {};
//确保文件读取完成
readFiles(rule,function(){


   result();
   /*

    var info = setInterval(function () {

     if (Ttotal<=0||X<=0) {

      result();

      clearInterval(info);
      

      }

    if((cTotal-Ttotal)==0){
      X--;
    }
    cTotal =Ttotal;

    console.log("剩余执行任务个数："+Ttotal+CRLF);

    }, 5000); 

*/

});
//每行文件的读取形式
function readline(line,rule){
     var zu = rule[0],scr = rule[1];
     var core = 0;//该cookie分数初始化
     var tmp = line.split("\t");
     var key = tmp[0];
     var stk = tmp[1];
     var tmpk = stk.split(",");
     if(key!= undefined &&stk!=undefined){
        
        for(var a in zu){
                   
         for (var i = zu[a].length - 1; i >= 0; i--) {
            var fla = false;
            for (var j = tmpk.length - 1; j >= 0; j--) {

              var keyword = scr?tmpk[j].split("|")[0]:tmpk[j];

              if(keyword== zu[a][i]){
                 
                 core = core|Math.pow(2,score[a]);//cookie打分
                 fla = true;
                 break;
              }
            }

            if(fla){
              break;
            }

          }

        }
       
      }
    storeX(key,core);//存储分数
    Ttotal--;
}
//循环文件数组，异步读取文件
function readFiles(files,callback){

   var paths = [];
   for(var path in files){
      paths.push(path);
   }
  
   (function (i, len, count, callback) {

      for(; i < len; ++i) {
          (function (i) {

             var pathname = paths[i];
                console.log(pathname);
                var prevline = "";
                var rs = fs.createReadStream(pathname,
                     {flags: 'r',
                      encoding: 'utf-8'
                    });
                rs.on('error', function (error) {
                    console.log("Caught", error);
                });
                rs.on("data",function(chunk){
                    var lines = chunk.split(CRLF);
                    lines[0] = prevline + lines[0];
                    if (chunk.substr(chunk.length - 2) !== CRLF) {
                        prevline = lines.pop();
                    } else {
                        prevline = '';
                    }
                    cLines+=lines.length;
                    console.log("已读取行数为："+cLines+"  已耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

                    lines.forEach(function(line){
                       Ttotal++;
                       readline(line,files[paths[i]]);
                    });
                });
                rs.on("end",function(){

                   if (++count === len) {

                      callback();
                   }
                });
          }(i));
       }
    }(0, paths.length, 0, function () {

      callback();
  }));

}
//将统计分数转化为01字符串计算分组信息
function getStr(num,len){
  var str = new Number(num).toString(2);
  strLen = str.length;

  if(strLen <len){

    for (var i = 0; i < len-strLen; i++) {
      str = "0"+str;
    };
  }

  return str.split("").reverse().join(""); 
}


function storeX(key,sco){

  var strA = getStr(sco,scorLen);

  for (var i = 0;i<scorLen;i++) {
    var index = scoreArr[i];
      //交叉统计
    for (var j = i+1;j<scorLen;j++) {
        var x1 = scoreArr[j];
      
        if(strA.charAt(score[index])==="1"&&strA.charAt(score[x1])==="1"){
            
            if(xkeys[index+"&"+x1]==undefined){
            xkeys[index+"&"+x1] = {};
            }
            xkeys[index+"&"+x1][key]={};

        }

    };

  }
}

function readCategorys(line){
   
      var tmp = line.split("\t");
      var ccid = tmp[0];
      var cat = tmp[1].split(",")||[];
      var s ={};
      
      for (var vl in xkeys) {

       var kcid = xkeys[vl][ccid]; 
     
       if(kcid !=undefined){
            var catTmp;
            
            for (var j = cat.length - 1; j >= 0; j--) {
              catTmp = cat[j].split("|")[0];
              store(cats1,catTmp,vl); 
              s[catTmp.substring(0,2)]={};
            }

           for(var v in s){

              store(cats,v,vl); 
           }

       }

      } 

}

//存储数据结构
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

//输出结果
function result() {


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
     readCategorys(line);

    });


  });

  cs.on("end",function(){

     putOut(cats,"interest2");
     putOut(cats1,"interest1");


  });

 
}

function putOut(arg,p){

 for(var k in arg){

      var term =[];

      for(var v in arg[k]){
         term.push(v);
      }     
      term.sort(function(c,d){
          return arg[k][c]- arg[k][d];
      });

       console.log("' 此组人数 '："+term.length+CRLF);

       var s =[];

       for (var j = term.length - 1; j >= 0; j--) {
         var tmp = term[j];        
         
         s.push(tmp+"\t"+arg[k][tmp]);
                 
       };

       fs.createWriteStream(output+k+"_"+p+"_count.data", {
        flags: 'w+',//a：追加，w+ :复写
        encoding: 'utf-8'
       }).write(s.join(CRLF));

        
  }

  console.log("数据已写入完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
  
}
     