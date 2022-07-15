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

/*function antidosmsg(lastmsg) {
var msg = Date.now(); //time set
var lastmsg = 0;
var flag = 0;
if ((msg-lastmsg) <= 300 && lastmsg != 0) { //if the time difference more than 300 and the last time is not 0, it will be executed.
  flag++; //set 1 flag
}
if ((msg-lastmsg >= 300)  && flag != 0) { //if the time difference is less than 300 and a flag exists, it will be executed.
    flag--; //reset 1 flag
}
if (flag == 3) { //flag = 3 then disconnect client
  console.log("client gekickt");
  ws.close();
}
lastmsg = msg; //set last time
return lastmsg
}*/

var server = require('ws').Server;
var s = new server({port: 5001});
s.on('connection', function(ws) {
  if (typeof(lastmsg) == "undefined" && typeof(flag) == "undefined")  {
    var lastmsg = 0;
    var flag = 0;
  }
    ws.on('message',function(message) {
      //no crash
      //massage = JSON.parse(message);
      //var lastmsg = antidosmsg(lastmsg);

      var msg = Date.now(); //time set

      if ((msg-lastmsg) <= 100 && lastmsg != 0) { //if the time difference more than 300 and the last time is not 0, it will be executed.
        flag++; //set 1 flag
      }
      if ((msg-lastmsg >= 100)  && flag != 0) { //if the time difference is less than 300 and a flag exists, it will be executed.
          flag--; //reset 1 flag
      }
      if (flag == 500) { //flag = 3 then disconnect client
        console.log("client gekickt");
        ws.close();
      }
      lastmsg = msg; //set last time

      console.log("Received: "+message);
      try {
          message = JSON.parse(message);
      } catch (e) {
          ws.send("Lade das benötigte Programm, um den Server zu kontaktieren.");
          return ;
      }
      if(message.type == "channel") {
        ws.channel = message.data;
        console.log("Channel: "+ws.channel);
        return;
      }

      if(message.type == "password") {
        ws.password = message.data;
        console.log("Password: "+ws.password);
        return;
      }

      if(message.type == "username") {
        ws.username = message.data;
        console.log("Username: "+ws.username);
        return;
      }

      if(message.type == "play") {
        ws.play = message.data;
        console.log("play: "+ws.playy);
        return;
      }

      if(message.type == "chat") {
        ws.chat = message.data;
        console.log("chat: "+ws.chat);
        return;
      }

      s.clients.forEach(function e(client) {
              //console.log();
        if (client.channel == ws.channel && client.password == ws.password && client != ws)
          //client.send(message);

       if(message.type == "currentTime") {
          client.send(JSON.stringify({
              //name: ws.personName,
              //data: message.data,
              currentTime: message.data,
              Time: message.time,
              play: message.play,
              username: ws.username,
          }));
        }

        if(message.type == "chat") {
           client.send(JSON.stringify({
               //name: ws.personName,
               //data: message.data,
               chat: message.chat,
               username: ws.username,
           }));
         }

      });
    });

    ws.on('close', function(){
      console.log("i lost a client");
    });
    console.log("one more client connected");
});
