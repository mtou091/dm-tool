/*单个文件中，分组统计 unique cookie 数据
*分组交叉统计 unique cookie 数据
*total unique cookie 数据
*/
var output = './bank/zu_cookie_count.data';
var path1 ="./bank/cookie_keywords.data";//1
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];
var fs = require('fs');
var ws = fs.createWriteStream(output, {
    flags: 'a',//a：追加，w+ :复写
    encoding: 'utf-8'
});

var zu ={
  "A":['小额信贷','网购分期','银行贷款','贷款利率','无抵押小额贷款','个人贷款','身份证信用贷款','民间信贷','消费信贷','个人创业贷款','个人住房贷款','私人贷款利息','贷款担保','分期还款','首付率','公积金贷款','信用记录','按揭','车贷','提前还款'],
  "B":['信用卡积分','刷卡手续费','异地取款','银行开户','汇率','存款利息','申请信用卡','签帐额','信用卡还款','异地汇款','个人所得税','利率计算器','刷卡套现','信用卡比较','信用卡取现','信用卡额度','信用卡分期','信用卡透支','境外人民币支付','银行商户'],
  "C":['汇率','理财产品','余额宝','财付通','大盘','期货行情','外汇牌价','分红比较','基金比较','互联网金融','金价','信托产品','人民币走势','房地产政策','股票推荐','个股点评','房地产信托','房地产税','外汇牌价','股票报价']
};
var score = {"A":0,"B":1,"C":2};
var resultArry={};
var keys = {};
//规则说明--{路径:[分组规则,score(true|false)],<>}
var rule = {"./bank/cookie_keywords.data":[zu,false]};

var matched = false;
var CRLF = '\n';
var prevline = '';
var timeIn = Date.parse(new Date());
var cLines =0;

var Ttotal = 0;
var cTotal = 1;
var X = 3;
var uniquC = 0;

//确保文件读取完成
readFiles(rule,function(){

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
                 
                 core += Math.pow(2,score[a]);//cookie打分
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
    store(key,core);//存储分数
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
  return str ;
}
//存储分组信息
function store(key,arg){
  
  if(keys[key]==undefined){
    keys[key] = 1 ;
    uniquC ++;
   // arg = getStr(arg,3);//存储为字符串

    if(resultArry[arg]==undefined){
      resultArry[arg] = 1;
    }else{
      resultArry[arg] += 1;
    }
       
  }else{
   // console.log("重复的cookie为："+key+CRLF);
    keys[key]++;
  } 

}
//输出结果
function result() {

      console.log("数据已经读取完毕！共读取:' "+cLines+"  行,共有unique cookie数量："+uniquC+"耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
      ws.write("unique cookie"+"\t"+uniquC+CRLF);
      var resu ={},xxx = {},zuArry = [];

      for(var o in score){
        zuArry.push(o);
      }
      zuArry.sort();

      var zuLen = zuArry.length;

      for(var x in resultArry){

          var strA = getStr(x,zuLen);
          console.log(strA+","+resultArry[x]);
          ws.write(strA+"\t"+resultArry);

          for (var i = 0;i<zuLen;i++) {
              var index = zuArry[i];
              //分组统计
              if(resu[index]==undefined){
                 resu[index] = 0;
              }
              resu[index] += (strA.charAt(score[index])==="1")?resultArry[x]:0;
    
              //交叉统计
              for (var j = i+1;j<zuLen;j++) {
                 var x1 = zuArry[j];
                 if(xxx[index+"&"+x1]==undefined){
                    xxx[index+"&"+x1] = 0;
                 }
                 xxx[index+"&"+x1] += (strA.charAt(score[index])==="1"&&strA.charAt(score[x1])==="1")?resultArry[x]:0;

              };

          }
      }
      //分组数据输出
     for(var p in resu){
       console.log("组:"+p+"统计个数="+resu[p]+CRLF);
       ws.write(p+"\t"+resu[p]+CRLF);
     }
     //交叉统计输出

     for(var q in xxx){
       console.log("组合:"+q+"统计个数="+xxx[q]+CRLF);
       ws.write(q+"\t"+xxx[q]+CRLF);
     }

     ws.end(function () {

        console.log('数据跑步完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
                
      });
}
     