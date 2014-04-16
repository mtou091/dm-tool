/*分关键词省份，城市统计
*/
var output = './shunya/';
var key_path =output+"cookie_keywords.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪

var cat_path = output+"cookie_categorys.data";
//1CH01hBIBO5P8nFgIpO6  1708|0.34602,28|0.26433,16|0.24704,1207|0.22241

var cat_key_path = output+"target_cookie.data";
//1CH01hBIBO5P8nFgIpO6  1708,28,16

var uid_path = output+'cookie_uid.data';
//1CH00ccGCP5EuvRpF8l8  2681033275

var weibo_path = output+'weibo_info.data';
//{"u":"389186","g":"1","by":"1986","p":"北京","c":"东城区","l":"北京 东城区"}

var info_path = output+'cookie_location.data';
//1CH04htLCn1CuCz5oJNh  广东  深圳

var friends_path = output+'uid_friends.data';
//
var domain_path = output+ "cookie_footprints.data";

var fs = require('fs'),
path = require('path'),
url = require('url');//,
redis = require("redis"),
client = redis.createClient();

client.on("error", function (err) {
        console.log("Error :" + err);
});

var keys ={}; //关键字
var cats = {};//一级兴趣
var cats1 = {};//二级兴趣
var uids = {};//微博id
var fans = {};//共同关注
var cps = {};//省份统计
var ccs ={};//城市关注
var sexs = {};//年龄统计
var domains = {};//域名统计



var zu ={
 // "A":["平安银行","余额宝","融360","91金融超市"],
  //"A1":["平安银行"],
 // "A2":["余额宝"],
 // "A3":["融360"],
 // "A4":["91金融超市"]//,
 // "B":["保险","外币","保值"],
 // "C":["婚博会"]
 "X":[""]
};

var zu1 = {
 // "B":["2101","2102"],
  //"C":['2201']//,
 // "D":["1205","1201","1207","1202"],
 // "E":["1204","1203","1206","2202"],
 // "F":["28","2701"],
  "G":["17"]
};
//输入流

