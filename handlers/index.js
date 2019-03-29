const appFileHandler = require("./appFileHandler");
const consoleHandler = require("./consoleHandler");
const logParser = require("./logParser");

const handlers = [logParser, appFileHandler, consoleHandler];

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
    return context;
  };
};

module.exports = getLogHandler;
