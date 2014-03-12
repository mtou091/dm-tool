/*分关键词省份，城市统计
*/
var output = './vm/';
var key_path =output+"key_cookie.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪

var cat_path = output+"cookie_categorys.data";
//1CH01hBIBO5P8nFgIpO6  1708|0.34602,28|0.26433,16|0.24704,1207|0.22241

var cat_key_path = output+"target_category_cookie.data";
//1CH01hBIBO5P8nFgIpO6  1708,28,16

var uid_path = output+'cookie_uid.data';
//1CH00ccGCP5EuvRpF8l8  2681033275

var weibo_path = output+'weibo_info.data';
//{"u":"389186","g":"1","by":"1986","p":"北京","c":"东城区","l":"北京 东城区"}

var info_path = output+'cookie_location.data';
//1CH04htLCn1CuCz5oJNh  广东  深圳

var friends_path = output+'uid_friends.data';
//

var fs = require('fs');
var path = require('path');

var keys ={}; //关键字
var cats = {};//一级兴趣
var cats1 = {};//二级兴趣
var uids = {};//微博id
var fans = {};//共同关注
var cps = {};//省份统计
var ccs ={};//城市关注
var sexs = {};//年龄统计

//关键字分组

var zu = {
  "A":['大众up!','大众Fox','POLO','大众XL1','高尔','POLO(海外)','高尔(海外)','高尔夫','速腾','朗逸','捷达','宝来','桑塔纳','高尔夫(进口)','朗行','朗境','甲壳虫','宝来/宝来经典','Jetta','迈腾','帕萨特','一汽-大众CC','Passat','桑塔纳志俊','大众CC','迈腾(进口)','桑塔纳经典','Passat领驭','辉腾','Buggy Up','Taigun','Cross Coupe','途观','CrossBlue','途锐','途安','夏朗','迈特威','开迪','途安(海外)','Routan','Bulli','开迪(海外)','尚酷','大众Eos','BlueSport'],
  "A1":["Passat","帕萨特","Passat领驭"],
  "A2":["途锐"],
  "A3":["途观"],
  "B":['蒙迪欧','雅阁','奥迪A4L','名图','宝马3系','天籁','迈腾','帕萨特','思锐','凯美瑞','睿骋','君威','锐志','迈锐宝','起亚K5','君越','一汽-大众CC','凯迪拉克ATS(进口)','马自达6','索纳塔八','歌诗图','雪铁龙C5','奔驰C级','标致508','沃尔沃S60','宝马4系','DS5','速尊','沃尔沃S60L','宝马3系(进口)','奔驰C级(进口)','沃尔沃V60','比亚迪G6','Saab 9-3','奥迪S5','凯迪拉克CTS(进口)','昊锐','Passat','睿翼','ATENZA(进口)','速派','奥迪A5','雷克萨斯IS','英菲尼迪Q50','思铂睿','蒙迪欧-致胜','桑塔纳志俊','景程','宝马3系GT','英菲尼迪G系','荣威950','奔腾B70','帝豪EC8','传祺GA5','宝马M3','奔腾B90','致胜','绅宝','力狮','大众CC','迈腾(进口)','海马M8','中华骏捷','君越(海外)','奥迪RS 5','瑞麒G5','奔驰C级AMG','奥迪A4(进口)','DS5(进口)','名驭','比亚迪F6','凯泽西','凯尊','纬度','昊锐(进口)','MG7','荣威750','桑塔纳经典','雅尊','歌诗图(海外)','起亚K5(进口)','奥迪A4','Passat领驭','英速亚','迈锐宝(海外)','戈蓝','中华尊驰','长城C70','华泰B11','奥迪RS 4','东方之子','讴歌TL','旗云5','瑞麒G6','林肯MKZ','宾悦','本田C','标致407','蓝鸟','拉古那','海马M6','凯迪拉克CTS','索纳塔','蒙迪欧(海外)','东南V7','凯美瑞(海外)','君威(海外)','雪铁龙C5(进口)','锐志(海外)','马自达6(进口)','宝马M4','现代Sonata(海外)','捷豹X-Type','领翔','雅阁(海外)','Impala','奥迪S4','标致508(进口)','现代i40','铂锐','ALFA 156','锋哲','福特Fusion','御翔','neora','Avalon','野马F16','本田FCX','远舰','Takeri','雷克萨斯HS','Altima','君爵','Avensis','5 by Peugeot','克莱斯勒200C','克莱斯勒200','Falcon','威达','讴歌TSX','西雅特IBL','Maxima','奥迪Cross','奥迪RS Q3','奥迪Q3','奥迪Q3(进口)','ASX劲炫(进口)','爱腾','奥轩GX5','奥轩G3','奥轩G5','奥丁','奔腾X80','宝利格','北京JEEP','奔驰GLA级(海外)','北京汽车B60','北京汽车BJ40','北京汽车C51X','本田CR-V','标致3008','标致4008','本田CR-V(海外)','宝马X1(进口)','宝马X1','北京现代ix35','标致3008(进口)','Cross Coupe','CONCEPT V','超级维特拉','长安CS75','传祺GS5','帝豪EX7','Duster','锋驭','丰田RAV4','丰田RAV4(进口)','海马骑士','海马S7','和悦S30','Hi-Cross','哈弗H5','哈弗H6','哈弗H3','劲炫ASX','金杯S50','景逸SUV','景逸X5','柯兰多','酷搏','科雷傲','路虎DC100','林肯MKC','雷克萨斯LF-Xh','猎豹CS7','陆风X6','陆风X8','陆风X9','陆风X5','莲花T5','Minagi','马自达CX-5(进口)','马自达CX-5','MG CS','欧蓝德','欧蓝德(进口)','帕拉丁','奇瑞β5','奇瑞TX','奇骏(进口)','奇骏','骑士S12','旗胜V3','旗胜F1','全球鹰GX7','瑞风S5','瑞鹰','Rogue','瑞虎5','森林人','斯巴鲁XV','S-CROSS','SPORTAGE','狮跑','双龙SIV-1','三菱PX-MiEV','赛弗','赛影','帅豹','圣达菲','途胜','途观','Vertrek','威麟X5','现代ix35(海外)','西雅特IBX','雪铁龙C4 Aircross','逍客(海外)','逍客','野帝','Yeti(进口)','英伦SX7','域胜007','勇士','野马B60X','驭胜','翼虎','翼虎/Kuga','自由客','指南者','中华V5','众泰T600','智跑','之诺1E','4Runner','奥迪Q7','昂科雷','巴博斯 M级','巴博斯 G级','霸锐','宾利EXP 9 F','奔驰M级AMG','奔驰G级AMG','奔驰M级','奔驰G级','标致SXC','宝马X5','宝马X6','宝马X5 M','宝马X6 M','大切诺基(进口)','大切诺基','大切诺基 SRT','第四代发现','发现3','Flex','悍马H3','哈弗IF','Kubang','卡宴','兰德酷路泽(进口)','兰德酷路泽','Lagonda','雷克萨斯GX','雷克萨斯LX','揽胜运动版','揽胜','马自达CX-9','讴歌ZDX','讴歌MDX','帕杰罗(进口)','帕杰罗','Pathfinder','普拉多','普拉多(进口)','Saab 9-7','探险者','途锐','Urus','沃尔沃XC90','维拉克斯','英菲尼迪JX','英菲尼迪QX70','英菲尼迪QX60','英菲尼迪FX','亚琛施纳泽 X5','亚琛施纳泽 X6','指挥官'],
  "B1":['蒙迪欧','雅阁','奥迪A4L','名图','宝马3系','天籁','迈腾','帕萨特','思锐','凯美瑞','睿骋','君威','锐志','迈锐宝','起亚K5','君越','一汽-大众CC','凯迪拉克ATS(进口)','马自达6','索纳塔八','歌诗图','雪铁龙C5','奔驰C级','标致508','沃尔沃S60','宝马4系','DS5','速尊','沃尔沃S60L','宝马3系(进口)','奔驰C级(进口)','沃尔沃V60','比亚迪G6','Saab 9-3','奥迪S5','凯迪拉克CTS(进口)','昊锐','Passat','睿翼','ATENZA(进口)','速派','奥迪A5','雷克萨斯IS','英菲尼迪Q50','思铂睿','蒙迪欧-致胜','桑塔纳志俊','景程','宝马3系GT','英菲尼迪G系','荣威950','奔腾B70','帝豪EC8','传祺GA5','宝马M3','奔腾B90','致胜','绅宝','力狮','大众CC','迈腾(进口)','海马M8','中华骏捷','君越(海外)','奥迪RS 5','瑞麒G5','奔驰C级AMG','奥迪A4(进口)','DS5(进口)','名驭','比亚迪F6','凯泽西','凯尊','纬度','昊锐(进口)','MG7','荣威750','桑塔纳经典','雅尊','歌诗图(海外)','起亚K5(进口)','奥迪A4','Passat领驭','英速亚','迈锐宝(海外)','戈蓝','中华尊驰','长城C70','华泰B11','奥迪RS 4','东方之子','讴歌TL','旗云5','瑞麒G6','林肯MKZ','宾悦','本田C','标致407','蓝鸟','拉古那','海马M6','凯迪拉克CTS','索纳塔','蒙迪欧(海外)','东南V7','凯美瑞(海外)','君威(海外)','雪铁龙C5(进口)','锐志(海外)','马自达6(进口)','宝马M4','现代Sonata(海外)','捷豹X-Type','领翔','雅阁(海外)','Impala','奥迪S4','标致508(进口)','现代i40','铂锐','ALFA 156','锋哲','福特Fusion','御翔','neora','Avalon','野马F16','本田FCX','远舰','Takeri','雷克萨斯HS','Altima','君爵','Avensis','5 by Peugeot','克莱斯勒200C','克莱斯勒200','Falcon','威达','讴歌TSX','西雅特IBL','Maxima'],
  "B2":['4Runner','奥迪Q7','昂科雷','巴博斯 M级','巴博斯 G级','霸锐','宾利EXP 9 F','奔驰M级AMG','奔驰G级AMG','奔驰M级','奔驰G级','标致SXC','宝马X5','宝马X6','宝马X5 M','宝马X6 M','大切诺基(进口)','大切诺基','大切诺基 SRT','第四代发现','发现3','Flex','悍马H3','哈弗IF','Kubang','卡宴','兰德酷路泽(进口)','兰德酷路泽','Lagonda','雷克萨斯GX','雷克萨斯LX','揽胜运动版','揽胜','马自达CX-9','讴歌ZDX','讴歌MDX','帕杰罗(进口)','帕杰罗','Pathfinder','普拉多','普拉多(进口)','Saab 9-7','探险者','途锐','Urus','沃尔沃XC90','维拉克斯','英菲尼迪JX','英菲尼迪QX70','英菲尼迪QX60','英菲尼迪FX','亚琛施纳泽 X5','亚琛施纳泽 X6','指挥官'],
  "B3":['奥迪Cross','奥迪RS Q3','奥迪Q3','奥迪Q3(进口)','ASX劲炫(进口)','爱腾','奥轩GX5','奥轩G3','奥轩G5','奥丁','奔腾X80','宝利格','北京JEEP','奔驰GLA级(海外)','北京汽车B60','北京汽车BJ40','北京汽车C51X','本田CR-V','标致3008','标致4008','本田CR-V(海外)','宝马X1(进口)','宝马X1','北京现代ix35','标致3008(进口)','Cross Coupe','CONCEPT V','超级维特拉','长安CS75','传祺GS5','帝豪EX7','Duster','锋驭','丰田RAV4','丰田RAV4(进口)','海马骑士','海马S7','和悦S30','Hi-Cross','哈弗H5','哈弗H6','哈弗H3','劲炫ASX','金杯S50','景逸SUV','景逸X5','柯兰多','酷搏','科雷傲','路虎DC100','林肯MKC','雷克萨斯LF-Xh','猎豹CS7','陆风X6','陆风X8','陆风X9','陆风X5','莲花T5','Minagi','马自达CX-5(进口)','马自达CX-5','MG CS','欧蓝德','欧蓝德(进口)','帕拉丁','奇瑞β5','奇瑞TX','奇骏(进口)','奇骏','骑士S12','旗胜V3','旗胜F1','全球鹰GX7','瑞风S5','瑞鹰','Rogue','瑞虎5','森林人','斯巴鲁XV','S-CROSS','SPORTAGE','狮跑','双龙SIV-1','三菱PX-MiEV','赛弗','赛影','帅豹','圣达菲','途胜','途观','Vertrek','威麟X5','现代ix35(海外)','西雅特IBX','雪铁龙C4 Aircross','逍客(海外)','逍客','野帝','Yeti(进口)','英伦SX7','域胜007','勇士','野马B60X','驭胜','翼虎','翼虎/Kuga','自由客','指南者','中华V5','众泰T600','智跑','之诺1E']
};
var zu1 = {
  "A":['33']//,
  //"B":['3306']
};
//输入流

