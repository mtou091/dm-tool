/**
*按需求将文件目录生成Excel文件
**/

var XLSX = require("xlsx");
var inExcel = "./doc/columbia.xlsx";
var inDoc = "./data/";
var outDoc = "./doc/test3.xlsx";
var iconv = require('iconv-lite');
var fs = require('fs');  
var path = require("path");
var xlsxW = require('node-xlsx');
var interestDoc = "./doc/interestDoc.data";
var carCategoryDoc = "./doc/carCategoryDoc.data";
var excel = [];
var result = {};
var interestE = {};
var carCategory = {};
var numRule = {"interest2":30,"province":20,"city":30};//数据限制规则
var SheetNames ={"birthday":"年龄统计","province":"省份统计","city":"城市统计","interest1":"Interest一级分类","interest2":"Interest二级分类","car":"汽车标签统计","domain":"域名分布统计","result.data":"数据总览","topfans":"共同关注统计","interestDoc.data":"附录_Taxonomy"};
//程序入口
formatExls(inDoc,outDoc);

//创建兴趣数据统计excel
//creatEx("./count/result.data","./count/interestCount.xlsx");


function getCarDate(){
   

}

//获取兴趣总览表数组对象
function getInterestData(num){
    //console.log(num);
    var N = num||0;
   // console.log(N);
    var interest = {};
    writeFiles([interestDoc],function(data){
      for(var x in data){
        var lines = data[x].split("\n");
           for (var i = 0,len =lines.length ; i < len; i++) {
               var line =lines[i].split("\t")||"";
               var id = line[0];
               var cateName =line[3];
               if(id!==undefined&&id!==""){

                 if(cateName==undefined||cateName==""){
                    interest[id] = line[2];
                 }else{
                   interest[id] = cateName;
                 }

               }

           }
       
      }

    })
    return interest;

}


//读取文件夹目录,同步实现
function travelSync(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            travelSync(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

//文件名称：path.basename
function writeFiles(arg,callback){
    var Datas = {};
    for (var i =0,len = arg.length; i < len; i++) {
        try {
            var data = fs.readFileSync(arg[i],"utf-8");
            Datas[arg[i]] = data ;
            //console.log(data);
            // Deal with data.
        } catch (err) {
            console.log("读取文件失败！");
            // Deal with error.
        }
      
    };

  callback(Datas);

}

//根据路径和分隔符获取数组数据
function getData(inpath,part){
  var resu = {};
  var data = fs.readFileSync(inpath,"utf-8");
  var lines = data.split("\n");

  for (var i = lines.length - 1; i >= 0; i--) {
      var line = lines[i].split(part);
      if(line[0]!==undefined&&line[0]!==""){
        resu[line[0]] = line[1]||"";
      }
  };
return resu ;

}
//生成简易excel（兴趣的）
function creatEx(inpath,outpath){
  var datar = [];
  var intere = getInterestData(0);
  var data = getData(inpath,"|");
  for(var x in data){
     var tmp =[x,intere[x],data[x]];
     datar.push(tmp);
  }
  var buffer = xlsxW.build({worksheets: [ 
            {"name":"兴趣总览数据",
             "data":datar
            }]
      });
//console.log(datar);
fs.writeFileSync(outpath, buffer,'binary');

}


//编码转换，暂时不可用
function changeGbk(arrs){
  var binArr = [];
  for (var jlen = arrs.length,j=0; j < jlen; j++) {
            
     if(typeof arrs[j] == 'string'){
        if(Buffer.isEncoding("utf8")){
          //console.log("==============="+new Buffer(arrs[j], 'utf8').toString('utf8')+"========================");
        }
        // console.log("==============="+arrs[j]+"========================");
        // console.log(arrs[j]);
        binArr.push(new Buffer(arrs[j], 'utf8').toString('utf8'));
      }
              
  }

  return binArr;

}
//获取excel table的标题
function getYemei(id){
  var yemei=["人群ID","人群名称","人群总数"];
  switch(id){

     case "birthday" :{
      return yemei.concat(["出生年份","人数","%"]);
    }break;
    case "province" :{
      return yemei.concat(["省份","人数","%"]);
    }break;
    case "city" :{
      return yemei.concat(["城市","人数","%"]);
    }break;
    case "interest1" :{
      return yemei.concat(["Interest ID","Interest","人数","%"]);  
    }break;
    case "interest2" :{
     return yemei.concat(["Interest ID","二级Interest","一级Interest","人数","%"]);
    }break;
    case "car" :{
      return yemei.concat(["车型名称","售价","人数","%"]); 
    }break;
    case "domain" :{
      return yemei.concat(["域名","人数","%"]);
    }break;
   case "topfans" :{
      return yemei.concat(["UID","昵称","共同粉丝关注"]);
    }break;
    default :{
       return yemei;
    }break;
  }
}
//每个分组的显示情况
function getCell(id,line,data){
    var cells = [],inter={};
    if(id.indexOf("interest")!=-1){
      inter = getInterestData(0);
   }
    var zu =line.split(path.sep).pop().split("_")[0]||line ;
    cells.push([zu,'','']);
    var dataTmp = data.split("\n");
    var len = numRule[id]||dataTmp.length;
        
    for (var i=0; i<len; i++) {
        var xxx = dataTmp[i].split("\t");            
        if(id == "interest1"){
          xxx = [xxx[0],inter[xxx[0]],xxx[1]];
     
        }
        if(id == "interest2"){
          xxx = [xxx[0],inter[xxx[0]],inter[xxx[0].substring(0,2)],xxx[1]];

        }
        if(id == "birthday"){
            if(xxx[0]<1966||xxx[0]>2000){
               continue;
            }
        }
        if(id=="interestDoc.data"||id=="topfans"){
            cells.push(xxx);
        }else{
            xxx.unshift("","","");              
            cells.push(xxx);
        }

    }
   
    return cells;
}
//创建单个区域的数据
function createSheet(id,filepaths){
   var tmp = {},inter={};
   var name = SheetNames[id]||id;
    //console.log(name);
   tmp["name"] = name;
   writeFiles(filepaths,function(Datas){
      var cells = [];
      var yemei = getYemei(id);
      cells.push(yemei);
      for(var line in Datas){
        var cell = getCell(id,line,Datas[line])||Datas[line].split("\n");
     //console.log(cell);
       cells = cells.concat(cell);

      }
     // console.log(cells);
      tmp["data"] = cells;
   });
   return tmp ;
}

//生成表格
function formatExls(inpath,outpath){
  var uit = {},excels = [];
  //获取指定文件目录下文件列表
  travelSync(inpath, function (pathname) {
    //console.log(pathname);
    var sheets = pathname.split(path.sep);// path.sep:操作系统分隔符   
    var sheet = sheets[1]||pathname;
    if(path.basename(pathname).charAt(0)!=="."){
   
       if(uit[sheet] ==undefined){
          uit[sheet] = [pathname];
       
       }else{
          uit[sheet].push(pathname);
       }
    }
   
     
  }); 

  //console.log(uit);
  for(var a in uit ){
    var id = a.split("_")[0]||a;
    var tmp = createSheet(id,uit[a]);
    excels.push(tmp);

  }

//console.log(excels);

  var excels = xlsxW.build({worksheets:excels});
  fs.writeFileSync(outpath, excels,'binary');
}


/**
读取excel表格输出形式

**/
//读excel
function readExcel(indoc,callback){
    var result = {};
    var xlsxR = XLSX.readFile(indoc);
    var sheet_name_list = xlsxR.SheetNames;
    sheet_name_list.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(xlsxR.Sheets[sheetName]);
        if(roa.length > 0){
        result[sheetName] = roa;
        }
   });
   callback(result);

}
//执行入口
readExcel(inExcel,function(data){
  //console.log(result);
  //fs.writeFileSync("./doc/myDoc.data", JSON.stringify(data));
   
});

