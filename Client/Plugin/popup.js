function sendMessage(currentTime, channel, password, username)  {
  chrome.runtime.sendMessage({"currentTime": currentTime,"channel": channel,"password": password,"username": username}, function(response) {
    //console.log(response.farewell);
    //document.getElementById("LastSync").innerHTML = "Last Sync: " + response.farewell;
  });
}

function get_currentTime() {
chrome.tabs.executeScript( null, {code:'get_currentTime();'},
function(results){
document.getElementById("LastSync").innerHTML = "Last Sync: " + results + " from: You";
currentTime = results;
sendMessage(currentTime, null, null, null);
});
}

function send_create_room() {
  var username = document.getElementById("username_text").value;
  var channel = document.getElementById("channel_text").value;
  var password = document.getElementById("password_text").value;

  if (document.getElementById("checkbox_save_password").checked == true) {
  chrome.storage.sync.set({'password': password, 'channel': channel, 'username': username}, function() {

  });
  }

  sendMessage(null, channel, MD5(password), username);
  alert("Raum Erstellt: "+ channel);
}

function set_currentTime() {
chrome.tabs.executeScript( null, {code:'set_currentTime('+ currentTime  +');'});
}

function set_currentTime_loop() {
  var username = document.getElementById("username_text").value;
  var channel = document.getElementById("channel_text").value;
  var password = document.getElementById("password_text").value;
  chrome.tabs.executeScript( null, {code:'set_currentTime_loop('+channel+', '+MD5(password)+', '+ username +');'});
}

chrome.storage.sync.get(['password', 'channel', 'username'], function(result) {
document.getElementById("username_text").value = result.username;
document.getElementById("channel_text").value = result.channel;
document.getElementById("password_text").value = result.password;
});

document.addEventListener('DOMContentLoaded', () => {
document.getElementById("LastSync").innerHTML = "Last Sync:";
document.getElementById('Sync').addEventListener('click', get_currentTime);
document.getElementById('create_room').addEventListener('click', send_create_room);
document.getElementById('Sync_Loop').addEventListener('click', set_currentTime_loop);

});
