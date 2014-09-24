var fs = require("fs");
var urllib = require('url');
var http = require('https');
var httpt = require('http');
var pinyin = require("pinyin");
var process = require('child_process');
var path = require("path");
var input = '../dm-tool/public/work';
var keytext = "../dm-tool/doc/words.txt";
var keywords = ['|b|', '|l|', '|w|', '|a|'];
var output = '../dm-tool/public/log';
var infoDir = "../dm-tool/info";
var token = ["2.00AhNbrBIg5IQD2dc53670b8fKdgKE","2.00AhNbrB8B8pgBecd78056c8epz9ZD","2.00XMkZRBdANkCDee3b5926aaaAXvjC","2.00kZJdiCdANkCDbcb6711593FTdciD","2.00AhNbrBqCha4D92d6ace279VmiFSC"];
var flag = false;
var workFla = false;
var returnP = [], result = [];
var choiceKeys =[];
var datas = {};

exports.autoroute = {
    'get': {
        '(.?)/(index)?': index,
        '(.?)/getSinaUid': getSinaUid,
        '(.?)/getWork': getWorkFeed,
        '(.?)/getExchange': getExchange,
        '(.?)/sharing': sharing,
        '(.?)/getKeywords': getKeywords
        
    },
    'post': {
        '(.?)/sinaUid': sinaUid,
        '(.?)/creatIterm': creatIterm

    }
};


function sharing(req, resp) {

    var params = urllib.parse(req.url, true);
    var uuid = params.query.uuid || "";
    var url = "http://www.bshare.cn/api/feeds/sharing.json?uuid=" + uuid + "&count=20";
    console.log("call:" + url);
    var body = '';
    var req = httpt.get(url,function (res) {
        console.log("Got response: " + res.statusCode);
        res.on('data',function (chunk) {
            body += chunk;
        }).on('end', function () {

                var feeds = JSON.parse(body);
                if (params.query && params.query.callback) {

                    var str = params.query.callback + '(' + JSON.stringify(feeds) + ')';//jsonp
                    //console.log("jsonp"+str);
                    resp.end(str);
                } else {
                    resp.end(JSON.stringify(feeds));//普通的json
                    //console.log("json"+JSON.stringify(datas));
                }

            });

    }).on('error', function (e) {

            console.log("Got error: " + e.message);
        })
    req.end();

}

function index(req, res) {

    var params = urllib.parse(req.url, true);
    console.log(params);

    if (params.query && params.query.callback) {
        //console.log(params.query.callback);
        var str = params.query.callback + '(' + JSON.stringify(datas) + ')';//jsonp

        res.end(str);
    } else {
        res.end(JSON.stringify(datas));//普通的json

    }


}
function getSinaUid(req, res) {
    var datass = {} , tmp = {};
    var params = urllib.parse(req.url, true);
    //console.log(req);
    var uid = params.query.uid;
    if (datas[uid] == undefined) {
        httpurl(uid, 3);
    } else {
        flag = true;
    }
    var info = setInterval(function () {
        if (flag) {
            clearInterval(info);
            datass[uid] = datas[uid];
            tmp['feeds'] = datass;
            if (params.query && params.query.callback) {
                var str = params.query.callback + '(' + JSON.stringify(tmp) + ')';//jsonp
                console.log("jsonp" + str);
                res.end(str);
            } else {
                res.end(JSON.stringify(tmp));//普通的json
                console.log("json" + JSON.stringify(tmp));
            }
        }

    }, 100);

}

function sinaUid(req, res) {
    var params = urllib.parse(req.url, true);
    //console.log(req);

    // var postStr = req.body ;
    var data = req.body;
    var uids = data.feed;
    var datass = {};
    for (var i = uids.length - 1; i >= 0; i--) {
        httpurl(uids[i], 3);
        datass[uids[i]] = datas[uids[i]];
    }
    ;

    if (params.query && params.query.callback) {
        console.log(datass);

        var str = params.query.callback + '(' + JSON.stringify(datass) + ')';//jsonp
        // console.log("jsonp"+str);
        res.end(str);
    } else {
        res.end(JSON.stringify(datass));//普通的json
        //console.log("json"+JSON.stringify(datas));
    }

}