/*测试
xlsx.SheetNames.forEach(function(y) {
  for (z in xlsx.Sheets[y]) {
    if(z[0] === '!') continue;
    //console.log(y + "!" + z + "=" + JSON.stringify(xlsx.Sheets[y][z].v));
    //输出样例：表格名！B23=1802，一行一行读取
  }
});

//读取excel时的各种格式输出
function get_radio_value( radioName ) {
    var radios = document.getElementsByName( radioName );
    for( var i = 0; i < radios.length; i++ ) {
        if( radios[i].checked ) {
            return radios[i].value;
        }
    }
}

function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if(roa.length > 0){
            result[sheetName] = roa;
        }
    });
    return result;
}

function to_csv(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        if(csv.length > 0){
            result.push("SHEET: " + sheetName);
            result.push("");
            result.push(csv);
        }
    });
    return result.join("\n");
}

function to_formulae(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
        var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
        if(formulae.length > 0){
            result.push("SHEET: " + sheetName);
            result.push("");
            result.push(formulae.join("\n"));
        }
    });
    return result.join("\n");
}

var tarea = document.getElementById('b64data');
function b64it() {
    var wb = XLSX.read(tarea.value, {type: 'base64'});
    process_wb(wb);
}

function process_wb(wb) {
    var output = "";
    switch(get_radio_value("format")) {
        case "json":
        output = JSON.stringify(to_json(wb), 2, 2);
            break;
        case "form":
            output = to_formulae(wb);
            break;
        default:
        output = to_csv(wb);
    }
    if(out.innerText === undefined) out.textContent = output;
    else out.innerText = output;
}

var drop = document.getElementById('drop');
function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files;
    var i,f;
    for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function(e) {
            var data = e.target.result;
            //var wb = XLSX.read(data, {type: 'binary'});
            var arr = String.fromCharCode.apply(null, new Uint8Array(data));
            var wb = XLSX.read(btoa(arr), {type: 'base64'});
            process_wb(wb);
        };
        //reader.readAsBinaryString(f);
        reader.readAsArrayBuffer(f);
    }
}

function handleDragover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

if(drop.addEventListener) {
    drop.addEventListener('dragenter', handleDragover, false);
    drop.addEventListener('dragover', handleDragover, false);
    drop.addEventListener('drop', handleDrop, false);
}

//读取文件夹目录,异步实现
function travel(dir, callback, finish) {
    fs.readdir(dir, function (err, files) {
        (function next(i) {
            if (i < files.length) {
                var pathname = path.join(dir, files[i]);

                fs.stat(pathname, function (err, stats) {
                    if (stats.isDirectory()) {
                        travel(pathname, callback, function () {
                            next(i + 1);
                        });
                    } else {
                        callback(pathname, function () {
                            next(i + 1);
                        });
                    }
                });
            } else {
                finish && finish();
            }
        }(0));
    });
}
*/