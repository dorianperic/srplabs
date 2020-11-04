const winston = require("winston");
const UserService = require("./user.service");
const { User } = require("../models");
const LoginService = require("./login.service");
const logger = winston.loggers.get("logger");

exports.userServiceInstance = new UserService({ logger, userModel: User });
exports.loginServiceInstance = new LoginService({ logger, userModel: User });