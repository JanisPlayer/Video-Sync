# Video-Sync
Altes Plugin von mir, welches ich vielleicht als Webseite neu baue.

Der neubau hat begonnen.

Todo:
Raumliste, wo Räume eingetragen werden als Raum Infos in jedem Client zu speichern.  
Die Räume sollen bei 0 Nutzern gelöscht werden, aussher Login für Raum speichern ist an.
Neues Overlay wo man sieht wer im Raum ist und wie viele und besseres CSS.
invied_link als passwort wegen GET wenn die Raumliste da ist oder einfach den Hash in den Link, aber das muss der Client erkennen ob es ein Hash ist.

Onclose Server und Client nutzen.
Beim Server um den anderen Clients zu sagen, dass der Client getrennt ist.
Bei dem Client um beim Verbindungsverlust neu zu verbinden, aber ob das nötig ist.
Ein Timer der gestartet wird, wenn das Video gepuffert wird und diese Zahl wird dann multipliziert mit der Zeit. Damit der Client nicht erneut Informationen sendet, wird die Funktion so lange gesperrt.

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

Bugs:
Name ändern löst Loop aus.