var rs = fs.createReadStream(domain_path, {
    flags: 'r',
    encoding: 'utf-8'
});
var cs = fs.createReadStream(cat_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var us = fs.createReadStream(uid_path, {
    flags: 'r',
    encoding: 'utf-8'
});
var wbs = fs.createReadStream(weibo_path, {
    flags: 'r',
    encoding: 'utf-8'
});
var is = fs.createReadStream(info_path, {
    flags: 'r',
    encoding: 'utf-8'
});
var frs = fs.createReadStream(friends_path, {
    flags: 'r',
    encoding: 'utf-8'
});
var dos = fs.createReadStream(domain_path, {
    flags: 'r',
    encoding: 'utf-8'
});
var tars = fs.createReadStream(cat_key_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var matched = false;
var CRLF = '\n';
var prevline = '';

var timeIn = Date.parse(new Date());
var cLines =0;
var elem = {"D":1,"E":2,"F":3,"G":4};
var menu = {
  'keywords':[rs],
  'category':[rs,cs],
  'uid':[rs,us],
  'location':[rs,is],
  'birth':[rs,us,wbs],
  'friends':[rs,us,frs],
  'domain':[rs,dos],
  'combine':[rs,tars]

};//主要任务链条

var chain = {
  "keywords":rs,
  "category":cs,
  "uid":us,
  "location":is,
  "friends":frs,
  "birth":wbs,
  "domain":dos,
  "combine":tars
};//输入流

var chainOut = {
  "keywords":[{'unique_cookie':keys}],
  "category":[{'interest1':cats},{'interest2':cats1}],
  "uid":[{'unique_uid':uids}],
  "location":[{'province':cps},{'city':ccs}],
  "friends":[{'topfans':fans}],
  "birth":[{'birthday':sexs}],
  "domain":[{'domain':domains}],
  "combine":[{"cookie":keys}]
};//输出流



//程序入口，start(iterm);

//start('keywords');
//start('category');
//start('uid');
//start('location');
//start('friends');
start('birth');
//start('domain');
//start("combine");

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

//开始数据读入
function start(iterm){

  var fileArr = chainOut[iterm];
  for (var i = fileArr.length - 1; i >= 0; i--) {
    for(var x in fileArr[i]){
       mkdir(output+x+'_count', function(err) {console.log(err);}); 
    }    
  }

  switch(iterm){

    case "keywords" : readChange(rs,"",false);break;
    case "category" : readChange(rs,cs,true);break;
    case "uid" : readChange(rs,us,true);break;
    case "location" : readChange(rs,is,true);break;
    case "friends" : readChange(rs,us,frs);break;
    case "birth" : readChange(rs,us,wbs);break;
    case "domain" : readChange(rs,dos,true);break;
    case "combine" : readChange(rs,tars,true);break;
    default :readChange(cs,"",false);

  }

}

//中转匹配，flag ==true表示直接输出结果
function readChange(ins,outs,last){
  var arg;
  for(var a in chain){
    if(ins == chain[a]){
      arg = a;
    }
  }

 ins.on('data',function(chunk){

     readFile(chunk,arg);  

 }).on('end', function () {

       console.log("数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
      if(!last){
         
         for (var i = chainOut[arg].length - 1; i >= 0; i--) {
          
           for(var x in chainOut[arg][i]){
              result(chainOut[arg][i][x],x);
           }

         };

      }else{
        if(typeof last == 'boolean'){

          readChange(outs,'',false);

        }else{

          readChange(outs,last,true);

        }
        

      }
           
  }); 

}

//buffer读文件,并中转
function readFile(chunk,key){
  
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
       switch(key){
         case "keywords" : readOther(line);break;//当为tar_category时，调用readTarget_Categorys
         case "category" : readCategorys(line);break;
         case "uid" : readUids(line);break;
         case "location" : readLocation(line);break;
         case "friends" : readFriends(line);break;
         case "birth" : readBirth(line);break;
         case "domain" : readDomain(line);break;
         case "combine" : readTarget_Categorys(line);break;
         default :readOther(line);

       }
    });
}
//关键字文件读取规则
function readKeywords(line){

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

}
//地理信息文件读取规则
function readLocation(line){

    var tmp = line.split("\t");
    var cp = tmp[1];
    var cc = tmp[2];
    var ccid = tmp[0];

    for (var v in elem) {

      var list = elem[v]; 
      client.select(list, function() { 

         client.get(ccid,function (err, reply) {

           if(reply!== null){

             if(cp!==undefined&&cp!=""){
                 store(cps,cp,reply); 
             }

             if(cc!==undefined&&cc!=""){

                store(ccs,cc,reply); 
             }
           }

        });
      });
    };
}
 //兴趣文件读取规则
function readCategorys(line){
   
    var tmp = line.split("\t");
    var ccid = tmp[0];
    var cat = tmp[1].split(",")||[];
    var s ={};
    for (var vl in elem) {

      var list = elem[vl]; 
      client.select(list, function() { 

        client.get(ccid,function (err, reply) {

          if(reply!== null){

            var catTmp;
            
            for (var j = cat.length - 1; j >= 0; j--) {
              catTmp = cat[j].split("|")[0];
              store(cats1,catTmp,reply); 
              s[catTmp.substring(0,2)]={};
            }
            for(var v in s){
              store(cats,v,reply); 
            }
          }

        });
      });
    }; 

}

//读取target_category文件
function readTarget_Categorys(line){
   var tmp = line.split("\t");
    
     var key = tmp[0];
     var stk = tmp[1].split(",");

     if(key!= undefined &&stk!=undefined){
      
        for(var a in zu1){
         var  bra = false; 
         for (var i = zu1[a].length - 1; i >= 0; i--) {

           var len = zu1[a][i].length;

           for (var j = stk.length - 1; j >= 0; j--) {

              if(stk[j].substring(0,len) == zu1[a][i]){
                store(keys,key,a);
                bra = true;
                break;
              }
               
           };

           if(bra){
            break;
           }

          };

        }
       
      }

}

//微博uid文件读取规则
function readUids(line){

  var tmp = line.split("\t");    
  var uuid = tmp[1];
  var ucid = tmp[0];
  if(uuid!==undefined&&ucid!==undefined){

    for (var vl in elem) {

      var list = elem[vl]; 
      client.select(list, function() { 

         client.get(ucid,function (err, reply) {

           if(reply!== null){

             store(uids,uuid,reply);

           }

        });
      });
    };
  }  
}


//footprint文件读取规则
function readDomain(line){

  var tmp = line.split("\t");   
  var urlStr = tmp[1];
  var domain = "";
  //console.log("=====domain:"+domain);
  if(typeof urlStr == 'string'){
    domain = url.parse(urlStr).host||"";
   }else{
    domain = "";
   }     

  var dcid = tmp[0];
  if(dcid!==undefined){

    for (var dl in elem) {

      var list = elem[dl]; 
      client.select(list, function() { 

         client.get(dcid,function (err, reply) {

           if(reply!== null){

             store(domains,domain,reply);

           }

        });
      });
    };
  }  
}

//出生日期文件读取规则
function readBirth(line){

     var tmp = line.substring(line.indexOf("{"),line.indexOf("}")+1);

      var suid = JSON.parse(tmp)["u"];
      var g = JSON.parse(tmp)["by"];
      if(suid!==undefined&&g!==undefined){
        
        for (var ud in uids) {

          var kuid = uids[ud][suid]; 
     
          if(kuid !==undefined){
            store(sexs,g,ud);

          }

        };

      }
}
//共同关注文件读取规则
function readFriends(line){
   
     var tmp = line.split("\t");    
     var stk = tmp[1].split(",");
     var kcid = tmp[0];

      if(kcid!==undefined&&stk!==undefined){
        
        for (var ud in uids) {

          var kuid = uids[ud][kcid]; 
     
          if(kuid !==undefined){
            for (var i = stk.length - 1; i >= 0; i--) {
              store(fans,stk[i],ud);
            };
            

          }

        };

      }
  
} 
//其它文件动态设置读取规则      
function readOther(line){
     var tmp = line.split("\t");    
    // var ouid = tmp[1];
     var ocid = tmp[0];
     if(ocid!==undefined&&ocid!==""){
       // store(keys,ocid,"ALL");
     }
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

       console.log(k+"统计个数 ："+term.length+CRLF);

       var s =[];

       for (var j = term.length - 1; j >= 0; j--) {

        s.push(term[j]+"\t"+arg[k][term[j]]);
        //s.push(term[j]); 
         
       };

       fs.createWriteStream(output+r+"_count/"+k+"_"+r+"_count.data", {
        flags: 'w+',//a：追加，w+ :复写
        encoding: 'utf-8'
       }).write(s.join(CRLF));

        
  }

  console.log(r+"数据已写入完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
  client.quit();
}

function mkdir(dirpath, mode, callback) {
    if(arguments.length === 2) {
        callback = mode;
        mode = 0777;
    }

    fs.exists(dirpath, function(exists) {
        if(exists) {
            callback(null);
        } else {
            mkdir(path.dirname(dirpath), mode, function(err) {
                // console.log('>>', dirpath)
                if(err) return callback(err);
                fs.mkdir(dirpath, mode, callback);
            });
        }
    });
};

var mkdirSync = function(dirpath, mode) {
    dirpath.split('\/').reduce(function(pre, cur) {
        var p = path.resolve(pre, cur);
        if(!fs.existsSync(p)) fs.mkdirSync(p, mode || 0755);
        return p;
    }, __dirname);
};


