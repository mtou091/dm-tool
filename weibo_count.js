//https://api.weibo.com/2/users/show.json?access_token=#{@access_token}&uid=#{uid}"

var fs = require("fs");
var readline = require('readline');
var http = require('https');
var token = "2.003k6msBdANkCD0d72ec0623dEXb9E";
var input_file = "1911641745_25621.txt";

function weibo_count(uid){
  //console.log(uid);
  var url = 'https://api.weibo.com/2/users/show.json?access_token='+token+'&uid='+uid;
  //以下是接受数据的代码
  var body = '';
  var req = http.get(url, function(res) {
    //console.log("Got response: " + res.statusCode);
    res.on('data',function(chunk){
    body += chunk;
   }).on('end', function(){
    //console.log(body)

    var json = JSON.parse(body)
    var result = {}
    // {"u":"111111","followers_count":"168","friends_count":"245","statuses_count":"1343","favourites_count":"8","bi_followers_count":"50"}
    if (json.id) {
      result.u = json.id
      result.followers_count = json.followers_count
      result.friends_count = json.friends_count
      result.statuses_count = json.statuses_count
      result.favourites_count = json.favourites_count
      result.bi_followers_count = json.bi_followers_count

      console.log(JSON.stringify(result));
    }
   });

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  })
  req.end();
}

var rd = readline.createInterface({
    input: fs.createReadStream(input_file),
    output: process.stdout,
    terminal: false
});

rd.on('line', function(uid) {
    weibo_count(uid);
});
