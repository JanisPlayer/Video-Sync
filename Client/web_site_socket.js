var Server_IP = "wss://heldendesbildschirms.de/ws";

var ws = 404;


var last_channel;
var last_password;
var last_username;

function sendMessage(currentTime, play, channel, password, username, chat, videoid) {

  // Create WebSocket connection.
  // Connection opened

  try {
    if ((ws.readyState !== WebSocket.OPEN) && (ws.readyState !== 0) && (ws.readyState != 301) || (ws.readyState == 404)) {
      ws = 301;
      socket_init()
      socket_open();
    }
  } catch (e) {}

  //ws.onopen = function() {
  try {
    if (last_channel != channel || last_password != password || last_username != username) { //Ja keine Lust auf eine Funktion also alle.
      server_send(false, false, channel, password, username, false, false);
      last_channel = channel;
      last_password = password;
      last_username = username;
    }
    server_send(currentTime, play, false, false, false, chat, videoid);
  } catch (e) {
    var TryConnect = setInterval(function() {
      if (last_channel != channel || last_password != password || last_username != username) { //Ja keine Lust auf eine Funktion also alle.
        server_send(false, false, channel, password, username, false, false);
        last_channel = channel;
        last_password = password;
        last_username = username;
      }
    }, 5000);
  }
}

function hold_connection () {

    //setInterval(server_send(false, false, channel, password, false, false, false), 60000); //Serverseitig fehlt noch.
}

function socket_init() {
  try {
    if ((ws.readyState != WebSocket.OPEN) || (ws.readyState == 404)) {
      ws = new WebSocket(Server_IP);
      ws.onopen = onOpen;
      ws.onclose = onClose;
      ws.onmessage = onMessage;
      //socket_open();
    }
    hold_connection() //Hold Connection
  } catch (e) {}
}

function socket_open() {
  ws.onopen = function() {
    ws.onmessage = function(s) {
      /*var username = false; //Weniger JSON gelese.
      if (json.username != false) {
      username = json.username;
    }*/

      var json = JSON.parse(s.data);

      if (json.currentTime != undefined) {
        var currentTime = parseFloat(json.currentTime);

        if (json.Time != undefined) {
          currentTime = currentTime + ((parseFloat(Date.now() / 1000)) - json.Time); //no delay}
        }
        //try {
        //if (player.getCurrentTime != undefined && currentTime > 0) {
        if (currentTime > 1 && player.getCurrentTime() < currentTime - 0.5 || player.getCurrentTime() > currentTime + 0.5) { //]&& player.paused = false && player.seeking  && currentTime < player.buffered.end(player.buffered.length-1) - 10.0 ) {
          //player.pauseVideo(); //Unsauberer Fix PauseLoop
          player.seekTo(currentTime);
          //player.playVideo(); //Unsauberer Fix PauseLoop
        }

        /*} else {
          player.seekTo(currentTime);

          if (json.username != undefined && json.play != undefined) {
            check_and_log_chat(json.username, +" " + json.play + " " + json.currentTime, false); //XSS
          }
        }*/
        /*} catch (e) {
          player.seekTo(currentTime);

          if (json.username != undefined && json.play != undefined) {
            check_and_log_chat(json.username, +" " + json.play + " " + json.currentTime, false); //XSS
          }
        }*/
      }

      if (json.username != undefined && json.play != undefined && json.currentTime != undefined) { //Egal wo hin vor currentTime oder dahinter es bugt.
        check_and_log_chat(json.username, +" " + json.play + " " + json.currentTime, false); //XSS
      }

      if (json.play != undefined) {
        if (json.play == true) {
          player.playVideo();
        } else {
            //player.pauseVideo(); //Unsauberer Fix PauseLoop
        }
      }


      if (json.type == "room_info") {
        check_and_log_chat(json.username, "Willkommen im Chat, es sind " + json.clients_in_room + " weitere Nutzer im Raum eingeloggt", false); //XSS

        var videoid_in_room = json.videoid_in_room;
        if (videoid_in_room != undefined) {
          check_and_log_chat(json.username, false, videoid_in_room); //XSS
        }
      }

      if (json.chat != undefined && json.username != undefined) {
        check_and_log_chat(json.username, json.chat, false); //XSS
      }
      if (json.videoid != undefined && json.username != undefined) {
        check_and_log_chat(json.username, false, json.videoid); //XSS
      }

    };
  };
}

function server_send(currentTime, play, channel, password, username, chat, videoid) {
  var time = Date.now() / 1000;

  if (channel != false || password != false || username != false) {
    ws.send(JSON.stringify({
      type: 'join_data',
      channel: channel,
      password: password,
      username: username
    }));
  }

  if (currentTime != false || time != 3) {
    var play_temp = JSON.stringify({
      type: 'currentTime',
      currentTime: currentTime,
      time: time,
    });

    if (play != 3) {
      play_temp = JSON.parse(play_temp);
      play_temp.play = play;
      play_temp = JSON.stringify(play_temp);
    }
    ws.send(play_temp)
  }

  if (chat != false) {
    ws.send(JSON.stringify({
      type: 'chat',
      chat: chat
    }));
  }

  if (videoid != false) {
    ws.send(JSON.stringify({
      type: 'videoid',
      videoid: videoid
    }));
  }
}


/*function onMessage(event) {
    alert(event.data);
}*/


// Listen for messages
/*ws.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});*/




/*function writeToScreen(message)
{
  var pre = document.createElement("p");
  pre.style.wordWrap = "break-word";
  pre.innerHTML = message;
  output.appendChild(pre);
}*/
