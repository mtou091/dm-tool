/*品牌分组 （七组） unique cookie分组统计
  需求3.竞争品牌分析
*/
var output = './bank/key_zu_count.data';
var key_path="./bank/cookie_keywords.data";
//1CH03SJp00BppvQaybW1  更换机油,汽油添加剂,行车记录仪
//process.argv[2] == undefined?"./cookie/cookie_keywords.data":process.argv[2];

var fs = require('fs');
var zu ={
  "A":['小额信贷','网购分期','银行贷款','贷款利率','无抵押小额贷款','个人贷款','身份证信用贷款','民间信贷','消费信贷','个人创业贷款','个人住房贷款','私人贷款利息','贷款担保','分期还款','首付率','公积金贷款','信用记录','按揭','车贷','提前还款'],
  "B":['信用卡积分','刷卡手续费','异地取款','银行开户','汇率','存款利息','申请信用卡','签帐额','信用卡还款','异地汇款','个人所得税','利率计算器','刷卡套现','信用卡比较','信用卡取现','信用卡额度','信用卡分期','信用卡透支','境外人民币支付','银行商户'],
  "C":['汇率','理财产品','余额宝','财付通','大盘','期货行情','外汇牌价','分红比较','基金比较','互联网金融','金价','信托产品','人民币走势','房地产政策','股票推荐','个股点评','房地产信托','房地产税','外汇牌价','股票报价']
};
var score = {"A":0,"B":2,"C":4};

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
     var tmpk = stk.split(",");
     if(key!= undefined &&stk!=undefined){
      
        for(var a in zu){
                   
         for (var i = zu[a].length - 1; i >= 0; i--) {
            var fla = false;
            for (var j = tmpk.length - 1; j >= 0; j--) {
              if(tmpk[j] == zu[a][i]){
                 unique(key,a);
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


    });
});

rs.on('end', function () {
   
    console.log('[keywords_count :'+ctkey+ CRLF);
    //ws.write('[keywords_count :'+ctkey+ CRLF);
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