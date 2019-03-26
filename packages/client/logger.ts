interface ILogging {
  (message?: any, ...optionalParams: any[]): void;
}

interface ILogger {
  info: ILogging;
  error: ILogging;
  debug: ILogging;
}

function noop() {}

type LogLevel = 1 | 2 | 3;

const LEVEL: {
  debug: LogLevel;
  error: LogLevel;
  info: LogLevel;
} = {
  debug: 3,
  error: 1,
  info: 2,
};

function getGlobalLevel() {
  const levelName = process.env.LOG_LEVEL || 'info';
  const level = LEVEL[levelName];
  if (!level) {
    throw new Error(`undefined level [${levelName}]`);
  }
  return level;
}

function isEnabled(level: LogLevel) {
  return level <= getGlobalLevel();
}

function createEnabledLogMethod(level: LogLevel, creator: () => ILogging): ILogging {
  if (isEnabled(level)) {
    return creator();
  }
  return noop;
}

let CurrentLogger = (function() {
  if (process.env.REMOTE_LOG !== 'true') {
    return class ConsoleLogger implements ILogger {
      private readonly name: string;
      public debug: ILogging;
      public error: ILogging;
      public info: ILogging;

      constructor(name) {
        this.name = name;
        const t = window.console;
        this.debug = t.debug.bind(t);
        this.error = t.error.bind(t);
        this.info = t.info.bind(t);
      }
    };
  }

  class RemoteLogger implements ILogger {
    static io: SocketIOClientStatic;

    static createSocket(): SocketIOClient.Socket {
      const socket = RemoteLogger.io({
        transports: ['websocket'],
      });
      socket.on('connect_error', () => socket.close());
      return socket;
    }

    static join(...args) {
      return args
        .map(function(item) {
          if (item === null || item === undefined) {
            return 'null';
          }
          if (typeof item === 'object') {
            return JSON.stringify(item);
          }
          return '' + item;
        })
        .join(' ');
    }

    static factory(instance: RemoteLogger, name: string) {
      const levelName = name.toUpperCase();
      instance[name] = createEnabledLogMethod(LEVEL[name], () => {
        return (message?: any, ...optionalParams: any[]) => {
          instance.push(levelName, RemoteLogger.join(message, ...optionalParams));
        };
      });
    }

    static KEY_DATE = '${DATE}';
    static KEY_LEVEL = '${LEVEL}';
    static KEY_NAME = '${NAME}';
    static KEY_CONTENT = '${CONTENT}';

    static CONTENT_PATTERN = `[${RemoteLogger.KEY_DATE}] ${RemoteLogger.KEY_LEVEL} (${
      RemoteLogger.KEY_NAME
      }): ${RemoteLogger.KEY_CONTENT}`;

    private readonly name: string;
    private readonly pattern: string;
    private readonly socket: SocketIOClient.Socket;
    public debug: ILogging;
    public error: ILogging;
    public info: ILogging;

    constructor(name) {
      this.name = name;
      this.pattern = RemoteLogger.CONTENT_PATTERN.replace(RemoteLogger.KEY_NAME, this.name);
      this.socket = RemoteLogger.createSocket();
      RemoteLogger.factory(this, 'debug');
      RemoteLogger.factory(this, 'error');
      RemoteLogger.factory(this, 'info');
    }

    push(level: string, content: string) {
      content = `[${process.env.APP_NAME}]:${level}:[${new Date().toISOString()}]:${
        this.name
        }: ${content}`;
      this.emit(content);
    }

    private emit(content: string) {
      try {
        this.socket.emit('log', content);
      } catch (ignored) {}
    }
  }
  RemoteLogger.io = require('socket.io-client');
  return RemoteLogger;
})();

function getLogger(name: string): ILogger {
  if (!name) {
    return new CurrentLogger('root');
  }
  return new CurrentLogger(name);
}

export default getLogger;
