/*cookie对应的多维度数据整合
*/
var fs = require('fs'),
path = require('path'),
url = require('url'),
uaP = require('ua-parser');

var matched = false;
var CRLF = '\n';
var prevline = '';

var timeIn = Date.parse(new Date());
var cLines =0;

var Ttotal = 0;
var cTotal = 1;
var X = 3;
//任务配置文件，包括：数据源文件，输入输出设定
var profile ={
  "taskid":"audi0909",
  "files":{
    "keywords":"domain_cookies.data",
    "category":"cookie_categorys.data",
    "uid":"cookie_uid.data",
    "weibo":"weibo_info.data",
    "location":"cookie_location.data",
    "footprint":"cookie_footprints.data",
    "output":"profile.json"
  },
  "dataroot":"/Users/sanford/workspace/dm-tool"

};
//任务队列
var taskquery = ["keywords","category","location","uid","weibo","footprint"];
var keys = {};
var ctkey = 0;

init(taskquery);

//程序入口
function init(taskArr){
   var iterm ={},taskList={}; 
   var files = profile.files||{};
   for(var x in files){
      iterm[x] =path.join(profile.dataroot,profile.taskid, files[x]);
   }

   for (var i = 0,len =taskArr.length - 1; i <=len; i++) {
    taskList[taskArr[i]]=iterm[taskArr[i]]||"";
   };

   readFiles(taskList,function(){

     var info = setInterval(function () {

     if (Ttotal<=0||X<=0) {
      clearInterval(info);
      
      result();

      }

    if((cTotal-Ttotal)==0){
      X--;
    }
    cTotal =Ttotal;

    console.log("剩余执行任务个数："+Ttotal+CRLF);

    }, 5000); 

  });

}

//循环文件数组，同步读取文件
function readFiles(files,callback){

   var paths = [];
   for(var o in files){
      paths.push(o);
   }
  
   (function next(i, len,callback) {

      if(i<len){

          var pathname = files[paths[i]];
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
                  readline(line,paths[i]);
              });
          });
          rs.on("end",function(){
            
            next(++i,len,callback);
          });

      }else{
        callback();
      }

    }(0, paths.length, function () {

      callback();
  }));

}

//每行文件的读取形式
function readline(line,iterm){
    var casekey = iterm||"",linekey = [],key = "",stk = "",te = {};

    switch(casekey){

        case "keywords" :{
             linekey = line.split("\t");
             key = linekey[0]||"";
             stk = linekey[1]||"";
             te["keywords"]= stk;

          }break; 
        case "category" :{
            linekey = line.split("\t");
            key = linekey[0]||"";
            stk = linekey[1]||"";
            var stkTmp = [];
            var tmpkey = stk.split(",")||[];
            tmpkey.sort(function(c,d){

               return d.split("|")[1]- c.split("|")[1];
            });
            var len = tmpkey.length<=3?(tmpkey.length-1):2;
            for (var i =0; i <= len; i++) {
                stkTmp.push(tmpkey[i]);
            };
            stk = stkTmp.join(",");
            te["category"]= stk;

          }break; 
          case "uid" :{
            linekey = line.split("\t");
            key = linekey[0]||"";
            stk = linekey[1]||"";
            te["uid"]= stk;

            
          }break; 
          case "weibo" :{
            var tmpkey = line.substring(line.indexOf("{"),line.indexOf("}")+1);
            var suid = JSON.parse(tmpkey)["u"]||"";
            var birth = JSON.parse(tmpkey)["by"]||"";
            var gender = JSON.parse(tmpkey)["g"]||"";
            te["age"] = birth||"";
            te["gender"] = (gender==1)?"男":"女";
            for(var x in keys){
              var uidk = keys[x]["uid"];
              if(uidk!=undefined){
                 if(suid == uidk){
                    key = x;
                    break;
                 }
              }
            }

            
          }break; 
          case "location" :{
            linekey = line.split("\t");
            key = linekey[0]||"";
            var province = linekey[1]||"";
            var city = linekey[2]||"";

            te["province"]= province;
            te["city"] = city;

            
          }break; 

          case "footprint" :{

            linekey = line.split("\t");
            key = linekey[0]||"";
            var ua = linekey[2]||"";

            //uaP.parseDevice(str).toString();
      
           // te["device"] = uaP.parseOS(ua).toString()+"("+uaP.parseUA(ua).toString()+")";
            te["OS"] = uaP.parseOS(ua).toString();
            te["UA"] = uaP.parseUA(ua).toString();
            
          }break; 

          default :{
            linekey = line.split("\t");
            key = linekey[0]||"";
            stk = linekey[1]||"";
            te[casekey] = stk;
               
          }break;
    }

    var ccid = keys[key];
    if(ccid==undefined){
        ctkey++;
        keys[key]={};
     }
    for(var o in te){
       var tmp = keys[key][o];
       if(tmp==undefined){
          keys[key][o] = te[o];
       }else{

         // if(tmp.indexOf(te[o])==-1){
         //     keys[key][o] = te[o]+","+tmp; 
         // }
       }
       
    }
   Ttotal--;
    
}

//输出结果文件
function result(){
    var outputpath = path.join(profile.dataroot,profile.taskid, profile.files.output);
   
    var ws = fs.createWriteStream(outputpath, {
        flags: 'w+',//a：追加，w+ :复写
        encoding: 'utf-8'
    });
    //输出json文件
    ws.write(JSON.stringify(keys));

    //writeFile(ws);
   console.log("数据已写入完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
  
}

//按格式要求生成文件
function writeFile(ws){
    var s = "";
    for(var o in keys){
        
      var tmp = "",count = 0;
      for(var a in keys[o]){
        if(a =="uid"){
           continue;
        }
        if(keys[o][a]!=undefined&&keys[o][a]!=""){
          count++;
        }
        tmp += (keys[o][a]||" ")+"\t";
      }
      if(count<=3){
        continue;
      }
      s += o + "\t" + tmp + "\n";

    }
    ws.write(s);           
    ws.end(function () {
        console.log("数据分析写入完毕！");
            
    });

}

