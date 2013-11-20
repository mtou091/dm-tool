var output = './doc/cate1';
var cat_path = "./cookie/work";

var fs = require('fs');

var cats = {};


var cs = fs.createReadStream(cat_path, {
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




function uniqueC(arr) {
  var ret = []
  var hash = {}

  for (var i = 0; i < arr.length; i++) {
    var item = arr[i]
    var key = typeof(item) + item
    if (hash[key] !== 1) {
      ret.push(item)
      hash[key] = 1
    }
  }

  return ret
}




function unique(key){

  if(cats[key] ==undefined){
    cats[key] = 1 ;

  }else{
    cats[key]++;
  }
}

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

     var tmp = line.split("\t");
    
     var tmpK = tmp[1].split(",");
     var s =[];
     for (var i = tmpK.length - 1; i >= 0; i--) {
         s.push(tmpK[i].substring(0,2));
        // console.log(s);
     };

     s = uniqueC(s);

     for (var j = s.length - 1; j >= 0; j--) {
       unique(s[j]);
     };
   
    });


});


cs.on('end', function () {

   // console.log(cats);

    console.log("数据已经读取完毕！共读取: "+cLines+"  行,耗时："+((Date.parse(new Date())-timeIn)/1000)+"秒"+CRLF);

    var term = [];
    for(v in cats){
      term.push(v);
    };

    term.sort(function(a,b){
      return cats[a]- cats[b];
    });


   


      ws.write('数据读取完成！共含有categorys个数为：'+term.length+'个'+ CRLF);

      console.log('数据读取完成！共含有categorys个数为：'+term.length+'个'+ CRLF);

      var s;
      for (var i = term.length - 1; i >= 0; i--) {
         s+="["+term[i]+":"+cats[term[i]]+"],";
       
      };

        console.log(s+CRLF);
        ws.write(s+CRLF);
  
      ws.end(function () {

         console.log('数据跑步完成,耗时：'+((Date.parse(new Date())-timeIn)/1000)+"秒");
      });

}); 