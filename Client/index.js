/*
// Minimal amount of secure websocket server
var fs = require('fs');

// read ssl certificate
var privateKey = fs.readFileSync('ssl-cert/privkey.pem', 'utf8');
var certificate = fs.readFileSync('ssl-cert/fullchain.pem', 'utf8');

var credentials = { key: privateKey, cert: certificate };
var https = require('https');

//pass in your credentials to create an https server
var httpsServer = https.createServer(credentials);
httpsServer.listen(8443);



var s = new WebSocketServer({
    server: httpsServer
});
*/


var server = require('ws').Server;
var s = new server({port: 5001});
//var s = new server({port: 5001, host:'[2a02:8070:b58b:df00:1d6d:0:6a99:ec39]', tls: true});var s = new server({port: 5001, host:'[2a02:8070:b58b:df00:1d6d:0:6a99:ec39]', tls: true});
console.log("Load Server");

var name;

s.on('connection', function(ws) {
    ws.on('message',function(message) {
      //no crash
      //massage = JSON.parse(message);
            console.log("Received: "+message);
      try {
          message = JSON.parse(message);
      } catch (e) {
          ws.send("Lade das benötigte Programm, um den Server zu kontaktieren.");
          return ;
      }
      if(message.type == "name") {
        ws.personName = message.data;
        console.log("Name: "+ws.personName);
        return;
      }

      console.log("Received: "+message.type + message.data + message.time);

      s.clients.forEach(function e(client) {
        if (client != ws)


          //client.send(message);
          client.send(JSON.stringify({
            //name: ws.personName,
            //data: message.data,
            currentTime: message.data,
            Time: message.time
        }));
      });
    });

    ws.on('close', function(){
      console.log("i lost a client");
    });
    console.log("one more client connected");
});
