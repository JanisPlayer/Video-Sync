var Server_IP = "wss://heldendesbildschirms.de/ws";

var ws = 404;


var last_channel;
var last_password;
var last_username;

function sendMessage(currentTime, play, channel, password, username, chat, videoid) {

  if (password_is_MD5 != true || last_MD5password != password) {
    var password = MD5(password);
  }

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
  if ((ws.readyState !== WebSocket.OPEN) && (ws.readyState !== 0) && (ws.readyState != 301) || (ws.readyState == 404)) {
    try {
      ws.addEventListener('open', (event) => {
        ws.send('Hello Server!');
        if (last_channel != channel || last_password != password || last_username != username) { //Ja keine Lust auf eine Funktion also alle.
          last_channel = channel;
          last_password = password;
          last_username = username;
          server_send(false, false, channel, password, username, false, false);
        }
        server_send(currentTime, play, false, false, false, chat, videoid);
      });
    } catch (e) {
      var TryConnect = setTimeout(function() {
        server_send(false, false, channel, password, username, false, false);
      }, 5000);
    }
  } else {
    try {
      if (last_channel != channel || last_password != password || last_username != username) { //Ja keine Lust auf eine Funktion also alle.
        last_channel = channel;
        last_password = password;
        last_username = username;
        server_send(false, false, channel, password, username, false, false);
      }
      server_send(currentTime, play, false, false, false, chat, videoid);
    } catch (e) {
      var TryConnect = setTimeout(function() {
        server_send(false, false, channel, password, username, false, false);
      }, 5000);
    }
  }
}

function hold_connection() {
  setInterval(function() {
    ws.send("im_here");
  }, 30000);
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
  } catch (e) {}
  hold_connection(); //Hold Connection
}

function socket_open() {
  ws.onopen = function() {
    ws.onmessage = function(s) {
      /*var username = false; //Weniger JSON gelese.
      if (json.username != false) {
      username = json.username;
    }*/

      try {
        var json = JSON.parse(s.data);
      } catch (e) {
        return;
      }

      if (json.type == "room_info") {
        check_and_log_chat(false, "Willkommen im Chat, es sind " + json.clients_in_room + " weitere Nutzer im Raum eingeloggt", false); //XSS

        var videoid_in_room = json.videoid_in_room;
        if (videoid_in_room != undefined) {
          no_loop_for(3000);
          check_and_log_chat(json.username, false, videoid_in_room); //XSS

          setTimeout(function() {
            if (json.currentTime_in_room != undefined) {
              no_loop_for(100); //Zur Sicherheit.
              player.seekTo(json.currentTime_in_room - 2.5);
            }

            if (json.play_in_room != undefined) {
              no_loop_for(100); //Zur Sicherheit.
              if (json.play_in_room == true) {
                player.playVideo();
              } else {
                player.pauseVideo();
              }
            }
          }, 2500);
        }
      }

      if (json.chat != undefined && json.username != undefined) {
        check_and_log_chat(json.username, json.chat, false); //XSS
      }

      if (json.videoid != undefined && json.username != undefined) {
        //no_loop_for(10000); Fail
        check_and_log_chat(json.username, false, json.videoid); //XSS
      }

      if (json.currentTime != undefined) {
        var currentTime = parseFloat(json.currentTime);

        if (json.Time != undefined) {
          currentTime = currentTime + ((parseFloat(Date.now() / 1000)) - json.Time); //no delay}
        }
        //try {
        //if (player.getCurrentTime != undefined && currentTime > 0) {
        if (currentTime > 1 && player.getCurrentTime() < currentTime - 0.5 || player.getCurrentTime() > currentTime + 0.5) { //]&& player.paused = false && player.seeking  && currentTime < player.buffered.end(player.buffered.length-1) - 10.0 ) {
          //player.pauseVideo(); //Unsauberer Fix PauseLoop
          no_loop_for(100);
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
        no_loop_for(100);
        if (json.play == true) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
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
