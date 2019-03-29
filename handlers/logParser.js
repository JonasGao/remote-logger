const PATTERN = /\[(.+?)\]:(\w+?):\[([\dTZ:\-\.]+?)\]:(.+?):\s?(.+)/;

const match = content => {
  return content.match(PATTERN);
};

const logParser = context => {
  const data = context.data;
  if (typeof data === "string") {
    context.origin = data;
    const result = match(data);
    if (!result || !result.length) {
      context.data = { v: 0, content: data };
      return;
    }
    const [, appName, level, time, logger, content] = result;
    context.data = { v: 1, content, app: appName, time, level, logger };
  }
};

module.exports = logParser;
