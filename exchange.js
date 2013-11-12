//https://api.weibo.com/2/users/show.json?access_token=#{@access_token}&uid=#{uid}"
var http = require('http');

var token = "2.003k6msBdANkCD0d72ec0623dEXb9E";
var uid = "2718443117";

var opt = {
  host: 'api.weibo.com',
  port: 80,
  path: 'https:api.weibo.com/2/users/show.json?access_token='+token+'&uid='+uid
};


//以下是接受数据的代码
var body = '';
var req = http.request(opt, function(res) {
  console.log("Got response: " + res.statusCode);
  res.on('data',function(chunk){
  body += chunk;
 }).on('end', function(){

  console.log(res.headers)
  console.log(body)
 });

}).on('error', function(e) {
  console.log("Got error: " + e.message);
})
req.end();
