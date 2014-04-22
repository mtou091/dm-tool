/*分组topfans统计
*/
var urllib = require('url');
var http = require('https');
var fs = require('fs');
var token = ["2.00CZNX6CdANkCD93a54b78320oZ3E_","2.00uBIq8CdANkCDcf0c2399ad0Kz843","2.00XMkZRBdANkCDee3b5926aaaAXvjC","2.00kZJdiCdANkCDbcb6711593FTdciD","2.00NWBOoBdANkCD3904c43e1abMBu1D"];
var output = './yh/topfans/';
var key_path ="./yh/cookie_keywords.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪

var uid_path = './yh/cookie_uid.data';
//1CH00ccGCP5EuvRpF8l8  2681033275
var friends_path = './yh/uid_friends.data';

//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];
var keys = {};
var fans = {};
var uids = {};
var datas = {};
var resultStr = "";
var requestNum = 3;

var zu = {
  //"A":["别墅|投资","别墅|收藏","别墅|高尔夫"],
  //"A1":["别墅|高尔夫"],
 // "A2":["别墅|投资","别墅|收藏"],
 // "B":["高尔夫|运动","高尔夫|体育","高尔夫|球场","高尔夫球|高尔夫球"],
 // "E":["颐和山庄|颐和山庄","中奥美泉宫|中奥美泉宫","泊月湾|泊月湾","汤臣高尔夫别墅|汤臣高尔夫别墅","汤臣高尔夫|汤臣高尔夫","银丽高尔夫别墅|银丽高尔夫别墅","银丽高尔夫|银丽高尔夫","南都西湖高尔夫别墅|南都西湖高尔夫别墅","南都西湖高尔夫|南都西湖高尔夫"],
 // "E1":["颐和山庄|颐和山庄"],
  //"E2":["中奥美泉宫|中奥美泉宫"],
 // "E3":["泊月湾|泊月湾"],
 // "E4":["汤臣高尔夫别墅|汤臣高尔夫别墅","汤臣高尔夫|汤臣高尔夫"],
 "E5":["银丽高尔夫别墅|银丽高尔夫别墅","银丽高尔夫|银丽高尔夫"]//,
 // "E6":["南都西湖高尔夫别墅|南都西湖高尔夫别墅","南都西湖高尔夫|南都西湖高尔夫"]
};
/*
var zu ={
  "C":["2102"],
  "D":["2804"]
};

*/
var rs = fs.createReadStream(key_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var wbs = fs.createReadStream(friends_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var us = fs.createReadStream(uid_path, {
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
     readKeywords(line);
     //readTarget_Categorys(line);

    });


});



function changeUid(){
 
us.on('data', function (chunk) {
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
     var uuid = tmp[1];
     var ucid = tmp[0];
     if(uuid!==undefined&&ucid!==undefined){
      for (var vl in keys) {

       var kcid = keys[vl][ucid]; 
     
       if(kcid !==undefined){
           store(uids,uuid,vl);

       }

      };
    }
      
  });
 
 });

}



function readfile(){
 
  wbs.on('data', function (chunk) {
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

       console.log("' 此组fans人数 '："+term.length+CRLF);

       var s =[];
       var limit = (term.length - 5000)<=0?0:(term.length - 5000);
       for (var j = term.length - 1; j >= 0; j--) {
         var tmp = term[j];        
         
         s.push(tmp+"\t"+arg[k][tmp]);
         
         if(j<=limit){
          getNickName(k,s);
          break;
         }
         
       };

       fs.createWriteStream(output+k+"_topfans_count.data", {
        flags: 'w+',//a：追加，w+ :复写
        encoding: 'utf-8'
       }).write(s.join(CRLF));

        
  }

  console.log("数据已写入完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
  
}



rs.on('end', function () {

    console.log("keywords数据已经读取完毕！共读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
    changeUid();

    us.on('end',function(){

      console.log("uid数据已经读取完毕！已读取:' "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);
      readfile();
      
 
      wbs.on('end', function () {

        result(fans);

     });


    });

}); 



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