function creatIterm(req, res) {
    
    var iterm={}, tmp={};
    var params = urllib.parse(req.url, true);
    var data = req.body;
    //console.log(data);
    var itermr = pinyin(decodeURIComponent(data.taskid||""), {
                       style: pinyin.STYLE_NORMAL, // 设置拼音风格
                       heteronym: false
                       }).toString().replace(",",""); 
    var itermid =itermr+getDay()||"";
    data['taskid'] = itermid ;

    creatfile(data,function(err){

       if (err){
         throw err;
         tmp["success"] = "error";

       }else{

         tmp["success"] = itermid;

       }  

    
      if (params.query.callback) {
         var str = params.query.callback + '(' + JSON.stringify(tmp) + ')';//jsonp
         //console.log("jsonp" + str);
         res.end(str);
                
      } else {

       res.end(JSON.stringify(tmp));//普通的json

      }

    });
    

}
//创建任务文件
function creatfile(iterm,callback){
    var itermFile = iterm.taskid||"",flag = false;
    var itermDir = path.join(infoDir,itermFile);
    var pathname = path.join(infoDir,itermFile,itermFile+".json");
    var keywordsFile = path.join(infoDir,itermFile,"keywords.data");
    mkdir(itermDir, function(err) {
         if (err != null) {
           console.log('error: ' + error);
         }else{
            console.log("创建json文件");
            fs.writeFile(pathname, JSON.stringify(iterm),function(err){

                if (err != null) {
                    console.log('error: ' + err);
                }else{
                    var keywords ="",groupS = iterm.group||{};

                    for(var k in groupS){
                        keywords += groupS[k]+"\n";

                    }
                    console.log("创建data文件");
                    fs.writeFile(keywordsFile, keywords,function(err){
                        if (err != null) {
                            console.log('error: ' + err);
                        }else{
                            console.log("开始回调！");
                            callback();
                        }
                    });
                }

            });
            
         }
    });   

}

