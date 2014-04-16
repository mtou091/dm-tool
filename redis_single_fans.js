/*分组topfans统计
*/
var urllib = require('url');
var http = require('https');
var fs = require('fs'),
redis = require("redis"),
client = redis.createClient();

client.on("error", function (err) {
        console.log("Error :" + err);
});
var token = ["2.00CZNX6CdANkCD93a54b78320oZ3E_","2.00uBIq8CdANkCDcf0c2399ad0Kz843","2.00XMkZRBdANkCDee3b5926aaaAXvjC","2.00kZJdiCdANkCDbcb6711593FTdciD","2.00NWBOoBdANkCD3904c43e1abMBu1D"];
var output = './shunya/topfans/';

var friends_path = './shunya/uid_friends.data';

//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];
var fans = {};
var uids = {};
var datas = {};
var resultStr = "";
var requestNum = 3;

var wbs = fs.createReadStream(friends_path, {
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


var Ttotal = 0;
var cTotal = 1;
var X = 3;

var info = setInterval(function () {

 
   if (Ttotal<=0||X<=0) {
      clearInterval(info);
      client.end();
      result(fans);
     }

    if((cTotal-Ttotal)==0){
      X--;
    }
    cTotal =Ttotal;

    console.log("剩余执行任务个数："+Ttotal+CRLF);

    }, 5000);


 function search(key,uuid){

    client.select(5, function(error){
      if(error) {
        console.log(error);
        Ttotal--;
       } else {
        
         client.get(key, function(error, res){
            if(error) {
                console.log(error);
                Ttotal--;
            } else {

                if(res!== null){
                   var stk =uuid.split(",");
                   for (var i = stk.length - 1; i >= 0; i--) {
                      store(fans,stk[i],res);
                   };
                }
                Ttotal--;                
            }          
        });
      }
  });

}



 wbs.on('data', function (chunk) {
    var lines = chunk.split(CRLF);

    lines[0] = prevline + lines[0];
    if (chunk.substr(chunk.length - 2) !== CRLF) {
        prevline = lines.pop();
    } else {
        prevline = '';
    }

    cLines+=lines.length;
    console.log("已读取行数为："+cLines+"剩余执行任务："+Ttotal+"  已耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

    lines.forEach(function (line) {

     var tmp = line.split("\t");    
     var uuid = tmp[1];
     var ucid = tmp[0];
     if(uuid!==undefined&&ucid!==undefined){
         Ttotal++;
         search(ucid,uuid);
           
     };
      
  });
 
 });

function result(arg){

  for(var k in arg){

      var term =[];

      for(var v in arg[k]){
         term.push(v);
      }     
      term.sort(function(c,d){
          return arg[k][c]- arg[k][d];
        });

       console.log("' 此组fans人数 '："+term.length+CRLF);

       var s =[];

       for (var j = term.length - 1; j >= 0; j--) {
         var tmp = term[j];        
         
         s.push(tmp+"\t"+arg[k][tmp]);
         
         if(j<term.length - 5000){
          getNickName(k,s);
          break;
         }
         
       };
/*
       fs.createWriteStream(output+k+"_topfans_count.data", {
        flags: 'w+',//a：追加，w+ :复写
        encoding: 'utf-8'
       }).write(s.join(CRLF));
*/
        
  }

  console.log("数据已写入完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
  
}

function getNickName(k,strArr){
  var len =  strArr.length;
  for (var i = 0; i <len-1; i++) {
     httpurl(k,strArr[i].split("\t")[0],"",false);
   }; 
 
  httpurl(k,strArr[len-1].split("\t")[0],strArr,true);
}



function httpurl(k,uid,uidArr,writeFlag){

    if(!writeFlag&&datas[uid]!=undefined){
     return;
    }
    
    var num = Math.floor(Math.random()*5);
    var url = 'https://api.weibo.com/2/users/show.json?access_token='+token[num]+'&uid='+uid;
    console.log("call:"+url);
    var body = '';
    var req = http.get(url, function(res) {
  //console.log("Got response: " + res.statusCode);
    res.on('data',function(chunk){
         body += chunk;
      }).on('end', function(){
        
        var nick = JSON.parse(body).name;
        datas[uid] = nick;
       
        while(!uid==undefined&&(datas[uid]==undefined||datas[uid]=="")){
             
             requestNum--;
             if(requestNum<=0){
              requestNum = 3;
              break;
             }  
             httpurl(k,uid,writeFlag);        
        }
        

       if(writeFlag){
          var lens = uidArr.length;
          for (var i = 0; i < lens -1; i++) {
            var u = uidArr[i].split("\t");
            resultStr += u[0]+"\t"+datas[u[0]]+"\t"+u[1]+CRLF;
          };

          fs.createWriteStream(output+k+"_topfans.data", {
          flags: 'w+',//a：追加，w+ :复写
          encoding: 'utf-8'
         }).write(resultStr);

        resultStr = "";

       }
         console.log(uid+"====="+datas[uid]+"=====");
       
      });

}).on('error', function(e) {
       
        datas[uid] = "";
        console.log("Got error: " + e.message);
})
req.end();


}


function concatt(){
  // concat arr1 and arr2 without duplication.
  var concat_ = function(arr1, arr2) {
    for (var i=arr2.length-1;i>=0;i--) {
     // escape undefined and null element
     if (arr2[i] === undefined || arr2[i] === null) {
       continue;
     }
     // recursive deal with array element
      // can also handle multi-level array wrapper
      if (classof(arr2[i]) === 'Array') {
        for (var j=arr2[i].length-1;j>=0;j--) {
          concat_(arr1, arr2[i][j]);
        }
        continue;
      }
      arr1.indexOf(arr2[i]) === -1 ? arr1.push(arr2[i]) : 0;
    }
  };
  // concat arbitrary arrays.
  // Instead of alter supplied arrays, return a new one.
  return function(arr) {
    var result = arr.slice();
    for (var i=arguments.length-1;i>=1;i--) {
      concat_(result, arguments[i]);
    }
    return result;
  };
};