var rs = fs.createReadStream(key_path, {
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

var matched = false;
var CRLF = '\n';
var prevline = '';

var timeIn = Date.parse(new Date());
var cLines =0;

var menu = {
  'keywords':[rs],
  'category':[rs,cs],
  'uid':[rs,us],
  'location':[rs,is],
  'birth':[rs,us,wbs],
  'friends':[rs,us,frs]

};//主要任务链条

var chain = {
  "keywords":rs,
  "category":cs,
  "uid":us,
  "location":is,
  "friends":frs,
  "birth":wbs
};//输入流

var chainOut = {
  "keywords":[{'unique_cookie':keys}],
  "category":[{'interest1':cats},{'interest2':cats1}],
  "uid":[{'unique_uid':uids}],
  "location":[{'province':cps},{'city':ccs}],
  "friends":[{'topfans':fans}],
  "birth":[{'birthday':sexs}]
};//输出流



//程序入口，start(iterm);

//start('keywords');
//start('category');
//start('uid');
//start('location');
start('friends');
//start('birth');


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
         case "keywords" : readKeywords(line);break;//当为tar_category时，调用readTarget_Categorys
         case "category" : readCategorys(line);break;
         case "uid" : readUids(line);break;
         case "location" : readLocation(line);break;
         case "friends" : readFriends(line);break;
         case "birth" : readBirth(line);break;
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
        
 }
 //兴趣文件读取规则
function readCategorys(line){
   
      var tmp = line.split("\t");
      var ccid = tmp[0];
      var cat = tmp[1].split(",")||[];
      var s ={};
      
      for (var vl in keys) {

       var kcid = keys[vl][ccid]; 
     
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
      for (var vl in keys) {

       var kcid = keys[vl][ucid]; 
     
       if(kcid !==undefined){
           store(uids,uuid,vl);
       }

      }
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


