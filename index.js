const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 8888;
const socket = require('socket.io');

app.use(express.static(__dirname + '/public'));

const legecyIOOption = {
  transports: ['websocket'],
  serveClient: false
}
const legecyIO = socket(http, legecyIOOption);
const legecyOnConnection = socket => {
  socket.on('log', (data) => console.log(data));
}
legecyIO.on('connection', legecyOnConnection);

const v2IOOption = {
  path: '/socket.io/v2',
  serveClient: false,
  transports: ['websocket']
};
const v2IO = socket(http, v2IOOption);
const v2OnConnection = socket => {
  socket.on('log', data => {
    console.log(data);
  });
};
v2IO.on('connection', v2OnConnection);

http.listen(port, () => console.log('listening on port ' + port))