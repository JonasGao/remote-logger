const fs = require("fs");
const path = require("path");
const endOfLine = require("os").EOL;
const logPath = require("../config").logPath;

const mkdir = filename => {
  const { dir } = path.parse(filename);
  return new Promise((resolve, reject) => {
    fs.access(dir, fs.constants.F_OK, err => {
      if (err) {
        console.log("access error, try mkdir. [error]", err);
        fs.mkdir(dir, { recursive: true }, err => {
          err ? reject(err) : resolve();
        });
        return;
      }
      resolve();
    });
  });
};

const appendFile = async (path, data) => {
  await mkdir(path);
  return new Promise((resolve, reject) => {
    fs.appendFile(path, data + endOfLine, err => {
      err ? reject(err) : resolve();
    });
  });
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
