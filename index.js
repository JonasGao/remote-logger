const express = require("express");
const app = express();
const http = require("http").Server(app);
const port = process.env.PORT || 8888;
const socket = require("socket.io");

app.use(express.static(__dirname + "/public"));

const v1Handler = data => {
  console.log(data);
  return true;
};
const v2Handler = data => {
  if (data.v && data.v == 2) {
    // TODO: start here
    console.log('v2!', data)
    return true;
  }
  return false;
};

const logHandler = data => {
  v2Handler(data) || v1Handler(data);
};
const ioOption = {
  transports: ["websocket"],
  serveClient: false
};
const io = socket(http, ioOption);
const onConnection = socket => {
  socket.on("log", logHandler);
};
io.on("connection", onConnection);

http.listen(port, () => console.log("listening on port " + port));
