var redis = require('redis'),
    client = redis.createClient(6379, "192.168.1.208");

client.on('error', function(err) {
  console.log("Redis Error: " + err);
});

client.set("name", "sanford");
client.get("name", function(err, reply) {
  console.log(reply);
});
