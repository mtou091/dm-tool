
var fs = require("fs");
var urllib = require('url');
var http = require('https');
var input = '../dm/public/work';
var keywords =['|b|','|l|','|w|','|a|'];
var output = '../dm/public/log';
var token = "2.003k6msBdANkCD0d72ec0623dEXb9E";
var flag = false;

var datas ={};

exports.autoroute = {
    'get' : {
        '(.?)/(index)?' : index/*showIndexView,
        '(.?)/login' : checkLoginHandler,
        '(.?)/logout' : onLogoutHandler,
        '(.?)/log_out' : onClearUserIdenHandler,
        '(.?)/update_priv' : updatePrivHandler
        */
    },
    'post' : {
      '(.?)/sinaUid' : sinaUid
    }
};


function index(req, res){

  var params = urllib.parse(req.url, true);
  console.log(params);
 
  if (params.query && params.query.callback) {
    //console.log(params.query.callback);
    var str =  params.query.callback + '(' + JSON.stringify(datas) + ')';//jsonp
    
    res.end(str);
  } else {
    res.end(JSON.stringify(datas));//普通的json
   
  }    


}

function sinaUid(req, res){
  var params = urllib.parse(req.url, true);
  //console.log(req);
 
 // var postStr = req.body ;
    var data = req.body;
    var uids = data.feed;
    var datass = {}; 
    for (var i = uids.length - 1; i >= 0; i--) {
       httpurl(uids[i]);
       datass[uids[i]]= datas[uids[i]];
    };

  if (params.query && params.query.callback) {
      console.log(datass);
    
    var str =  params.query.callback + '(' + JSON.stringify(datass) + ')';//jsonp
   // console.log("jsonp"+str);
    res.end(str);
  } else {
    res.end(JSON.stringify(datass));//普通的json
     //console.log("json"+JSON.stringify(datas));
  }    

}


function httpurl(uid){
    flag = false;
    var url = 'https://api.weibo.com/2/users/show.json?access_token='+token+'&uid='+uid;
    var body = '';
    var req = http.get(url, function(res) {
  //console.log("Got response: " + res.statusCode);
  res.on('data',function(chunk){
         body += chunk;
      }).on('end', function(){
         flag = true;
         datas[uid] = JSON.parse(body).name;
        
      });

 }).on('error', function(e) {
        flag = false;
        console.log("Got error: " + e.message);
 })
req.end();


}


function showIndexView(req, res) {
    if (req.session.user && req.session.user.uId !== undefined && req.session.user.uName !== undefined) {
        res.end();
        res.redirect("main");
    } else {
        res.render('index', {user : req.session.user});
    }
}


var data =[];
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
        if(line.length > 0){
         var fla =  line.split("|")[2];
         switch(fla){
           case 'b' : {
              param = {'bshare':line.split("|")};
           } break;
           case 'l' : {
              param = {'lezhi':line.split("|")};
           } break;
           case 'w' : {
              param = {'weijifen':line.split("|")};
           } break;
           case 'a' : {
              param = {'ads':line.split("|")};
           } break;
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
