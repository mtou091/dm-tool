
var fs = require("fs");
var urllib = require('url');
var input = '../dm/public/work';
var keywords =['|b|','|l|','|w|','|a|'];
var output = '../dm/public/log';

var datas = {'feeds':data};

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
       // '(.?)/login' : checkLoginHandler
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
    });
});
