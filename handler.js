const appFileHandler = require("./handlers/appFileHandler");
const consoleHandler = require("./handlers/consoleHandler");

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
