const fsPromises = require("fs").promises;
const path = require("path");
const endOfLine = require('os').EOL;
const logPath = require("../config").logPath;

const mkdir = filename => {
  const { dir } = path.parse(filename);
  return fsPromises.mkdir(dir, { recursive: true });
};

const appendFile = async (path, data) => {
  await mkdir(path);
  return fsPromises.appendFile(path, data + endOfLine);
};

const getAppLogFileName = appName => {
  return path.join(logPath, `${appName.replace(/\s/g, "_")}.log`);
};

const writeAppLogFile = (appName, data) => {
  const path = getAppLogFileName(appName);
  return appendFile(path, data);
};

const promiseHandles = {};
const setAppPromise = (appName, promise) => {
  promiseHandles[appName] = promise;
};
const getAppPromise = appName => {
  return promiseHandles[appName] || Promise.resolve();
};

const appFileHandler = context => {
  const data = context.data;
  if (!data.app) {
    return;
  }
  const appName = data.app;
  getAppPromise(appName).then(() => {
    const promise = writeAppLogFile(data.app, data.content);
    setAppPromise(appName, promise);
  });
};

module.exports = appFileHandler;
exports.default = appFileHandler;