exports.createDir = function (){process.exec('D: && cd testweb && md mydir',
      function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
}
//调用执行文件
exports.openApp = function(){
    process.execFile('D:/testweb/aaa.bat',null,{cwd:'D:/'},
      function (error,stdout,stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
}

//获取当前日期 MMDD
function getDay(){

    var oDate = new Date();

    return (oDate.getMonth() + 1).toString().replace(/^(\d)$/,"0$1") + oDate.getDate().toString().replace(/^(\d)$/,"0$1");
}


function getNickName(uid, rNum) {

    var num = Math.floor(Math.random() * 5);
    var url = 'https://api.weibo.com/2/users/show.json?access_token=' + token[num] + '&uid=' + uid;
    console.log("call:" + url);
    var body = '';
    var req = http.get(url,function (res) {
        console.log("Got response: " + res.statusCode);
        res.on('data',function (chunk) {
            body += chunk;
        }).on('end', function () {

                var nick = JSON.parse(body).name;
                datas[uid] = nick;
                rNum--;
                httpurl(uid, rNum);
            });

    }).on('error', function (e) {

            datas[uid] = "";
            rNum--;
            httpurl(uid, rNum);
            console.log("Got error: " + e.message);
        })
    req.end();

}


function httpurl(uid, rNum) {
    console.log("here!");
    if (rNum > 0 && (datas[uid] == "" || datas[uid] == undefined)) {

        getNickName(uid, rNum);
    } else {
        flag = true;

    }
}


function getExchange(req, res) {

    var params = urllib.parse(req.url, true);
    var inputX = '../dm/data/x_count';
    var pre = "";
    var re = fs.createReadStream(inputX, {
        flags: 'r',
        encoding: 'utf-8'
    }).on('data',function (chunk) {
            var lines = chunk.split(CRLF);
            lines[0] = pre + lines[0];

            if (chunk.substr(chunk.length - 2) !== CRLF) {
                pre = lines.pop();
            } else {
                pre = '';
            }

            lines.forEach(function (line) {

                console.log(line);
                result.push(JSON.parse(line));
            });

        }).on('end', function () {

            if (params.query && params.query.callback) {
                //console.log(params.query.callback);
                console.log("ceshi shujuhangshu");
                console.log(result[0]);
                var str = params.query.callback + '(' + result[0] + ')';//jsonp

                res.end(str);
            } else {
                res.end(result[0]);//普通的json

            }

        });

}

function getKeywords(req, res) {
    var tmp = {},data = [];
    var params = urllib.parse(req.url, true);
    //console.log(req);    
    var search = unescape(params.query.keywords_input);
    console.log(search)
    if(choiceKeys.length==0){
        init();
    }
    var importent = "";
    for (var i = choiceKeys.length - 1; i >= 0; i--) {

        if(choiceKeys[i].indexOf(search)!=-1){
            if(choiceKeys[i]==search){
                importent = choiceKeys[i];
            }else{
               data.push(choiceKeys[i]); 
            }
            
        }
    };
    if(importent!==""){
        data.unshift(importent);
    }
    tmp["sugList"] = data;
    if (params.query.callback) {
        console.log(tmp);
        var str = params.query.callback + '(' + JSON.stringify(tmp) + ')';//jsonp
        //console.log("jsonp" + str);
        res.end(str);
                
    } else {

       res.end(JSON.stringify(tmp));//普通的json

    }

}


function getWorkFeed(req, res) {
    var tmp = {};
    var params = urllib.parse(req.url, true);
    //console.log(req);    
    var feed = params.query.feed;
    var search = params.query.search;

    var a = feed ? 1 : 0;
    var b = search ? 1 : 0;
    var caseid = 2 * a + b;
    switch (caseid) {
        case 3 :
        {
            search = decodeURIComponent(search);
            console.log(search);
            getSearchFeeds(search, feed);
        }
            break;
        case 2 :
        {
            getFeeds(feed);

        }
            break;
        case 1 :
        {
            search = decodeURIComponent(search);
            getSearchFeeds(search, feed);
        }
            break;
        case 0 :
        {
            returnP = data;
        }
            break;

    }
    var info = setInterval(function () {
        if (workFla) {
            tmp["feeds"] = returnP;
            if (params.query.callback) {
                console.log(tmp);
                var str = params.query.callback + '(' + JSON.stringify(tmp) + ')';//jsonp
                console.log("jsonp" + str);
                res.end(str);
                workFla = false;
                returnP = [];
            } else {
                res.end(JSON.stringify(tmp));//普通的json
                workFla = false;
                returnP = [];
                // console.log("json"+JSON.stringify(tmp));
            }

            clearInterval(info);

        }
    }, 10);

}

function getFeeds(para) {
    var tmp = [];
    if (para == "all") {
        tmp = data;
    } else {

        for (var i = 0, len = data.length; i < len; i++) {
            for (var v in data[i]) {
                if (v == para) {
                    tmp.push(data[i]);
                }

            }
        }
        ;

    }
    returnP = tmp;
    workFla = true;

}

function getSearchFeeds(se, fe) {
    var pre = "" , tpData = [];
    var re = fs.createReadStream(output, {
        flags: 'r',
        encoding: 'utf-8'
    }).on('data',function (chunk) {
            var lines = chunk.split(CRLF);
            lines[0] = pre + lines[0];

            if (chunk.substr(chunk.length - 2) !== CRLF) {
                pre = lines.pop();
            } else {
                pre = '';
            }
            var param = [];
            lines.forEach(function (line) {
                var tmp = line.substring(line.indexOf("{"), line.indexOf("}") + 1);

                if (tmp.indexOf(se) != -1) {
                    tpData.push(JSON.parse(tmp));
                }

            });

        }).on('end', function () {

            if (fe && fe !== "all") {
                for (var i = 0, len = tpData.length; i < len; i++) {
                    for (var c in tpData[i]) {
                        if (c == fe) {
                            returnP.push(tpData[i]);
                        }
                    }
                }
                ;

            } else {
                console.log(tpData);
                returnP = tpData;

            }
            workFla = true;
        });


}

function showIndexView(req, res) {
    if (req.session.user && req.session.user.uId !== undefined && req.session.user.uName !== undefined) {
        res.end();
        res.redirect("main");
    } else {
        res.render('index', {user: req.session.user});
    }
}

function getWork(req, res) {
    var params = urllib.parse(req.url, true);
    //console.log(req);

    // var postStr = req.body ;
    var param = params.query.param;

    if (params.query && params.query.callback) {
        console.log(datass);

        var str = params.query.callback + '(' + JSON.stringify(datass) + ')';//jsonp
        // console.log("jsonp"+str);
        res.end(str);
    } else {
        res.end(JSON.stringify(datass));//普通的json
        //console.log("json"+JSON.stringify(datas));
    }


}
var data = [];
var rs = fs.createReadStream(input, {
    flags: 'r',
    encoding: 'utf-8'
});

var ws = fs.createWriteStream(output, {
    flags: 'w+',//a：追加，w+ :复写
    encoding: 'utf-8'
});

var matched = false;
var CRLF = '\r\n';
var prevline = '';

rs.on('data', function (chunk) {
    var lines = chunk.split(CRLF);
    lines[0] = prevline + lines[0];

    if (chunk.substr(chunk.length - 2) !== CRLF) {
        prevline = lines.pop();
    } else {
        prevline = '';
    }
    var param = [];
    lines.forEach(function (line) {
        if (line.length > 0) {
            var fla = line.split("|")[2];
            switch (fla) {
                case 'b' :
                {
                    param = {'bshare': line.split("|")};
                }
                    break;
                case 'l' :
                {
                    param = {'lezhi': line.split("|")};
                }
                    break;
                case 'w' :
                {
                    param = {'weijifen': line.split("|")};
                }
                    break;
                case 'a' :
                {
                    param = {'ads': line.split("|")};
                }
                    break;
            }
            ws.write(JSON.stringify(param) + CRLF);
            data.push(param);
        }
    });
});

rs.on('end', function () {

    console.log('read done!');

    ws.end(function () {
        console.log('write done!');
        // datas = {'feeds':data} ;
        //console.log(datas);
    });
});

init();
function init(){

    try {
            var tmpdata = fs.readFileSync(keytext,"utf-8");
             choiceKeys = tmpdata.split("\n");
            //console.log(data);
            // Deal with data.
        } catch (err) {
            console.log("读取words.txt文件失败！");
            // Deal with error.
        }
 

}

//建立文件夹
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
