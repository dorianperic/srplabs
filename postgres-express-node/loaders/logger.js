const winston = require("winston");
const morgan = require("morgan");

const config = require("../config");

/**
 * console.{log, error, warn}
 */
const DefaultLogger = console;

/**
 * Winston logger configuration and instance
 */
const transports = [];
if (process.env.NODE_ENV !== "development") {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat()
      ),
    })
  );
}

winston.loggers.add("logger", {
  level: config.logs.winston.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});

const LoggerInstance = winston.loggers.get("logger");

/**
 * Morgan logger instance
 */
const HttpLoggerInstance = morgan(config.logs.morgan.format, {
  stream: {
    write(message) {
      LoggerInstance.info(message.substring(0, message.lastIndexOf("\n")));
    },
  },
});

morgan.token("user", (req, res) => (req.user ? req.user["username"] : ""));
morgan.token("role", (req, res) => (req.user ? req.user["role"] : ""));

module.exports = {
  Logger: LoggerInstance || DefaultLogger,
  HttpLogger: HttpLoggerInstance,
};
