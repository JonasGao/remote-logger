const appFileHandler = require("./appFileHandler");
const consoleHandler = require("./consoleHandler");

const handlers = [appFileHandler, consoleHandler];

const getLogHandler = socket => {
  return data => {
    const context = {
      data: data,
      complete: false,
      socket: socket
    };
    handlers.forEach(handler => {
      if (context.complete) {
        return;
      }
      handler(context);
    });
  };
};

module.exports = getLogHandler
