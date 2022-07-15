var Server_IP = "wss://heldendesbildschirms.de/ws";

var ws = 404;


var last_channel;
var last_password;
var last_username;

function sendMessage(currentTime, play, channel, password, username, chat) {

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
    server_send(currentTime, play, false, false, false, chat);
  } catch (e) {
    if (last_channel != channel || last_password != password || last_username != username) { //Ja keine Lust auf eine Funktion also alle.
        server_send(false, false, channel, password, username, false);
        last_channel = channel;
        last_password = password;
        last_username = username;
    }
    var TryConnect = setInterval(function() {
      server_send(currentTime, play, false, false, false, chat);
      clearInterval(TryConnect);
    }, 5000);
  }
    if (last_channel != channel || last_password != password || last_username != username) { //Ja keine Lust auf eine Funktion also alle.
        server_send(false, false, channel, password, username, false);
        last_channel = channel;
        last_password = password;
        last_username = username;
    }

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
}

function socket_open() {
  ws.onopen = function() {
    ws.onmessage = function(s) {
      var json = JSON.parse(s.data);
      var currentTime = (parseFloat(json.currentTime) + (parseFloat(Date.now() / 1000)) - json.Time); //no delay
      if (currentTime > 1 && player.getCurrentTime() < currentTime - 0.5 || player.getCurrentTime() > currentTime + 0.5) { //]&& player.paused = false && player.seeking  && currentTime < player.buffered.end(player.buffered.length-1) - 10.0 ) {
        player.seekTo(currentTime);
        record(json.currentTime);
      }
      if (json.chat && json.username) {
          check_and_log_chat(json.username, json.chat); //XSS
      }
      };
    };
  }

  function server_send(currentTime, play, channel, password, username, chat) {
    var time = Date.now() / 1000;

    if (channel != false || password != false) {
      ws.send(JSON.stringify({
        type: 'channel',
        data: channel,
        type: 'password',
        data: password
      }));
    }

    if (username != false) {
      ws.send(JSON.stringify({
        type: 'username',
        data: username
      }));
    }

    if (currentTime != false) {
      ws.send(JSON.stringify({
        type: 'currentTime',
        data: currentTime,
        time: time,
        play: play,
      }));
    }

    if (chat != false) {
      ws.send(JSON.stringify({
        type: 'chat',
        data: chat
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
