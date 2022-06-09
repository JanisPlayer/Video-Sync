var Server_IP = "ws://[2a02:8070:b58b:df00:1d6d:0:6a99:ec39]:5001";

function sendMessage(currentTime, channel, password, username)  {
                try {

                if (socket.readyState != WebSocket.OPEN) {
                      socket = new WebSocket(Server_IP);
                      socket_open();
                }

                } catch (e) {
                        socket = new WebSocket(Server_IP);
                        socket_open();
                }

                setTimeout(function () {
                if (socket.readyState != WebSocket.OPEN)  {
                  socket = new WebSocket(Server_IP);
                setTimeout(function () {
                server_send(request.currentTime, request.channel, request.password, request.username);
                }, 3000);

                }
                }, 3000);


                try {
                server_send(request.currentTime, request.channel, request.password, request.username);
                } catch (e) {
                var TryConnect = setInterval(function () {
                  server_send(request.currentTime, request.channel, request.password, request.username);
                  clearInterval(TryConnect);
                }, 5000);

                }
                //sendResponse({farewell: currentTime});

  });


function socket_open() {
socket.onopen= function() {
socket.onmessage= function(s) {

  var json = JSON.parse(s.data);

  currentTime = (parseFloat(json.currentTime) + (parseFloat(Date.now() / 1000)) - json.Time); //no delay
  chrome.tabs.executeScript( null, {code:'set_currentTime('+ currentTime  +');'});
};
};
}

function server_send(currentTime, channel, password, username) {

  var time = Date.now() / 1000;

    if (channel != null) {
    socket.send(JSON.stringify({
      type: 'channel',
      data: channel
    }));
    }

    if (password != null) {
    socket.send(JSON.stringify({
      type: 'password',
      data: password
    }));
    }

    if (username != null) {
    socket.send(JSON.stringify({
      type: 'username',
      data: username
    }));
    }

    if (currentTime != null) {
    socket.send(JSON.stringify({
      type: 'currentTime',
      data: currentTime,
      time: time
    }));
    }
  }

  var wsUri = "ws://192.168.0.143:5001";
  var output;

  function init()
  {
    output = document.getElementById("output");
    //testWebSocket();
  }

  function testWebSocket()
  {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
  }

  function onOpen(evt)
  {
    //writeToScreen("CONNECTED");
    //doSend("WebSocket rocks");
  }

  function onClose(evt)
  {
    //writeToScreen("DISCONNECTED");
  }

  function onMessage(evt)
  {
    //writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
    websocket.close();
  }

  function onError(evt)
  {
    //writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
  }

  function doSend(message)
  {
    //writeToScreen("SENT: " + message);
    websocket.send(message);
  }

  /*function writeToScreen(message)
  {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
  }*/

  window.addEventListener("load", init, false);
