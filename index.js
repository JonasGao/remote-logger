const express = require("express");
const app = express();
const http = require("http").Server(app);
const port = process.env.PORT || 8888;
const socket = require("socket.io");
const getLogHandler = require("./handler");

app.use(express.static(__dirname + "/public"));

const ioOption = {
  transports: ["websocket"]
};
const io = socket(http, ioOption);
const monitors = [];

const initLogSocket = socket => {
  const logHandler = getLogHandler(socket);
  socket.on("log", logHandler);
  socket.on("log", data => {
    monitors.forEach(monitor => {
      monitor.emit("log", data);
    });
  });
};

io.on("connection", socket => {
  console.log("on connection! [socket id]", socket.id);

  socket.on("disconnect", () => {
    console.log("disconnect! [socket id]", socket.id);
  });

  if (socket.id.startsWith("/monitor")) {
    // skip monitor namespace
    return;
  }

  initLogSocket(socket);
});

io.of("/monitor").on("connection", socket => {
  console.log("monitor connected! [socket id]", socket.id);
  monitors.push(socket);
  socket.on("disconnect", () => {
    console.log("remove monitor, [socket id]", socket.id);
    monitors.splice(monitors.indexOf(socket), 1);
  });
});

http.listen(port, () => console.log("listening on port " + port));
