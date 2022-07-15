var Server_IP = "ws://sf.heldendesbildschirms.de:5001";

var ws = 404;

function sendMessage(currentTime, play, channel, password, username) {

  // Create WebSocket connection.

  // Connection opened

  try {
    if ((ws.readyState != WebSocket.OPEN) || (ws.readyState == 404)) {
      ws = new WebSocket(Server_IP);
      socket_open();
    }
  } catch (e) {}

  try {
    server_send(currentTime, play, channel, password, username);
  } catch (e) {
    var TryConnect = setInterval(function() {
      server_send(currentTime, play, channel, password, username);
      clearInterval(TryConnect);
    }, 5000);

  }
  //sendResponse({farewell: currentTime});

};


function socket_open() {
  ws.onopen = function() {
    ws.onmessage = function(s) {
      alert(s.data);
      var json = JSON.parse(s.data);

      currentTime = (parseFloat(json.currentTime) + (parseFloat(Date.now() / 1000)) - json.Time); //no delay
    };
  };
}

function server_send(currentTime, play, channel, password, username) {
  var time = Date.now() / 1000;

  if (channel != null) {
    ws.send(JSON.stringify({
      type: 'channel',
      data: channel
    }));
  }

  if (password != null) {
    ws.send(JSON.stringify({
      type: 'password',
      data: password
    }));
  }

  if (username != null) {
    ws.send(JSON.stringify({
      type: 'username',
      data: username
    }));
  }

  if (currentTime != null) {
    ws.send(JSON.stringify({
      type: 'currentTime',
      data: currentTime,
      time: time
    }));
  }

  if (play != null) {
    socket.send(JSON.stringify({
      type: 'play',
      data: play
    }));
  }
}

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
