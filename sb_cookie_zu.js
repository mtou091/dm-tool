/*品牌分组 （七组） unique cookie总数统计
  需求3.竞争品牌分析
*/
var output = './vm/key_zu_count.data';
var key_path="./vm/key_cookie.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];

var fs = require('fs');

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

var keys = {};
var uniqueC = {};
var rs = fs.createReadStream(key_path, {
    flags: 'r',
    encoding: 'utf-8'
});

var ws = fs.createWriteStream(output, {
    flags: 'w+',//a：追加，w+ :复写
    encoding: 'utf-8'
});

var matched = false;
var CRLF = '\n';
var prevline = '';

var timeIn = Date.parse(new Date());
var cLines =0;
var ctkey = 0;

function unique(cookie,key) {
  var hash =cookie+'|'+key;
  if(uniqueC[hash]==undefined){
     uniqueC[hash] = 1;

    if(keys[key] == undefined){

      keys[key] = 1;
      ctkey++;

    }else{
      keys[key]++ ;
    }

  }else{

   uniqueC[hash]++;

  }
  
};

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

             unique(key,a);
             break;

            }
          };

        }
       
      }


    });
});

rs.on('end', function () {
   
    console.log('[keywords_count :'+ctkey+ CRLF);
    ws.write('[keywords_count :'+ctkey+ CRLF);
    var term = [];
    for(v in keys){
      term.push(v);
    };

    term.sort(function(a,b){
      return keys[a]- keys[b];
    });

    for (var i = term.length - 1; i >= 0; i--) {
      ws.write(term[i]+"\t"+keys[term[i]]+CRLF);
    };


    ws.end(function () {

      console.log('数据跑步完成！共收集品牌'+ctkey+'个'+"  已耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);


      for (var i = term.length - 1; i >= 0; i--) {

      console.log("品牌： '"+term[i]+" '的统计量为： "+keys[term[i]]+CRLF);
      };
    
      
    });
}); 