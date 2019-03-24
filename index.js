const express = require("express");
const app = express();
const http = require("http").Server(app);
const port = process.env.PORT || 8888;
const socket = require("socket.io");
const appFileHandler = require("./handlers/appFileHandler");
const consoleHandler = require("./handlers/consoleHandler");

app.use(express.static(__dirname + "/public"));

const handlers = [appFileHandler, consoleHandler];
const logHandler = data => {
  const context = {
    data: data,
    complete: false
  };
  handlers.forEach(handler => {
    if (context.complete) {
      return;
    }
    handler(context);
  });
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
