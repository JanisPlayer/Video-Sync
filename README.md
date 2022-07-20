# Video-Sync
Altes Plugin von mir, welches ich vielleicht als Webseite neu baue.

Der neubau hat begonnen.

Todo:
Raumliste, wo Räume eingetragen werden als Raum Infos in jedem Client zu speichern.  
Die Räume sollen bei 0 Nutzern gelöscht werden, aussher Login für Raum speichern ist an.
Neues Overlay wo man sieht wer im Raum ist und wie viele und besseres CSS.
invied_link in get als passwort.


Client und Server Befehle:

Client:
join_data: channel, password, username
chat: chat
videoid: videoid
SyncVideo: currentTime, play, time, 

Server Antworten:
ClinetInfo: ->
ServerInfo: clients_in_room, videoid_in_room, currentTime_in_room, play_in_room, invied_key(Kommt noch vielleicht, wenn der Hash probleme macht.)
SyncVideo: <-
