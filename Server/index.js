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
var s = new server({
  port: 5001
});
s.on('connection', function(ws) {
  if (typeof(lastmsg) == undefined && typeof(flag) == undefined) {
    var lastmsg = 0;
    var flag = 0;
  }
  ws.on('message', function(message) {
    //no crash
    //massage = JSON.parse(message);
    //var lastmsg = antidosmsg(lastmsg);

    var msg = Date.now(); //time set

    if ((msg - lastmsg) <= 100 && lastmsg != 0) { //if the time difference more than 300 and the last time is not 0, it will be executed.
      flag++; //set 1 flag
    }
    if ((msg - lastmsg >= 100) && flag != 0) { //if the time difference is less than 300 and a flag exists, it will be executed.
      flag--; //reset 1 flag
    }
    if (flag == 500) { //flag = 3 then disconnect client
      console.log("client gekickt");
      ws.close();
    }
    lastmsg = msg; //set last time

    console.log("Received: " + message);
    try {
      message = JSON.parse(message);
    } catch (e) {
      ws.send("Lade das benötigte Programm, um den Server zu kontaktieren.");
      return;
    }

    if ((message.channel != undefined) || (message.password != undefined) || (message.username != undefined)) {
      if (message.channel != undefined) {
        ws.channel = message.channel;
        console.log("Channel: " + ws.channel);
      }

      if (message.password != undefined) {
        ws.password = message.password;
        console.log("Password: " + ws.password);
      }

      if (message.username != undefined) {
        ws.username = message.username;
        console.log("Username: " + ws.username);
      }

      if ((message.channel != undefined && message.password != undefined && ws.username != undefined)) {
        var clients_in_room = 0;
        var videoid_in_room;
        s.clients.forEach(function e(client) {
          if (client.channel == ws.channel && client.password == ws.password && client != ws) {
            clients_in_room++
            if (client.videoid != false) {
              videoid_in_room = client.videoid;
            }

            client.send(JSON.stringify({
              chat: ws.username + " ist beigetreten.",
              username: ws.username,
            }));

          }
        });

        var room_info = JSON.stringify({
          type: "room_info",
          clients_in_room: clients_in_room
        });
        
        if (videoid_in_room != false) {
          //JSON.stringify(JSON.parse(room_info).push(JSON.stringify({
          //videoid_in_room: videoid_in_room
          //})));
          //room_info["videoid_in_room"] = videoid_in_room;
          //room_info.videoid_in_room = videoid_in_room;

          var room_info_temp = JSON.parse(room_info); //change to obj
          room_info_temp.videoid_in_room = videoid_in_room; //add something
          room_info = JSON.stringify(room_info_temp); //change back to string

        }

        ws.send(room_info);
      }
      return;
    }

    if (message.type == "videoid") {
      ws.videoid = message.videoid;
      console.log("VideoID: " + ws.videoid);

      s.clients.forEach(function e(client) {
        if ((client.channel == ws.channel && client.password == ws.password && client != ws)) {
          if (client.videoid != false) {
            client.videoid = false;
            //Abbrechen wäre eigentlich möglich.
          }
        }
      });
    }

    s.clients.forEach(function e(client) {
      if (client.channel == ws.channel && client.password == ws.password && client != ws) {

        if (message.type == "currentTime") {
          client.send(JSON.stringify({
            currentTime: message.currentTime,
            play: message.play,
            username: ws.username,
          }));
        }

        if (message.type == "chat") {
          client.send(JSON.stringify({
            chat: message.chat,
            username: ws.username,
          }));
        }

        if (message.type == "videoid") {
          client.send(JSON.stringify({
            videoid: message.videoid,
            username: ws.username,
          }));
        }
      }
    });
  });

  ws.on('close', function() {
    console.log("i lost a client");
  });
  console.log("one more client connected");
});
